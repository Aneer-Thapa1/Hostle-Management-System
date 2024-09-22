-- CreateTable
CREATE TABLE `HostelMembership` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `hostelId` INTEGER NOT NULL,
    `joinDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `membershipType` VARCHAR(191) NOT NULL,
    `expiryDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `HostelMembership_userId_hostelId_key`(`userId`, `hostelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HostelMembership` ADD CONSTRAINT `HostelMembership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HostelMembership` ADD CONSTRAINT `HostelMembership_hostelId_fkey` FOREIGN KEY (`hostelId`) REFERENCES `HostelOwner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
