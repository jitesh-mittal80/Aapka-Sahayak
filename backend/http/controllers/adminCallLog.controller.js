import prisma from "../../prisma/client.js";

export const getCallLogs = async (req, res) => {
  try {
    const logs = await prisma.callLog.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
