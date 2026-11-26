import { prisma } from "./prisma";

export function listReservations() {
  return prisma.reservation.findMany({
    include: { equipment: true },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}

export async function approveReservation(id: number) {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { equipment: true },
  });

  if (!reservation) {
    return { kind: "missing" } as const;
  }

  if (reservation.equipment.available < 1) {
    return { kind: "out-of-stock" } as const;
  }

  await prisma.equipment.update({
    where: { id: reservation.equipmentId },
    data: { available: { decrement: 1 } },
  });

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status: "APPROVED" },
    include: { equipment: true },
  });

  return { kind: "approved", reservation: updated } as const;
}
