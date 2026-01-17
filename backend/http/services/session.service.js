import prisma from "../../prisma/client.js";

export async function getOrCreateSession(callerId) {
  let session = await prisma.callerSession.findUnique({
    where: { callerId }
  });

  if (!session) {
    session = await prisma.callerSession.create({
      data: {
        callerId,
        currentStep: "START",
        context: {}
      }
    });
  }

  return session;
}

export async function updateSession(callerId, updates) {
  return prisma.callerSession.update({
    where: { callerId },
    data: updates
  });
}
