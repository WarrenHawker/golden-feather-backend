/*
  Warnings:

  - You are about to drop the column `created_on` on the `AuthProvider` table. All the data in the column will be lost.
  - You are about to drop the column `provider_user_id` on the `AuthProvider` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `AuthProvider` table. All the data in the column will be lost.
  - You are about to drop the column `created_on` on the `Creator` table. All the data in the column will be lost.
  - You are about to drop the column `updated_on` on the `Creator` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Creator` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `Creator` table. All the data in the column will be lost.
  - You are about to drop the column `creator_id` on the `CreatorLanguageRelation` table. All the data in the column will be lost.
  - You are about to drop the column `language_id` on the `CreatorLanguageRelation` table. All the data in the column will be lost.
  - You are about to drop the column `creator_id` on the `CreatorTagRelation` table. All the data in the column will be lost.
  - You are about to drop the column `tag_id` on the `CreatorTagRelation` table. All the data in the column will be lost.
  - You are about to drop the column `created_on` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `guild_leader` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `updated_on` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `guild_id` on the `GuildLanguageRelation` table. All the data in the column will be lost.
  - You are about to drop the column `language_id` on the `GuildLanguageRelation` table. All the data in the column will be lost.
  - You are about to drop the column `guild_id` on the `GuildRegionRelation` table. All the data in the column will be lost.
  - You are about to drop the column `region_id` on the `GuildRegionRelation` table. All the data in the column will be lost.
  - You are about to drop the column `guild_id` on the `GuildTagRelation` table. All the data in the column will be lost.
  - You are about to drop the column `tag_id` on the `GuildTagRelation` table. All the data in the column will be lost.
  - You are about to drop the column `created_on` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_on` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `created_on` on the `UserDevice` table. All the data in the column will be lost.
  - You are about to drop the column `device_name` on the `UserDevice` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `UserDevice` table. All the data in the column will be lost.
  - You are about to drop the column `last_signin` on the `UserDevice` table. All the data in the column will be lost.
  - You are about to drop the column `session_id` on the `UserDevice` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `UserDevice` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserDevice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerUserId]` on the table `AuthProvider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Creator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `AuthProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `Creator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `CreatorLanguageRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageId` to the `CreatorLanguageRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `CreatorTagRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagId` to the `CreatorTagRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `Guild` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `GuildLanguageRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageId` to the `GuildLanguageRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `GuildRegionRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionId` to the `GuildRegionRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `GuildTagRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagId` to the `GuildTagRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceName` to the `UserDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ipAddress` to the `UserDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastSignin` to the `UserDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `UserDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgent` to the `UserDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserDevice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuthProvider" DROP CONSTRAINT "AuthProvider_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Creator" DROP CONSTRAINT "Creator_user_id_fkey";

-- DropForeignKey
ALTER TABLE "CreatorLanguageRelation" DROP CONSTRAINT "CreatorLanguageRelation_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "CreatorLanguageRelation" DROP CONSTRAINT "CreatorLanguageRelation_language_id_fkey";

-- DropForeignKey
ALTER TABLE "CreatorTagRelation" DROP CONSTRAINT "CreatorTagRelation_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "CreatorTagRelation" DROP CONSTRAINT "CreatorTagRelation_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_user_id_fkey";

-- DropForeignKey
ALTER TABLE "GuildLanguageRelation" DROP CONSTRAINT "GuildLanguageRelation_guild_id_fkey";

-- DropForeignKey
ALTER TABLE "GuildLanguageRelation" DROP CONSTRAINT "GuildLanguageRelation_language_id_fkey";

-- DropForeignKey
ALTER TABLE "GuildRegionRelation" DROP CONSTRAINT "GuildRegionRelation_guild_id_fkey";

-- DropForeignKey
ALTER TABLE "GuildRegionRelation" DROP CONSTRAINT "GuildRegionRelation_region_id_fkey";

-- DropForeignKey
ALTER TABLE "GuildTagRelation" DROP CONSTRAINT "GuildTagRelation_guild_id_fkey";

-- DropForeignKey
ALTER TABLE "GuildTagRelation" DROP CONSTRAINT "GuildTagRelation_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "UserDevice" DROP CONSTRAINT "UserDevice_user_id_fkey";

-- DropIndex
DROP INDEX "AuthProvider_provider_provider_user_id_key";

-- DropIndex
DROP INDEX "Creator_created_on_idx";

-- DropIndex
DROP INDEX "Creator_user_id_idx";

-- DropIndex
DROP INDEX "Creator_user_id_key";

-- DropIndex
DROP INDEX "CreatorLanguageRelation_creator_id_idx";

-- DropIndex
DROP INDEX "CreatorLanguageRelation_language_id_idx";

-- DropIndex
DROP INDEX "CreatorTagRelation_creator_id_idx";

-- DropIndex
DROP INDEX "CreatorTagRelation_tag_id_idx";

-- DropIndex
DROP INDEX "Guild_created_on_idx";

-- DropIndex
DROP INDEX "Guild_user_id_idx";

-- DropIndex
DROP INDEX "Guild_user_id_key";

-- DropIndex
DROP INDEX "GuildLanguageRelation_guild_id_idx";

-- DropIndex
DROP INDEX "GuildLanguageRelation_language_id_idx";

-- DropIndex
DROP INDEX "GuildRegionRelation_guild_id_idx";

-- DropIndex
DROP INDEX "GuildRegionRelation_region_id_idx";

-- DropIndex
DROP INDEX "GuildTagRelation_guild_id_idx";

-- DropIndex
DROP INDEX "GuildTagRelation_tag_id_idx";

-- DropIndex
DROP INDEX "User_created_on_idx";

-- AlterTable
ALTER TABLE "AuthProvider" DROP COLUMN "created_on",
DROP COLUMN "provider_user_id",
DROP COLUMN "user_id",
ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "providerUserId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Creator" DROP COLUMN "created_on",
DROP COLUMN "updated_on",
DROP COLUMN "user_id",
DROP COLUMN "video_url",
ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedOn" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CreatorLanguageRelation" DROP COLUMN "creator_id",
DROP COLUMN "language_id",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "languageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CreatorTagRelation" DROP COLUMN "creator_id",
DROP COLUMN "tag_id",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "tagId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "created_on",
DROP COLUMN "guild_leader",
DROP COLUMN "updated_on",
DROP COLUMN "user_id",
DROP COLUMN "video_url",
ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "guildLeader" TEXT,
ADD COLUMN     "updatedOn" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GuildLanguageRelation" DROP COLUMN "guild_id",
DROP COLUMN "language_id",
ADD COLUMN     "guildId" TEXT NOT NULL,
ADD COLUMN     "languageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GuildRegionRelation" DROP COLUMN "guild_id",
DROP COLUMN "region_id",
ADD COLUMN     "guildId" TEXT NOT NULL,
ADD COLUMN     "regionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GuildTagRelation" DROP COLUMN "guild_id",
DROP COLUMN "tag_id",
ADD COLUMN     "guildId" TEXT NOT NULL,
ADD COLUMN     "tagId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_on",
DROP COLUMN "updated_on",
ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserDevice" DROP COLUMN "created_on",
DROP COLUMN "device_name",
DROP COLUMN "ip_address",
DROP COLUMN "last_signin",
DROP COLUMN "session_id",
DROP COLUMN "user_agent",
DROP COLUMN "user_id",
ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deviceName" TEXT NOT NULL,
ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "lastSignin" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sessionId" TEXT NOT NULL,
ADD COLUMN     "userAgent" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthProvider_provider_providerUserId_key" ON "AuthProvider"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_userId_key" ON "Creator"("userId");

-- CreateIndex
CREATE INDEX "Creator_createdOn_idx" ON "Creator"("createdOn");

-- CreateIndex
CREATE INDEX "Creator_userId_idx" ON "Creator"("userId");

-- CreateIndex
CREATE INDEX "CreatorLanguageRelation_creatorId_idx" ON "CreatorLanguageRelation"("creatorId");

-- CreateIndex
CREATE INDEX "CreatorLanguageRelation_languageId_idx" ON "CreatorLanguageRelation"("languageId");

-- CreateIndex
CREATE INDEX "CreatorTagRelation_creatorId_idx" ON "CreatorTagRelation"("creatorId");

-- CreateIndex
CREATE INDEX "CreatorTagRelation_tagId_idx" ON "CreatorTagRelation"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_userId_key" ON "Guild"("userId");

-- CreateIndex
CREATE INDEX "Guild_createdOn_idx" ON "Guild"("createdOn");

-- CreateIndex
CREATE INDEX "Guild_userId_idx" ON "Guild"("userId");

-- CreateIndex
CREATE INDEX "GuildLanguageRelation_guildId_idx" ON "GuildLanguageRelation"("guildId");

-- CreateIndex
CREATE INDEX "GuildLanguageRelation_languageId_idx" ON "GuildLanguageRelation"("languageId");

-- CreateIndex
CREATE INDEX "GuildRegionRelation_guildId_idx" ON "GuildRegionRelation"("guildId");

-- CreateIndex
CREATE INDEX "GuildRegionRelation_regionId_idx" ON "GuildRegionRelation"("regionId");

-- CreateIndex
CREATE INDEX "GuildTagRelation_guildId_idx" ON "GuildTagRelation"("guildId");

-- CreateIndex
CREATE INDEX "GuildTagRelation_tagId_idx" ON "GuildTagRelation"("tagId");

-- CreateIndex
CREATE INDEX "User_createdOn_idx" ON "User"("createdOn");

-- AddForeignKey
ALTER TABLE "AuthProvider" ADD CONSTRAINT "AuthProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDevice" ADD CONSTRAINT "UserDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildTagRelation" ADD CONSTRAINT "GuildTagRelation_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildTagRelation" ADD CONSTRAINT "GuildTagRelation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "GuildTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creator" ADD CONSTRAINT "Creator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
