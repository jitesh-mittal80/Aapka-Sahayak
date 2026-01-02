/*
  Warnings:

  - The primary key for the `calllog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `phone` on the `calllog` table. All the data in the column will be lost.
  - You are about to drop the column `transcript` on the `calllog` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `calllog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `complaint` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category` on the `complaint` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `complaint` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The values [RESOLVED_PENDING_CONFIRMATION,CLOSED] on the enum `Complaint_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `callSid` to the `CallLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `complaintId` to the `CallLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `outcome` on table `calllog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `calllog` DROP PRIMARY KEY,
    DROP COLUMN `phone`,
    DROP COLUMN `transcript`,
    ADD COLUMN `callSid` VARCHAR(191) NOT NULL,
    ADD COLUMN `complaintId` INTEGER NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `outcome` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `complaint` DROP PRIMARY KEY,
    DROP COLUMN `category`,
    ADD COLUMN `citizenPhone` VARCHAR(191) NULL,
    ADD COLUMN `verifiedAt` DATETIME(3) NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED_PENDING_VERIFICATION', 'RESOLVED_CONFIRMED', 'REOPENED') NOT NULL DEFAULT 'OPEN',
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `CallLog` ADD CONSTRAINT `CallLog_complaintId_fkey` FOREIGN KEY (`complaintId`) REFERENCES `Complaint`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
