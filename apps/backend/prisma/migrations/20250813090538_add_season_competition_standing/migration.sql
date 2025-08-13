/*
  Warnings:

  - A unique constraint covering the columns `[leagueId,seasonId,matchDate,homeTeamId,awayTeamId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerId,teamId,leagueId,seasonId,season]` on the table `PlayerSeasonStats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."PlayerSeasonStats_playerId_teamId_leagueId_season_key";

-- AlterTable
ALTER TABLE "public"."Match" ADD COLUMN     "seasonId" INTEGER;

-- AlterTable
ALTER TABLE "public"."PlayerSeasonStats" ADD COLUMN     "seasonId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Season" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeagueSeason" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,

    CONSTRAINT "LeagueSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeamSeason" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "leagueSeasonId" INTEGER NOT NULL,

    CONSTRAINT "TeamSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Standing" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "played" INTEGER NOT NULL DEFAULT 0,
    "won" INTEGER NOT NULL DEFAULT 0,
    "drawn" INTEGER NOT NULL DEFAULT 0,
    "lost" INTEGER NOT NULL DEFAULT 0,
    "goalsFor" INTEGER NOT NULL DEFAULT 0,
    "goalsAgainst" INTEGER NOT NULL DEFAULT 0,
    "goalDifference" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Standing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Season_name_key" ON "public"."Season"("name");

-- CreateIndex
CREATE INDEX "LeagueSeason_leagueId_idx" ON "public"."LeagueSeason"("leagueId");

-- CreateIndex
CREATE INDEX "LeagueSeason_seasonId_idx" ON "public"."LeagueSeason"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueSeason_leagueId_seasonId_key" ON "public"."LeagueSeason"("leagueId", "seasonId");

-- CreateIndex
CREATE INDEX "TeamSeason_teamId_idx" ON "public"."TeamSeason"("teamId");

-- CreateIndex
CREATE INDEX "TeamSeason_leagueSeasonId_idx" ON "public"."TeamSeason"("leagueSeasonId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamSeason_teamId_leagueSeasonId_key" ON "public"."TeamSeason"("teamId", "leagueSeasonId");

-- CreateIndex
CREATE INDEX "Standing_leagueId_seasonId_idx" ON "public"."Standing"("leagueId", "seasonId");

-- CreateIndex
CREATE INDEX "Standing_points_goalDifference_goalsFor_idx" ON "public"."Standing"("points", "goalDifference", "goalsFor");

-- CreateIndex
CREATE UNIQUE INDEX "Standing_leagueId_seasonId_teamId_key" ON "public"."Standing"("leagueId", "seasonId", "teamId");

-- CreateIndex
CREATE INDEX "Match_leagueId_seasonId_status_idx" ON "public"."Match"("leagueId", "seasonId", "status");

-- CreateIndex
CREATE INDEX "Match_matchDate_idx" ON "public"."Match"("matchDate");

-- CreateIndex
CREATE INDEX "Match_homeTeamId_idx" ON "public"."Match"("homeTeamId");

-- CreateIndex
CREATE INDEX "Match_awayTeamId_idx" ON "public"."Match"("awayTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_leagueId_seasonId_matchDate_homeTeamId_awayTeamId_key" ON "public"."Match"("leagueId", "seasonId", "matchDate", "homeTeamId", "awayTeamId");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_leagueId_idx" ON "public"."PlayerSeasonStats"("leagueId");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_seasonId_idx" ON "public"."PlayerSeasonStats"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerSeasonStats_playerId_teamId_leagueId_seasonId_season_key" ON "public"."PlayerSeasonStats"("playerId", "teamId", "leagueId", "seasonId", "season");

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerSeasonStats" ADD CONSTRAINT "PlayerSeasonStats_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeagueSeason" ADD CONSTRAINT "LeagueSeason_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeagueSeason" ADD CONSTRAINT "LeagueSeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamSeason" ADD CONSTRAINT "TeamSeason_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamSeason" ADD CONSTRAINT "TeamSeason_leagueSeasonId_fkey" FOREIGN KEY ("leagueSeasonId") REFERENCES "public"."LeagueSeason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Standing" ADD CONSTRAINT "Standing_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Standing" ADD CONSTRAINT "Standing_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Standing" ADD CONSTRAINT "Standing_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
