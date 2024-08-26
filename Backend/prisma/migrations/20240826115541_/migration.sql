-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userAddress` VARCHAR(191) NOT NULL,
    `userContact` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `userPassword` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_userEmail_key`(`userEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostelOwners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hostelName` VARCHAR(191) NOT NULL,
    `ownerName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contactNumber` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `hostelOwners_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
