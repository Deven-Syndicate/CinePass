/*
  Warnings:

  - A unique constraint covering the columns `[showId,seatId]` on the table `BookingSeat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BookingSeat" ADD COLUMN     "showId" INTEGER;

-- CreateIndex
CREATE INDEX "BookingSeat_showId_idx" ON "BookingSeat"("showId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingSeat_showId_seatId_key" ON "BookingSeat"("showId", "seatId");
