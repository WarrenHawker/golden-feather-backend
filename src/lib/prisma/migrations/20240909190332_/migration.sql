/*
  Warnings:

  - You are about to drop the column `languageId` on the `Creator` table. All the data in the column will be lost.
  - Added the required column `videoUrl` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreatorLanguageRelation" DROP CONSTRAINT "CreatorLanguageRelation_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "CreatorLanguageRelation" DROP CONSTRAINT "CreatorLanguageRelation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "CreatorTagRelation" DROP CONSTRAINT "CreatorTagRelation_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "CreatorTagRelation" DROP CONSTRAINT "CreatorTagRelation_tagId_fkey";

-- DropForeignKey
ALTER TABLE "GuildLanguageRelation" DROP CONSTRAINT "GuildLanguageRelation_guildId_fkey";

-- DropForeignKey
ALTER TABLE "GuildLanguageRelation" DROP CONSTRAINT "GuildLanguageRelation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "GuildRegionRelation" DROP CONSTRAINT "GuildRegionRelation_guildId_fkey";

-- DropForeignKey
ALTER TABLE "GuildRegionRelation" DROP CONSTRAINT "GuildRegionRelation_regionId_fkey";

-- DropForeignKey
ALTER TABLE "GuildTagRelation" DROP CONSTRAINT "GuildTagRelation_guildId_fkey";

-- DropForeignKey
ALTER TABLE "GuildTagRelation" DROP CONSTRAINT "GuildTagRelation_tagId_fkey";

-- DropIndex
DROP INDEX "Creator_languageId_idx";

-- AlterTable
ALTER TABLE "Creator" DROP COLUMN "languageId";

-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GuildTagRelation" ADD CONSTRAINT "GuildTagRelation_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildTagRelation" ADD CONSTRAINT "GuildTagRelation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "GuildTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorTagRelation" ADD CONSTRAINT "CreatorTagRelation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorTagRelation" ADD CONSTRAINT "CreatorTagRelation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "CreatorTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorLanguageRelation" ADD CONSTRAINT "CreatorLanguageRelation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorLanguageRelation" ADD CONSTRAINT "CreatorLanguageRelation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildLanguageRelation" ADD CONSTRAINT "GuildLanguageRelation_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildLanguageRelation" ADD CONSTRAINT "GuildLanguageRelation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildRegionRelation" ADD CONSTRAINT "GuildRegionRelation_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildRegionRelation" ADD CONSTRAINT "GuildRegionRelation_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;
