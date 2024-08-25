/*
  Warnings:

  - You are about to drop the column `deleted_on` on the `AdminContentCreator` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `AdminGuild` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_on` on the `PublicContentCreator` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `PublicGuild` table. All the data in the column will be lost.
  - Added the required column `description` to the `AdminGuild` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `PublicGuild` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminContentCreator" DROP COLUMN "deleted_on";

-- AlterTable
ALTER TABLE "AdminGuild" DROP COLUMN "bio",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublicContentCreator" DROP COLUMN "deleted_on";

-- AlterTable
ALTER TABLE "PublicGuild" DROP COLUMN "bio",
ADD COLUMN     "description" TEXT NOT NULL;
