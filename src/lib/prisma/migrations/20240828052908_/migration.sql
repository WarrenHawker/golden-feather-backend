/*
  Warnings:

  - You are about to drop the `AdminContentCreator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminContentCreatorCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublicContentCreator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublicContentCreatorCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdminContentCreator" DROP CONSTRAINT "AdminContentCreator_languageId_fkey";

-- DropForeignKey
ALTER TABLE "AdminContentCreatorCategory" DROP CONSTRAINT "AdminContentCreatorCategory_adminContentCreatorId_fkey";

-- DropForeignKey
ALTER TABLE "AdminContentCreatorCategory" DROP CONSTRAINT "AdminContentCreatorCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PublicContentCreator" DROP CONSTRAINT "PublicContentCreator_languageId_fkey";

-- DropForeignKey
ALTER TABLE "PublicContentCreatorCategory" DROP CONSTRAINT "PublicContentCreatorCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PublicContentCreatorCategory" DROP CONSTRAINT "PublicContentCreatorCategory_publicContentCreatorId_fkey";

-- DropTable
DROP TABLE "AdminContentCreator";

-- DropTable
DROP TABLE "AdminContentCreatorCategory";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "PublicContentCreator";

-- DropTable
DROP TABLE "PublicContentCreatorCategory";

-- CreateTable
CREATE TABLE "GuildTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "GuildTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicGuildTag" (
    "id" TEXT NOT NULL,
    "publicGuildId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "PublicGuildTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminGuildTag" (
    "id" TEXT NOT NULL,
    "adminGuildId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "AdminGuildTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicCreator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "updated_on" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL,
    "socials" JSONB,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "PublicCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminCreator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "updated_on" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL,
    "socials" JSONB,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "AdminCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CreatorTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicCreatorTag" (
    "id" TEXT NOT NULL,
    "publicCreatorId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "PublicCreatorTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminCreatorTag" (
    "id" TEXT NOT NULL,
    "adminCreatorId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "AdminCreatorTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildTag_name_key" ON "GuildTag"("name");

-- CreateIndex
CREATE INDEX "PublicGuildTag_tagId_idx" ON "PublicGuildTag"("tagId");

-- CreateIndex
CREATE INDEX "PublicGuildTag_publicGuildId_idx" ON "PublicGuildTag"("publicGuildId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicGuildTag_publicGuildId_tagId_key" ON "PublicGuildTag"("publicGuildId", "tagId");

-- CreateIndex
CREATE INDEX "AdminGuildTag_tagId_idx" ON "AdminGuildTag"("tagId");

-- CreateIndex
CREATE INDEX "AdminGuildTag_adminGuildId_idx" ON "AdminGuildTag"("adminGuildId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminGuildTag_adminGuildId_tagId_key" ON "AdminGuildTag"("adminGuildId", "tagId");

-- CreateIndex
CREATE INDEX "PublicCreator_created_on_idx" ON "PublicCreator"("created_on");

-- CreateIndex
CREATE INDEX "PublicCreator_created_on_name_idx" ON "PublicCreator"("created_on", "name");

-- CreateIndex
CREATE INDEX "PublicCreator_name_idx" ON "PublicCreator"("name");

-- CreateIndex
CREATE INDEX "PublicCreator_languageId_idx" ON "PublicCreator"("languageId");

-- CreateIndex
CREATE INDEX "AdminCreator_created_on_idx" ON "AdminCreator"("created_on");

-- CreateIndex
CREATE INDEX "AdminCreator_languageId_idx" ON "AdminCreator"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorTag_name_key" ON "CreatorTag"("name");

-- CreateIndex
CREATE INDEX "PublicCreatorTag_tagId_idx" ON "PublicCreatorTag"("tagId");

-- CreateIndex
CREATE INDEX "PublicCreatorTag_publicCreatorId_idx" ON "PublicCreatorTag"("publicCreatorId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicCreatorTag_publicCreatorId_tagId_key" ON "PublicCreatorTag"("publicCreatorId", "tagId");

-- CreateIndex
CREATE INDEX "AdminCreatorTag_tagId_idx" ON "AdminCreatorTag"("tagId");

-- CreateIndex
CREATE INDEX "AdminCreatorTag_adminCreatorId_idx" ON "AdminCreatorTag"("adminCreatorId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminCreatorTag_adminCreatorId_tagId_key" ON "AdminCreatorTag"("adminCreatorId", "tagId");

-- AddForeignKey
ALTER TABLE "PublicGuildTag" ADD CONSTRAINT "PublicGuildTag_publicGuildId_fkey" FOREIGN KEY ("publicGuildId") REFERENCES "PublicGuild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicGuildTag" ADD CONSTRAINT "PublicGuildTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "GuildTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminGuildTag" ADD CONSTRAINT "AdminGuildTag_adminGuildId_fkey" FOREIGN KEY ("adminGuildId") REFERENCES "AdminGuild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminGuildTag" ADD CONSTRAINT "AdminGuildTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "GuildTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicCreator" ADD CONSTRAINT "PublicCreator_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminCreator" ADD CONSTRAINT "AdminCreator_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicCreatorTag" ADD CONSTRAINT "PublicCreatorTag_publicCreatorId_fkey" FOREIGN KEY ("publicCreatorId") REFERENCES "PublicCreator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicCreatorTag" ADD CONSTRAINT "PublicCreatorTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "CreatorTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminCreatorTag" ADD CONSTRAINT "AdminCreatorTag_adminCreatorId_fkey" FOREIGN KEY ("adminCreatorId") REFERENCES "AdminCreator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminCreatorTag" ADD CONSTRAINT "AdminCreatorTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "CreatorTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
