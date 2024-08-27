/*
  Warnings:

  - You are about to drop the `AdminContentCreator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdminContentCreator" DROP CONSTRAINT "AdminContentCreator_languageId_fkey";

-- DropForeignKey
ALTER TABLE "ContentCategory" DROP CONSTRAINT "AdminContentCategory_FK";

-- DropForeignKey
ALTER TABLE "ContentCategory" DROP CONSTRAINT "ContentCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ContentCategory" DROP CONSTRAINT "PublicContentCategory_FK";

-- DropTable
DROP TABLE "AdminContentCreator";

-- DropTable
DROP TABLE "ContentCategory";

-- CreateTable
CREATE TABLE "PublicContentCreatorCategory" (
    "id" TEXT NOT NULL,
    "publicContentCreatorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "PublicContentCreatorCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicContentCreatorCategory_publicContentCreatorId_categor_key" ON "PublicContentCreatorCategory"("publicContentCreatorId", "categoryId");

-- AddForeignKey
ALTER TABLE "PublicContentCreatorCategory" ADD CONSTRAINT "PublicContentCreatorCategory_publicContentCreatorId_fkey" FOREIGN KEY ("publicContentCreatorId") REFERENCES "PublicContentCreator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicContentCreatorCategory" ADD CONSTRAINT "PublicContentCreatorCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
