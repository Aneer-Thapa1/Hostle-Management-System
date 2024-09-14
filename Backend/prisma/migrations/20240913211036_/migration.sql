/*
  Warnings:

  - You are about to drop the `tokenblacklist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `tokenblacklist`;

-- CreateTable
CREATE TABLE `Deal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `roomType` VARCHAR(191) NOT NULL,
    `discount` DOUBLE NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `hostelOwnerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Deal` ADD CONSTRAINT `Deal_hostelOwnerId_fkey` FOREIGN KEY (`hostelOwnerId`) REFERENCES `HostelOwner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
