import { prisma } from "./prisma";
import { hashPassword } from "./auth";

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "changeme123";

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    const hashedPassword = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    console.log(`Admin user created: ${email}`);
  } else {
    console.log("Admin user already exists");
  }
}

