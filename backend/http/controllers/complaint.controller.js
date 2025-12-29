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
        description,
        category,
        citizenId: citizen.id, // ✅ UUID string
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
