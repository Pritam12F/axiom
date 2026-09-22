/*
  Warnings:

  - You are about to drop the `AgentOnModels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupOnAgents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AgentOnModels" DROP CONSTRAINT "AgentOnModels_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentOnModels" DROP CONSTRAINT "AgentOnModels_modelId_fkey";

-- DropForeignKey
ALTER TABLE "GroupOnAgents" DROP CONSTRAINT "GroupOnAgents_agentId_fkey";

-- DropForeignKey
ALTER TABLE "GroupOnAgents" DROP CONSTRAINT "GroupOnAgents_groupId_fkey";

-- DropForeignKey
ALTER TABLE "log" DROP CONSTRAINT "log_agentId_fkey";

-- DropForeignKey
ALTER TABLE "model_effort" DROP CONSTRAINT "model_effort_modelId_fkey";

-- AlterTable
ALTER TABLE "log" ALTER COLUMN "agentId" DROP NOT NULL;

-- DropTable
DROP TABLE "AgentOnModels";

-- DropTable
DROP TABLE "GroupOnAgents";

-- CreateTable
CREATE TABLE "agent_on_models" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "modelId" INTEGER NOT NULL,

    CONSTRAINT "agent_on_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_on_agents" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "group_on_agents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agent_on_models_agentId_modelId_key" ON "agent_on_models"("agentId", "modelId");

-- CreateIndex
CREATE INDEX "group_on_agents_agentId_groupId_idx" ON "group_on_agents"("agentId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "group_on_agents_agentId_groupId_key" ON "group_on_agents"("agentId", "groupId");

-- CreateIndex
CREATE INDEX "agent_userId_idx" ON "agent"("userId");

-- CreateIndex
CREATE INDEX "group_createdById_idx" ON "group"("createdById");

-- CreateIndex
CREATE INDEX "log_agentId_idx" ON "log"("agentId");

-- CreateIndex
CREATE INDEX "model_effort_modelId_idx" ON "model_effort"("modelId");

-- CreateIndex
CREATE INDEX "project_userId_groupId_idx" ON "project"("userId", "groupId");

-- CreateIndex
CREATE INDEX "project_on_agents_projectId_agentId_idx" ON "project_on_agents"("projectId", "agentId");

-- CreateIndex
CREATE INDEX "resource_projectId_userId_idx" ON "resource"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "model_effort" ADD CONSTRAINT "model_effort_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_on_models" ADD CONSTRAINT "agent_on_models_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_on_models" ADD CONSTRAINT "agent_on_models_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_on_agents" ADD CONSTRAINT "group_on_agents_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_on_agents" ADD CONSTRAINT "group_on_agents_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
