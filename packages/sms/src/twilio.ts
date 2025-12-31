import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_PHONE_NUMBER!;
const virtualPhoneNumber = process.env.TWILIO_VIRTUAL_PHONE_NUMBER!;
const shouldUseVirtualPhoneNumber = process.env.TWILIO_VIRTUAL_PHONE_NUMBER_ENABLED === "true";

const client = Twilio(accountSid, authToken);

export async function sendSMS(to: string | null, body: string): Promise<void> {
  if (shouldUseVirtualPhoneNumber && !to) {
    console.warn("No phone number provided, using virtual phone number");
    to = virtualPhoneNumber;
  }

  if (!to) {
    console.error("No phone number provided, skipping SMS");
    return;
  }

  await client.messages.create({
    to,
    from: fromNumber,
    body,
  });
}
