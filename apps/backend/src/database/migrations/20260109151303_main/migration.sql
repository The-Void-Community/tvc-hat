/*
  Warnings:

  - You are about to drop the column `deliveredTo` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `readedBy` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "deliveredTo",
DROP COLUMN "readedBy";
