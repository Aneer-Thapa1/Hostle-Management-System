/*
  Warnings:

  - You are about to drop the column `discount` on the `deal` table. All the data in the column will be lost.
  - You are about to drop the column `roomType` on the `deal` table. All the data in the column will be lost.
  - Added the required column `amenities` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePrice` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `features` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxOccupancy` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageType` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termsAndConditions` to the `Deal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deal` DROP COLUMN `discount`,
    DROP COLUMN `roomType`,
    ADD COLUMN `amenities` TEXT NOT NULL,
    ADD COLUMN `basePrice` DOUBLE NOT NULL,
    ADD COLUMN `discountPrice` DOUBLE NULL,
    ADD COLUMN `features` TEXT NOT NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `maxOccupancy` INTEGER NOT NULL,
    ADD COLUMN `packageType` VARCHAR(191) NOT NULL,
    ADD COLUMN `termsAndConditions` TEXT NOT NULL,
    MODIFY `startDate` DATETIME(3) NULL,
    MODIFY `endDate` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `_DealToRoom` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DealToRoom_AB_unique`(`A`, `B`),
    INDEX `_DealToRoom_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DealToRoom` ADD CONSTRAINT `_DealToRoom_A_fkey` FOREIGN KEY (`A`) REFERENCES `Deal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DealToRoom` ADD CONSTRAINT `_DealToRoom_B_fkey` FOREIGN KEY (`B`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
