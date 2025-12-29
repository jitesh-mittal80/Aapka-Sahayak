/*
  Warnings:

  - You are about to drop the column `complaintNumber` on the `complaint` table. All the data in the column will be lost.
  - You are about to drop the column `parentComplaintId` on the `complaint` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `complaint` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Complaint_complaintNumber_key` ON `complaint`;

-- DropIndex
DROP INDEX `Complaint_status_idx` ON `complaint`;

-- AlterTable
ALTER TABLE `complaint` DROP COLUMN `complaintNumber`,
    DROP COLUMN `parentComplaintId`,
    DROP COLUMN `updatedAt`;
