import prisma from "../../prisma/client.js";

export const getAllCitizens = async (req, res) => {
  try {
    const citizens = await prisma.citizen.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { complaints: true },
        },
      },
    });

    res.json(
      citizens.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        language: c.language,
        complaintsCount: c._count.complaints,
        createdAt: c.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
