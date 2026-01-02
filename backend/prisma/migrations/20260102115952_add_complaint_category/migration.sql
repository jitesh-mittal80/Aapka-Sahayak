-- AlterTable
ALTER TABLE `complaint` ADD COLUMN `category` ENUM('GARBAGE', 'WATER', 'SEWER', 'ROAD', 'STREET_LIGHT', 'OTHER') NULL;
