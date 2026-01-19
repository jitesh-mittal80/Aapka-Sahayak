import bcrypt from "bcrypt";
import prisma from "../../prisma/client.js";
import jwt from "jsonwebtoken";

export const adminLogin = async (email, password) => {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });
  
  if (!admin) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};
