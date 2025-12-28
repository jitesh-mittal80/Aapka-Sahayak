const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function findOrCreateCitizen({ name, phone, language }) {
  const existingCitizen = await prisma.citizen.findUnique({
    where: { phone },
  });

  if (existingCitizen) {
    return existingCitizen;
  }

  const newCitizen = await prisma.citizen.create({
    data: { name, phone, language },
  });

  return newCitizen;
}

module.exports = { findOrCreateCitizen };
