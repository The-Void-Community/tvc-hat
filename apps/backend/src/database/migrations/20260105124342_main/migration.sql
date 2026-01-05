-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chats" TEXT[] DEFAULT ARRAY[]::TEXT[];
