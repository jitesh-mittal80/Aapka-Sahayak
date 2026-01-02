import prisma from "../../prisma/client.js";
import { initiateOutboundCall } from "../services/call.service.js";

export async function markResolvedAndCallCitizen(complaintId) {
  const complaint = await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      status: "RESOLVED_PENDING_VERIFICATION",
    },
  });

  if (complaint.citizenPhone) {
    await initiateOutboundCall(complaint);
  }

  return complaint;
}
