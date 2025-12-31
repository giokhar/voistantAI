import { NextResponse } from "next/server";
import { Retell } from "retell-sdk";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendSMS } from "@packages/sms";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-retell-signature") || "";

  // Verify webhook signature
  if (!Retell.verify(rawBody, process.env.RETELL_API_KEY!, signature)) {
    console.error("Invalid Retell webhook signature");
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const { event, call } = JSON.parse(rawBody);

  // Only process call_analyzed (has transcript + analysis)
  if (event !== "call_analyzed") {
    return new NextResponse(null, { status: 204 });
  }

  const adminClient = await createAdminClient();

  // Find customer by Retell agent ID
  const { data: customer, error: custErr } = await adminClient
    .from("customers")
    .select("id, contact_phone_number, business_name")
    .eq("retell_agent_id", call.agent_id)
    .single();

  if (custErr || !customer) {
    console.error("Unknown agent_id:", call.agent_id);
    return new NextResponse(null, { status: 204 });
  }

  const startMs = Number(call.start_timestamp);
  const endMs = Number(call.end_timestamp);
  const durationSeconds = Math.max(0, Math.floor((endMs - startMs) / 1000));

  const { error: insertErr } = await adminClient.from("calls").upsert(
    {
      customer_id: customer.id,
      external_call_id: call.call_id,
      started_at: new Date(startMs).toISOString(),
      ended_at: new Date(endMs).toISOString(),
      duration_seconds: durationSeconds,
      transcript: call.transcript ?? null,
      call_analysis: call.call_analysis ?? null,
    },
    { onConflict: "external_call_id" },
  );

  if (insertErr) {
    console.error("Failed to insert call:", insertErr);
  }

  // Send SMS notification if customer has a phone number
  const summary = call.call_analysis?.call_summary ?? "No summary available";
  const durationMin = Math.ceil(durationSeconds / 60);

  try {
    await sendSMS(customer.contact_phone_number, `New call completed (${durationMin} min). Summary: ${summary}`);
  } catch (smsErr) {
    console.error("Failed to send SMS:", smsErr);
  }

  return new NextResponse(null, { status: 204 });
}
