import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const STARTER_CATEGORIES = ["Uncategorized", "Food", "Transport", "Utilities", "Entertainment", "Other"];

async function main() {
  for (const name of STARTER_CATEGORIES) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, isDefault: name === "Uncategorized" },
    });
  }

  const adminEmail = "admin@retain.app";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin123!", 10);
    await prisma.user.create({
      data: {
        name: "Retain Admin",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`Seeded admin user: ${adminEmail} / Admin123!`);
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
