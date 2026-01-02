import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComplaint = async (req, res) => {
  try {
    const { name, phone, description, category } = req.body;

    // 1️⃣ Basic validation
    if (!name || !phone || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Find or create citizen (Step 1 reused)
    const citizen = await prisma.citizen.upsert({
      where: { phone },
      update: { name },
      create: { name, phone },
    });

    // 3️⃣ Create complaint
    const complaint = await prisma.complaint.create({
      data: {
        description: speechText,
        category: "UNCLASSIFIED",
        citizenId: citizen.id,
      },
    });
    const aiResult = await analyzeComplaint(speechText);

    await prisma.complaint.update({
      where: { id: complaint.id },
      data: {
        category: aiResult.category,
      },
    });
    // 4️⃣ Response
    return res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      complaint,
    });
  } catch (error) {
    console.error("Create Complaint Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // ✅ STEP 1: Check if complaint exists
    const existingComplaint = await prisma.complaint.findUnique({
      where: { id },
    });

    if (!existingComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // ✅ STEP 2: Update status
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json({
      success: true,
      message: "Complaint status updated",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Update Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

import { mapAIResponseToStatus } from "../services/aiVerification.service.js";

export const aiVerifyComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { aiResponse } = req.body;

    if (!aiResponse) {
      return res.status(400).json({
        success: false,
        message: "AI response is required",
      });
    }

    const newStatus = mapAIResponseToStatus(aiResponse);

    if (!newStatus) {
      return res.status(400).json({
        success: false,
        message: "Invalid AI response",
      });
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { status: newStatus },
    });

    return res.status(200).json({
      success: true,
      message: "AI verification processed",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("AI Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI verification failed",
    });
  }
};

import { markResolvedAndCallCitizen } from "../services/complaint.service.js";

export async function markComplaintResolved(req, res) {
  const { id } = req.params;

  await markResolvedAndCallCitizen(id);

  res.json({
    message: "Complaint marked resolved. Outbound verification call triggered.",
  });
}
