import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";

const run = async () => {
  const email = "jitesh@admin.in";
  const plainPassword = "mypassword123";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.admin.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });

  console.log("✅ Admin password reset successfully");
  process.exit(0);
};

run();
