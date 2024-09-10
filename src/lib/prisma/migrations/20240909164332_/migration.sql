/*
  Warnings:

  - You are about to drop the column `languageId` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `Guild` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Creator" DROP CONSTRAINT "Creator_languageId_fkey";

-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_languageId_fkey";

-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_regionId_fkey";

-- DropIndex
DROP INDEX "Guild_languageId_idx";

-- DropIndex
DROP INDEX "Guild_regionId_idx";

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "languageId",
DROP COLUMN "regionId";

-- CreateTable
CREATE TABLE "CreatorLanguageRelation" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "CreatorLanguageRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildLanguageRelation" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "GuildLanguageRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildRegionRelation" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "GuildRegionRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreatorLanguageRelation_creatorId_idx" ON "CreatorLanguageRelation"("creatorId");

-- CreateIndex
CREATE INDEX "CreatorLanguageRelation_languageId_idx" ON "CreatorLanguageRelation"("languageId");

-- CreateIndex
CREATE INDEX "GuildLanguageRelation_guildId_idx" ON "GuildLanguageRelation"("guildId");

-- CreateIndex
CREATE INDEX "GuildLanguageRelation_languageId_idx" ON "GuildLanguageRelation"("languageId");

-- CreateIndex
CREATE INDEX "GuildRegionRelation_guildId_idx" ON "GuildRegionRelation"("guildId");

-- CreateIndex
CREATE INDEX "GuildRegionRelation_regionId_idx" ON "GuildRegionRelation"("regionId");

-- CreateIndex
CREATE INDEX "CreatorTag_name_idx" ON "CreatorTag"("name");

-- CreateIndex
CREATE INDEX "GuildTag_name_idx" ON "GuildTag"("name");

-- AddForeignKey
ALTER TABLE "CreatorLanguageRelation" ADD CONSTRAINT "CreatorLanguageRelation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorLanguageRelation" ADD CONSTRAINT "CreatorLanguageRelation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildLanguageRelation" ADD CONSTRAINT "GuildLanguageRelation_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildLanguageRelation" ADD CONSTRAINT "GuildLanguageRelation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildRegionRelation" ADD CONSTRAINT "GuildRegionRelation_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildRegionRelation" ADD CONSTRAINT "GuildRegionRelation_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
