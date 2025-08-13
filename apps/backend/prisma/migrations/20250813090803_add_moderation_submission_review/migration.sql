-- CreateEnum
CREATE TYPE "public"."ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."SubmissionTargetType" AS ENUM ('TEAM', 'PLAYER', 'LEAGUE', 'MATCH', 'MATCH_EVENT', 'PLAYER_MATCH_STATS', 'PLAYER_SEASON_STATS', 'TRANSFER', 'TROPHY', 'PLAYER_TROPHY', 'ODD');

-- CreateTable
CREATE TABLE "public"."Submission" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "targetType" "public"."SubmissionTargetType" NOT NULL,
    "targetId" INTEGER,
    "operation" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "status" "public"."ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decision" "public"."ModerationStatus" NOT NULL,
    "comment" TEXT,
    "reviewerId" INTEGER NOT NULL,
    "submissionId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Submission_status_idx" ON "public"."Submission"("status");

-- CreateIndex
CREATE INDEX "Submission_targetType_targetId_idx" ON "public"."Submission"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "Review_submissionId_idx" ON "public"."Review"("submissionId");

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
