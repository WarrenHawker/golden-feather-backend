/*
  Warnings:

  - You are about to drop the column `providerUserId` on the `AuthProvider` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AuthProvider` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Creator` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Creator` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `CreatorLanguageRelation` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `CreatorLanguageRelation` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `CreatorTagRelation` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `CreatorTagRelation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `guildId` on the `GuildLanguageRelation` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `GuildLanguageRelation` table. All the data in the column will be lost.
  - You are about to drop the column `guildId` on the `GuildRegionRelation` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `GuildRegionRelation` table. All the data in the column will be lost.
  - You are about to drop the column `guildId` on the `GuildTagRelation` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `GuildTagRelation` table. All the data in the column will be lost.
  - You are about to drop the column `deviceName` on the `UserDevice` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `UserDevice` table. All the data in the column will be lost.
  - You are about to drop the column `lastSignin` on the `UserDevice` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `UserDevice` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `UserDevice` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserDevice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,provider_user_id]` on the table `AuthProvider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Creator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `AuthProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_url` to the `Creator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `CreatorLanguageRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_id` to the `CreatorLanguageRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `CreatorTagRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `CreatorTagRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_url` to the `Guild` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guild_id` to the `GuildLanguageRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_id` to the `GuildLanguageRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guild_id` to the `GuildRegionRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region_id` to the `GuildRegionRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guild_id` to the `GuildTagRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `GuildTagRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_name` to the `UserDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip_address` to the `UserDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_signin` to the `UserDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `UserDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_agent` to the `UserDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserDevice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuthProvider" DROP CONSTRAINT "AuthProvider_userId_fkey";

-- DropForeignKey
ALTER TABLE "Creator" DROP CONSTRAINT "Creator_userId_fkey";

-- DropForeignKey
ALTER TABLE "CreatorLanguageRelation" DROP CONSTRAINT "CreatorLanguageRelation_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "CreatorLanguageRelation" DROP CONSTRAINT "CreatorLanguageRelation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "CreatorTagRelation" DROP CONSTRAINT "CreatorTagRelation_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "CreatorTagRelation" DROP CONSTRAINT "CreatorTagRelation_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_userId_fkey";

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

-- DropForeignKey
ALTER TABLE "UserDevice" DROP CONSTRAINT "UserDevice_userId_fkey";

-- DropIndex
DROP INDEX "AuthProvider_provider_providerUserId_key";

-- DropIndex
DROP INDEX "Creator_userId_idx";

-- DropIndex
DROP INDEX "Creator_userId_key";

-- DropIndex
DROP INDEX "CreatorLanguageRelation_creatorId_idx";

-- DropIndex
DROP INDEX "CreatorLanguageRelation_languageId_idx";

-- DropIndex
DROP INDEX "CreatorTagRelation_creatorId_idx";

-- DropIndex
DROP INDEX "CreatorTagRelation_tagId_idx";

-- DropIndex
DROP INDEX "Guild_userId_idx";

-- DropIndex
DROP INDEX "Guild_userId_key";

-- DropIndex
DROP INDEX "GuildLanguageRelation_guildId_idx";

-- DropIndex
DROP INDEX "GuildLanguageRelation_languageId_idx";

-- DropIndex
DROP INDEX "GuildRegionRelation_guildId_idx";

-- DropIndex
DROP INDEX "GuildRegionRelation_regionId_idx";

-- DropIndex
DROP INDEX "GuildTagRelation_guildId_idx";

-- DropIndex
DROP INDEX "GuildTagRelation_tagId_idx";

-- AlterTable
ALTER TABLE "AuthProvider" DROP COLUMN "providerUserId",
DROP COLUMN "userId",
ADD COLUMN     "provider_user_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Creator" DROP COLUMN "userId",
DROP COLUMN "videoUrl",
ADD COLUMN     "user_id" TEXT,
ADD COLUMN     "video_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CreatorLanguageRelation" DROP COLUMN "creatorId",
DROP COLUMN "languageId",
ADD COLUMN     "creator_id" TEXT NOT NULL,
ADD COLUMN     "language_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CreatorTagRelation" DROP COLUMN "creatorId",
DROP COLUMN "tagId",
ADD COLUMN     "creator_id" TEXT NOT NULL,
ADD COLUMN     "tag_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "userId",
DROP COLUMN "videoUrl",
ADD COLUMN     "user_id" TEXT,
ADD COLUMN     "video_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GuildLanguageRelation" DROP COLUMN "guildId",
DROP COLUMN "languageId",
ADD COLUMN     "guild_id" TEXT NOT NULL,
ADD COLUMN     "language_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GuildRegionRelation" DROP COLUMN "guildId",
DROP COLUMN "regionId",
ADD COLUMN     "guild_id" TEXT NOT NULL,
ADD COLUMN     "region_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GuildTagRelation" DROP COLUMN "guildId",
DROP COLUMN "tagId",
ADD COLUMN     "guild_id" TEXT NOT NULL,
ADD COLUMN     "tag_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserDevice" DROP COLUMN "deviceName",
DROP COLUMN "ipAddress",
DROP COLUMN "lastSignin",
DROP COLUMN "sessionId",
DROP COLUMN "userAgent",
DROP COLUMN "userId",
ADD COLUMN     "device_name" TEXT NOT NULL,
ADD COLUMN     "ip_address" TEXT NOT NULL,
ADD COLUMN     "last_signin" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD COLUMN     "user_agent" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthProvider_provider_provider_user_id_key" ON "AuthProvider"("provider", "provider_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_user_id_key" ON "Creator"("user_id");

-- CreateIndex
CREATE INDEX "Creator_user_id_idx" ON "Creator"("user_id");

-- CreateIndex
CREATE INDEX "CreatorLanguageRelation_creator_id_idx" ON "CreatorLanguageRelation"("creator_id");

-- CreateIndex
CREATE INDEX "CreatorLanguageRelation_language_id_idx" ON "CreatorLanguageRelation"("language_id");

-- CreateIndex
CREATE INDEX "CreatorTagRelation_creator_id_idx" ON "CreatorTagRelation"("creator_id");

-- CreateIndex
CREATE INDEX "CreatorTagRelation_tag_id_idx" ON "CreatorTagRelation"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_user_id_key" ON "Guild"("user_id");

-- CreateIndex
CREATE INDEX "Guild_user_id_idx" ON "Guild"("user_id");

-- CreateIndex
CREATE INDEX "GuildLanguageRelation_guild_id_idx" ON "GuildLanguageRelation"("guild_id");

-- CreateIndex
CREATE INDEX "GuildLanguageRelation_language_id_idx" ON "GuildLanguageRelation"("language_id");

-- CreateIndex
CREATE INDEX "GuildRegionRelation_guild_id_idx" ON "GuildRegionRelation"("guild_id");

-- CreateIndex
CREATE INDEX "GuildRegionRelation_region_id_idx" ON "GuildRegionRelation"("region_id");

-- CreateIndex
CREATE INDEX "GuildTagRelation_guild_id_idx" ON "GuildTagRelation"("guild_id");

-- CreateIndex
CREATE INDEX "GuildTagRelation_tag_id_idx" ON "GuildTagRelation"("tag_id");

-- AddForeignKey
ALTER TABLE "AuthProvider" ADD CONSTRAINT "AuthProvider_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDevice" ADD CONSTRAINT "UserDevice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildTagRelation" ADD CONSTRAINT "GuildTagRelation_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildTagRelation" ADD CONSTRAINT "GuildTagRelation_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "GuildTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creator" ADD CONSTRAINT "Creator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorTagRelation" ADD CONSTRAINT "CreatorTagRelation_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorTagRelation" ADD CONSTRAINT "CreatorTagRelation_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "CreatorTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorLanguageRelation" ADD CONSTRAINT "CreatorLanguageRelation_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorLanguageRelation" ADD CONSTRAINT "CreatorLanguageRelation_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildLanguageRelation" ADD CONSTRAINT "GuildLanguageRelation_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildLanguageRelation" ADD CONSTRAINT "GuildLanguageRelation_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildRegionRelation" ADD CONSTRAINT "GuildRegionRelation_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildRegionRelation" ADD CONSTRAINT "GuildRegionRelation_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;
