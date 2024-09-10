/*
  Warnings:

  - Added the required column `excerpt` to the `Creator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excerpt` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Creator" ADD COLUMN     "excerpt" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "excerpt" TEXT NOT NULL;
