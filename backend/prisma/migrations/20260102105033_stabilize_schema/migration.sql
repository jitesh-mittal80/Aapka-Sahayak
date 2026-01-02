/*
  Warnings:

  - The primary key for the `complaint` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `calllog` DROP FOREIGN KEY `CallLog_complaintId_fkey`;

-- AlterTable
ALTER TABLE `calllog` MODIFY `complaintId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `complaint` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `CallLog` ADD CONSTRAINT `CallLog_complaintId_fkey` FOREIGN KEY (`complaintId`) REFERENCES `Complaint`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
