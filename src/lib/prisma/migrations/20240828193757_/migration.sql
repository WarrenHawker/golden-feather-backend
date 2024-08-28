/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `AdminCreator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `AdminCreator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `AdminGuild` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `PublicCreator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `PublicCreator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `PublicGuild` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `AdminCreator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `AdminGuild` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `PublicCreator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `PublicGuild` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminCreator" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AdminGuild" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublicCreator" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublicGuild" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdminCreator_name_key" ON "AdminCreator"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AdminCreator_slug_key" ON "AdminCreator"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminGuild_slug_key" ON "AdminGuild"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PublicCreator_name_key" ON "PublicCreator"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PublicCreator_slug_key" ON "PublicCreator"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PublicGuild_slug_key" ON "PublicGuild"("slug");
