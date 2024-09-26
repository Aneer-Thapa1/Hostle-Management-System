/*
  Warnings:

  - You are about to drop the column `dealId` on the `booking` table. All the data in the column will be lost.
  - Added the required column `numberOfStudents` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `dealId`,
    ADD COLUMN `numberOfStudents` INTEGER NOT NULL,
    ADD COLUMN `packageId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
