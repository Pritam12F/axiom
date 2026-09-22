-- AlterTable
ALTER TABLE "model" ADD COLUMN     "description" TEXT;

-- DropEnum
DROP TYPE "ModelEffort";

-- CreateTable
CREATE TABLE "model_effort" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "modelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "model_effort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentOnModels" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "modelId" INTEGER NOT NULL,

    CONSTRAINT "AgentOnModels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "model_effort_modelId_key" ON "model_effort"("modelId");

-- AddForeignKey
ALTER TABLE "model_effort" ADD CONSTRAINT "model_effort_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentOnModels" ADD CONSTRAINT "AgentOnModels_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentOnModels" ADD CONSTRAINT "AgentOnModels_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
