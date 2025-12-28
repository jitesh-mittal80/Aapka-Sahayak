const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function findOrCreateCitizen({ name, phone, language }) {
  const existingCitizen = await prisma.citizen.findUnique({
    where: { phone },
  });

  if (existingCitizen) {
    return existingCitizen;
  }

  return prisma.citizen.create({
    data: {
      name,
      phone,
      language,
    },
  });
}

module.exports = { findOrCreateCitizen };
