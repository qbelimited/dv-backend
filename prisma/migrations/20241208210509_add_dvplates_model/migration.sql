-- CreateTable
CREATE TABLE "Dvplates" (
    "id" TEXT NOT NULL,
    "dv_plate_number" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "creation_date" TEXT,
    "batch" TEXT NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dvplates_pkey" PRIMARY KEY ("id")
);
