-- CreateTable
CREATE TABLE `CallerSession` (
    `id` VARCHAR(191) NOT NULL,
    `callerId` VARCHAR(191) NOT NULL,
    `currentStep` VARCHAR(191) NULL,
    `context` JSON NULL,
    `lastActiveAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CallerSession_callerId_key`(`callerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
