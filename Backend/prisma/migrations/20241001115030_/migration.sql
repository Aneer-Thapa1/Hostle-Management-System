-- CreateTable
CREATE TABLE `Conversation` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `lastMessageAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Conversation_lastMessageAt_idx`(`lastMessageAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConversationParticipant` (
    `id` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `hostelOwnerId` INTEGER NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `leftAt` DATETIME(3) NULL,

    INDEX `ConversationParticipant_conversationId_userId_hostelOwnerId_idx`(`conversationId`, `userId`, `hostelOwnerId`),
    UNIQUE INDEX `ConversationParticipant_conversationId_userId_key`(`conversationId`, `userId`),
    UNIQUE INDEX `ConversationParticipant_conversationId_hostelOwnerId_key`(`conversationId`, `hostelOwnerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `senderId` INTEGER NOT NULL,
    `senderType` ENUM('USER', 'HOSTEL_OWNER') NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Message_conversationId_createdAt_idx`(`conversationId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MessageRead` (
    `id` VARCHAR(191) NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `hostelOwnerId` INTEGER NULL,
    `readAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MessageRead_messageId_userId_hostelOwnerId_idx`(`messageId`, `userId`, `hostelOwnerId`),
    UNIQUE INDEX `MessageRead_messageId_userId_key`(`messageId`, `userId`),
    UNIQUE INDEX `MessageRead_messageId_hostelOwnerId_key`(`messageId`, `hostelOwnerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ConversationParticipant` ADD CONSTRAINT `ConversationParticipant_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationParticipant` ADD CONSTRAINT `ConversationParticipant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationParticipant` ADD CONSTRAINT `ConversationParticipant_hostelOwnerId_fkey` FOREIGN KEY (`hostelOwnerId`) REFERENCES `HostelOwner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MessageRead` ADD CONSTRAINT `MessageRead_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Message`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MessageRead` ADD CONSTRAINT `MessageRead_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MessageRead` ADD CONSTRAINT `MessageRead_hostelOwnerId_fkey` FOREIGN KEY (`hostelOwnerId`) REFERENCES `HostelOwner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
