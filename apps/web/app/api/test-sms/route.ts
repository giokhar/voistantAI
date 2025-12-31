import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { sendSMS } from "@packages/sms";

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return notFound();
  }

  const to = process.env.TWILIO_VIRTUAL_PHONE_NUMBER;

  if (!to) {
    return NextResponse.json({ error: "TWILIO_VIRTUAL_PHONE_NUMBER env variable not set" }, { status: 500 });
  }

  try {
    await sendSMS(to, "Test message from Voistant! 🎉");
    return NextResponse.json({ success: true, to });
  } catch (error) {
    console.error("SMS error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
