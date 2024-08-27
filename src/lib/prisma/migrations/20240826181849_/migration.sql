-- CreateTable
CREATE TABLE "AdminContentCreator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "updated_on" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL,
    "socials" JSONB,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "AdminContentCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminContentCreatorCategory" (
    "id" TEXT NOT NULL,
    "adminContentCreatorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "AdminContentCreatorCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminContentCreator_created_on_idx" ON "AdminContentCreator"("created_on");

-- CreateIndex
CREATE INDEX "AdminContentCreator_languageId_idx" ON "AdminContentCreator"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminContentCreatorCategory_adminContentCreatorId_categoryI_key" ON "AdminContentCreatorCategory"("adminContentCreatorId", "categoryId");

-- AddForeignKey
ALTER TABLE "AdminContentCreator" ADD CONSTRAINT "AdminContentCreator_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminContentCreatorCategory" ADD CONSTRAINT "AdminContentCreatorCategory_adminContentCreatorId_fkey" FOREIGN KEY ("adminContentCreatorId") REFERENCES "AdminContentCreator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminContentCreatorCategory" ADD CONSTRAINT "AdminContentCreatorCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
