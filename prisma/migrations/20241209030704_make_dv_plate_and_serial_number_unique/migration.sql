/*
  Warnings:

  - A unique constraint covering the columns `[dv_plate_number]` on the table `Dvplates` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serial_number]` on the table `Dvplates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dvplates_dv_plate_number_key" ON "Dvplates"("dv_plate_number");

-- CreateIndex
CREATE UNIQUE INDEX "Dvplates_serial_number_key" ON "Dvplates"("serial_number");
