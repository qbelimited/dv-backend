-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'embosser', 'manufacturer', 'user');

-- CreateEnum
CREATE TYPE "Action" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN_ATTEMPT', 'LOGIN_SUCCESSFUL', 'LOGIN_FAILURE', 'LOGOUT', 'FORGOT_PASSWORD_ATTEMPT', 'LOGIN_STATUS_CHANGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "action" "Action" NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dvplates" (
    "id" TEXT NOT NULL,
    "dv_plate_number" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "creation_date" TEXT,
    "description" TEXT,
    "log_book_number" TEXT,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "batchId" TEXT NOT NULL,

    CONSTRAINT "Dvplates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dvbatches" (
    "id" TEXT NOT NULL,
    "batch_number" TEXT NOT NULL,
    "requested_by" TEXT,
    "status" TEXT,
    "description" TEXT,
    "total_dvplates" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "manufacturerId" TEXT,

    CONSTRAINT "Dvbatches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchHistory" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturers" (
    "id" TEXT NOT NULL,
    "manufacturer_name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manufacturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPerson" (
    "id" TEXT NOT NULL,
    "contact_person_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "manufacturerId" TEXT,

    CONSTRAINT "ContactPerson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dvplates_dv_plate_number_key" ON "Dvplates"("dv_plate_number");

-- CreateIndex
CREATE UNIQUE INDEX "Dvplates_serial_number_key" ON "Dvplates"("serial_number");

-- CreateIndex
CREATE UNIQUE INDEX "Dvbatches_batch_number_key" ON "Dvbatches"("batch_number");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturers_manufacturer_name_key" ON "manufacturers"("manufacturer_name");

-- CreateIndex
CREATE UNIQUE INDEX "ContactPerson_contact_person_name_key" ON "ContactPerson"("contact_person_name");

-- CreateIndex
CREATE UNIQUE INDEX "ContactPerson_email_key" ON "ContactPerson"("email");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dvplates" ADD CONSTRAINT "Dvplates_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Dvbatches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchHistory" ADD CONSTRAINT "BatchHistory_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Dvbatches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchHistory" ADD CONSTRAINT "BatchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactPerson" ADD CONSTRAINT "ContactPerson_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
