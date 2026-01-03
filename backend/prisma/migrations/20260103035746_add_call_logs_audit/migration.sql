/*
  Warnings:

  - You are about to drop the column `outcome` on the `calllog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[callSid]` on the table `CallLog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `calllog` DROP COLUMN `outcome`,
    ADD COLUMN `aiDecision` VARCHAR(191) NULL,
    ADD COLUMN `confidence` DOUBLE NULL,
    ADD COLUMN `speechResult` VARCHAR(191) NULL,
    ADD COLUMN `verifiedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `CallLog_callSid_key` ON `CallLog`(`callSid`);
