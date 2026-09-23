/*
  Warnings:

  - You are about to drop the column `name` on the `model` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[modelId]` on the table `model` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modelId` to the `model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "model" DROP COLUMN "name",
ADD COLUMN     "aliases" TEXT[],
ADD COLUMN     "cachedPromptTextTokenPrice" INTEGER,
ADD COLUMN     "cachedPromptTextTokenPriceLongContext" INTEGER,
ADD COLUMN     "completionTextTokenPrice" INTEGER,
ADD COLUMN     "completionTextTokenPriceLongContext" INTEGER,
ADD COLUMN     "created" INTEGER,
ADD COLUMN     "fingerprint" TEXT,
ADD COLUMN     "inputModalities" TEXT[],
ADD COLUMN     "longContextThreshold" INTEGER DEFAULT 0,
ADD COLUMN     "modelId" TEXT NOT NULL,
ADD COLUMN     "object" TEXT NOT NULL DEFAULT 'model',
ADD COLUMN     "outputModalities" TEXT[],
ADD COLUMN     "ownedBy" TEXT NOT NULL DEFAULT 'xai',
ADD COLUMN     "promptImageTokenPrice" INTEGER,
ADD COLUMN     "promptTextTokenPrice" INTEGER,
ADD COLUMN     "promptTextTokenPriceLongContext" INTEGER,
ADD COLUMN     "searchPrice" INTEGER,
ADD COLUMN     "version" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "model_modelId_key" ON "model"("modelId");
