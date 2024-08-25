/*
  Warnings:

  - You are about to drop the `ContentCreator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Guild` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('PUBLIC_GUILD', 'ADMIN_GUILD', 'PUBLIC_CONTENT_CREATOR', 'ADMIN_CONTENT_CREATOR');

-- CreateEnum
CREATE TYPE "ContentCreatorType" AS ENUM ('PUBLIC_CONTENT_CREATOR', 'ADMIN_CONTENT_CREATOR');

-- DropTable
DROP TABLE "ContentCreator";

-- DropTable
DROP TABLE "Guild";

-- CreateTable
CREATE TABLE "PublicGuild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "guild_leader" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL,
    "updated_on" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL,
    "languageId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "PublicGuild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminGuild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "guild_leader" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL,
    "updated_on" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL,
    "regionId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "AdminGuild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicContentCreator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "updated_on" TIMESTAMP(3),
    "deleted_on" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL,
    "socials" JSONB,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "PublicContentCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminContentCreator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "updated_on" TIMESTAMP(3),
    "deleted_on" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL,
    "socials" JSONB,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "AdminContentCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentCategory" (
    "contentCreatorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "creatorType" "ContentCreatorType" NOT NULL,

    CONSTRAINT "ContentCategory_pkey" PRIMARY KEY ("contentCreatorId","categoryId","creatorType")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicGuild_name_key" ON "PublicGuild"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PublicGuild_guild_leader_key" ON "PublicGuild"("guild_leader");

-- CreateIndex
CREATE INDEX "PublicGuild_created_on_idx" ON "PublicGuild"("created_on");

-- CreateIndex
CREATE INDEX "PublicGuild_created_on_name_idx" ON "PublicGuild"("created_on", "name");

-- CreateIndex
CREATE INDEX "PublicGuild_name_idx" ON "PublicGuild"("name");

-- CreateIndex
CREATE INDEX "PublicGuild_regionId_idx" ON "PublicGuild"("regionId");

-- CreateIndex
CREATE INDEX "PublicGuild_languageId_idx" ON "PublicGuild"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminGuild_name_key" ON "AdminGuild"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AdminGuild_guild_leader_key" ON "AdminGuild"("guild_leader");

-- CreateIndex
CREATE INDEX "AdminGuild_created_on_idx" ON "AdminGuild"("created_on");

-- CreateIndex
CREATE INDEX "AdminGuild_created_on_name_idx" ON "AdminGuild"("created_on", "name");

-- CreateIndex
CREATE INDEX "AdminGuild_name_idx" ON "AdminGuild"("name");

-- CreateIndex
CREATE INDEX "AdminGuild_regionId_idx" ON "AdminGuild"("regionId");

-- CreateIndex
CREATE INDEX "AdminGuild_languageId_idx" ON "AdminGuild"("languageId");

-- CreateIndex
CREATE INDEX "PublicContentCreator_created_on_idx" ON "PublicContentCreator"("created_on");

-- CreateIndex
CREATE INDEX "PublicContentCreator_created_on_name_idx" ON "PublicContentCreator"("created_on", "name");

-- CreateIndex
CREATE INDEX "PublicContentCreator_name_idx" ON "PublicContentCreator"("name");

-- CreateIndex
CREATE INDEX "PublicContentCreator_languageId_idx" ON "PublicContentCreator"("languageId");

-- CreateIndex
CREATE INDEX "AdminContentCreator_created_on_idx" ON "AdminContentCreator"("created_on");

-- CreateIndex
CREATE INDEX "AdminContentCreator_languageId_idx" ON "AdminContentCreator"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "ContentCategory_categoryId_contentCreatorId_idx" ON "ContentCategory"("categoryId", "contentCreatorId");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE INDEX "User_created_on_idx" ON "User"("created_on");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "PublicGuild" ADD CONSTRAINT "PublicGuild_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicGuild" ADD CONSTRAINT "PublicGuild_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminGuild" ADD CONSTRAINT "AdminGuild_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminGuild" ADD CONSTRAINT "AdminGuild_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicContentCreator" ADD CONSTRAINT "PublicContentCreator_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminContentCreator" ADD CONSTRAINT "AdminContentCreator_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCategory" ADD CONSTRAINT "PublicContentCategory_FK" FOREIGN KEY ("contentCreatorId") REFERENCES "PublicContentCreator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCategory" ADD CONSTRAINT "AdminContentCategory_FK" FOREIGN KEY ("contentCreatorId") REFERENCES "AdminContentCreator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCategory" ADD CONSTRAINT "ContentCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
