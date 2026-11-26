CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'APPROVED');

CREATE TABLE "Equipment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "available" INTEGER NOT NULL,
    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "requester" TEXT NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Equipment_name_key" ON "Equipment"("name");
CREATE INDEX "Reservation_equipmentId_idx" ON "Reservation"("equipmentId");

ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
