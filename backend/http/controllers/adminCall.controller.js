import prisma from "../../prisma/client.js";

export const triggerVerificationCall = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch complaint
    const complaint = await prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 2. MOCK call trigger (for now)
    console.log("📞 Calling:", complaint.citizenPhone);

    // 3. Update status → pending verification
    await prisma.complaint.update({
      where: { id },
      data: {
        status: "RESOLVED_PENDING_VERIFICATION",
      },
    });

    res.json({
      success: true,
      message: "Verification call triggered",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
