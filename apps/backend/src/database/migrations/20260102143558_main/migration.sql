/*
  Warnings:

  - Made the column `rights` on table `Chat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "rights" SET NOT NULL,
ALTER COLUMN "rights" SET DEFAULT '{}';
