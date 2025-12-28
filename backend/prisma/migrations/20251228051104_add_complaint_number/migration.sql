-- CreateTable
CREATE TABLE `Citizen` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Citizen_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Complaint` (
    `id` VARCHAR(191) NOT NULL,
    `complaintNumber` VARCHAR(191) NOT NULL,
    `citizenId` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('OPEN', 'RESOLVED_PENDING_CONFIRMATION', 'CLOSED', 'REOPENED') NOT NULL DEFAULT 'OPEN',
    `parentComplaintId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Complaint_complaintNumber_key`(`complaintNumber`),
    INDEX `Complaint_citizenId_idx`(`citizenId`),
    INDEX `Complaint_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CallLog` (
    `id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `direction` ENUM('INBOUND', 'OUTBOUND') NOT NULL,
    `transcript` VARCHAR(191) NULL,
    `outcome` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Complaint` ADD CONSTRAINT `Complaint_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `Citizen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
