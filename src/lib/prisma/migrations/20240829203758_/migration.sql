/*
  Warnings:

  - You are about to drop the `AdminCreator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminCreatorTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminGuild` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminGuildTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublicCreator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublicCreatorTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublicGuild` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublicGuildTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdminCreator" DROP CONSTRAINT "AdminCreator_languageId_fkey";

-- DropForeignKey
ALTER TABLE "AdminCreatorTag" DROP CONSTRAINT "AdminCreatorTag_adminCreatorId_fkey";

-- DropForeignKey
ALTER TABLE "AdminCreatorTag" DROP CONSTRAINT "AdminCreatorTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "AdminGuild" DROP CONSTRAINT "AdminGuild_languageId_fkey";

-- DropForeignKey
ALTER TABLE "AdminGuild" DROP CONSTRAINT "AdminGuild_regionId_fkey";

-- DropForeignKey
ALTER TABLE "AdminGuildTag" DROP CONSTRAINT "AdminGuildTag_adminGuildId_fkey";

-- DropForeignKey
ALTER TABLE "AdminGuildTag" DROP CONSTRAINT "AdminGuildTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "PublicCreator" DROP CONSTRAINT "PublicCreator_languageId_fkey";

-- DropForeignKey
ALTER TABLE "PublicCreatorTag" DROP CONSTRAINT "PublicCreatorTag_publicCreatorId_fkey";

-- DropForeignKey
ALTER TABLE "PublicCreatorTag" DROP CONSTRAINT "PublicCreatorTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "PublicGuild" DROP CONSTRAINT "PublicGuild_languageId_fkey";

-- DropForeignKey
ALTER TABLE "PublicGuild" DROP CONSTRAINT "PublicGuild_regionId_fkey";

-- DropForeignKey
ALTER TABLE "PublicGuildTag" DROP CONSTRAINT "PublicGuildTag_publicGuildId_fkey";

-- DropForeignKey
ALTER TABLE "PublicGuildTag" DROP CONSTRAINT "PublicGuildTag_tagId_fkey";

-- DropTable
DROP TABLE "AdminCreator";

-- DropTable
DROP TABLE "AdminCreatorTag";

-- DropTable
DROP TABLE "AdminGuild";

-- DropTable
DROP TABLE "AdminGuildTag";

-- DropTable
DROP TABLE "PublicCreator";

-- DropTable
DROP TABLE "PublicCreatorTag";

-- DropTable
DROP TABLE "PublicGuild";

-- DropTable
DROP TABLE "PublicGuildTag";

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "guild_leader" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL,
    "languageId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildTagRelation" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "GuildTagRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL,
    "socials" JSONB,
    "languageId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorTagRelation" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "CreatorTagRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_name_key" ON "Guild"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_slug_key" ON "Guild"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_userId_key" ON "Guild"("userId");

-- CreateIndex
CREATE INDEX "Guild_created_on_idx" ON "Guild"("created_on");

-- CreateIndex
CREATE INDEX "Guild_slug_idx" ON "Guild"("slug");

-- CreateIndex
CREATE INDEX "Guild_status_idx" ON "Guild"("status");

-- CreateIndex
CREATE INDEX "Guild_languageId_idx" ON "Guild"("languageId");

-- CreateIndex
CREATE INDEX "Guild_regionId_idx" ON "Guild"("regionId");

-- CreateIndex
CREATE INDEX "Guild_userId_idx" ON "Guild"("userId");

-- CreateIndex
CREATE INDEX "Guild_name_idx" ON "Guild"("name");

-- CreateIndex
CREATE INDEX "GuildTagRelation_guildId_idx" ON "GuildTagRelation"("guildId");

-- CreateIndex
CREATE INDEX "GuildTagRelation_tagId_idx" ON "GuildTagRelation"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_name_key" ON "Creator"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_slug_key" ON "Creator"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_userId_key" ON "Creator"("userId");

-- CreateIndex
CREATE INDEX "Creator_created_on_idx" ON "Creator"("created_on");

-- CreateIndex
CREATE INDEX "Creator_slug_idx" ON "Creator"("slug");

-- CreateIndex
CREATE INDEX "Creator_status_idx" ON "Creator"("status");

-- CreateIndex
CREATE INDEX "Creator_languageId_idx" ON "Creator"("languageId");

-- CreateIndex
CREATE INDEX "Creator_userId_idx" ON "Creator"("userId");

-- CreateIndex
CREATE INDEX "Creator_name_idx" ON "Creator"("name");

-- CreateIndex
CREATE INDEX "CreatorTagRelation_creatorId_idx" ON "CreatorTagRelation"("creatorId");

-- CreateIndex
CREATE INDEX "CreatorTagRelation_tagId_idx" ON "CreatorTagRelation"("tagId");

-- CreateIndex
CREATE INDEX "Language_name_idx" ON "Language"("name");

-- CreateIndex
CREATE INDEX "Region_name_idx" ON "Region"("name");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildTagRelation" ADD CONSTRAINT "GuildTagRelation_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildTagRelation" ADD CONSTRAINT "GuildTagRelation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "GuildTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creator" ADD CONSTRAINT "Creator_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creator" ADD CONSTRAINT "Creator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorTagRelation" ADD CONSTRAINT "CreatorTagRelation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorTagRelation" ADD CONSTRAINT "CreatorTagRelation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "CreatorTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
