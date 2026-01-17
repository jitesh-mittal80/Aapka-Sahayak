import prisma from "../../prisma/client.js";
import { analyzeComplaint } from "./aiUnderstanding.service.js";

/**
 * Generates a short memory summary for a caller session
 */
export async function generateSessionSummary(callerPhone) {
  const session = await prisma.callerSession.findUnique({
    where: { callerId: callerPhone },
  });

  if (!session || !session.context?.complaintId) return;

  const complaint = await prisma.complaint.findUnique({
    where: { id: session.context.complaintId },
  });

  if (!complaint) return;

  const summary = `Caller reported a ${complaint.category
    .replace("_", " ")
    .toLowerCase()} issue. Complaint was ${
    complaint.status === "RESOLVED_CONFIRMED"
      ? "resolved and verified"
      : "registered"
  }.`;

  await prisma.callerSession.update({
    where: { callerId: callerPhone },
    data: {
      context: {
        summary,
        lastOutcome: complaint.status,
      },
    },
  });
}
