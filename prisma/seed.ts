import { prisma } from "../src/lib/prisma.ts";

async function seed() {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.equipment.count();
    if (existing > 0) {
      console.log("Equipment data already exists. Seed skipped.");
      return;
    }

    await tx.equipment.create({
      data: {
        name: "USB-C dock",
        available: 3,
        reservations: {
          create: [
            { requester: "Maya Chen" },
            { requester: "Alex Silva", status: "APPROVED" },
          ],
        },
      },
    });

    await tx.equipment.create({
      data: {
        name: "Portable monitor",
        available: 1,
        reservations: {
          create: [{ requester: "Jordan Lee" }, { requester: "Sam Patel" }],
        },
      },
    });

    await tx.equipment.create({
      data: {
        name: "Noise-cancelling headset",
        available: 0,
        reservations: { create: { requester: "Taylor Morgan" } },
      },
    });
  });
}

try {
  await seed();
} finally {
  await prisma.$disconnect();
}
