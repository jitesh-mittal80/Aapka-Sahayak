import twilio from "twilio";
import prisma from "../../prisma/client.js";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function initiateOutboundCall(complaint) {
  if (!process.env.TWILIO_PHONE_NUMBER) {
    console.error("TWILIO_PHONE_NUMBER missing in env");
    return;
  }

  const call = await client.calls.create({
    to: complaint.citizenPhone,
    from: process.env.TWILIO_PHONE_NUMBER,
    url: `${process.env.NGROK_URL}/voice/outbound?complaintId=${complaint.id}`,
  });

  await prisma.callLog.create({
    data: {
      complaintId: complaint.id,
      callSid: call.sid,
      direction: "OUTBOUND",
      outcome: "INITIATED",
    },
  });
}
