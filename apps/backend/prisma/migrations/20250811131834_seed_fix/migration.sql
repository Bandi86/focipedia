-- CreateEnum
CREATE TYPE "public"."PlayerPosition" AS ENUM ('Goalkeeper', 'Defender', 'Midfielder', 'Forward');

-- CreateEnum
CREATE TYPE "public"."MatchEventType" AS ENUM ('Goal', 'YellowCard', 'RedCard', 'Substitution');

-- CreateEnum
CREATE TYPE "public"."MatchStatus" AS ENUM ('Scheduled', 'Live', 'Finished', 'Canceled', 'Postponed', 'Suspended');

-- CreateEnum
CREATE TYPE "public"."TransferType" AS ENUM ('Permanent', 'Loan', 'FreeAgent', 'EndOfLoan');

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "stadium" TEXT,
    "logoUrl" TEXT,
    "founded" INTEGER,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Player" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT NOT NULL,
    "position" "public"."PlayerPosition" NOT NULL,
    "jerseyNumber" INTEGER,
    "imageUrl" TEXT,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."League" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "logoUrl" TEXT,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Match" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "stadium" TEXT,
    "round" TEXT,
    "status" "public"."MatchStatus" NOT NULL DEFAULT 'Scheduled',
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "homeScore" INTEGER NOT NULL DEFAULT 0,
    "awayScore" INTEGER NOT NULL DEFAULT 0,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MatchEvent" (
    "id" SERIAL NOT NULL,
    "minute" INTEGER NOT NULL,
    "type" "public"."MatchEventType" NOT NULL,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "assistingPlayerId" INTEGER,
    "playerInId" INTEGER,
    "playerOutId" INTEGER,

    CONSTRAINT "MatchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlayerMatchStats" (
    "id" SERIAL NOT NULL,
    "minutesPlayed" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "shots" INTEGER NOT NULL DEFAULT 0,
    "shotsOnTarget" INTEGER NOT NULL DEFAULT 0,
    "passes" INTEGER NOT NULL DEFAULT 0,
    "passAccuracy" DOUBLE PRECISION,
    "tackles" INTEGER NOT NULL DEFAULT 0,
    "interceptions" INTEGER NOT NULL DEFAULT 0,
    "dribbles" INTEGER NOT NULL DEFAULT 0,
    "foulsCommitted" INTEGER NOT NULL DEFAULT 0,
    "foulsSuffered" INTEGER NOT NULL DEFAULT 0,
    "yellowCards" INTEGER NOT NULL DEFAULT 0,
    "redCards" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER DEFAULT 0,
    "expectedGoals" DOUBLE PRECISION,
    "expectedAssists" DOUBLE PRECISION,
    "keyPasses" INTEGER DEFAULT 0,
    "rating" DOUBLE PRECISION,
    "playerId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,

    CONSTRAINT "PlayerMatchStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlayerSeasonStats" (
    "id" SERIAL NOT NULL,
    "season" TEXT NOT NULL,
    "appearances" INTEGER NOT NULL DEFAULT 0,
    "minutesPlayed" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "shots" INTEGER NOT NULL DEFAULT 0,
    "shotsOnTarget" INTEGER NOT NULL DEFAULT 0,
    "passes" INTEGER NOT NULL DEFAULT 0,
    "passAccuracy" DOUBLE PRECISION,
    "tackles" INTEGER NOT NULL DEFAULT 0,
    "interceptions" INTEGER NOT NULL DEFAULT 0,
    "dribbles" INTEGER NOT NULL DEFAULT 0,
    "foulsCommitted" INTEGER NOT NULL DEFAULT 0,
    "foulsSuffered" INTEGER NOT NULL DEFAULT 0,
    "yellowCards" INTEGER NOT NULL DEFAULT 0,
    "redCards" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER DEFAULT 0,
    "expectedGoals" DOUBLE PRECISION,
    "expectedAssists" DOUBLE PRECISION,
    "keyPasses" INTEGER DEFAULT 0,
    "playerId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "PlayerSeasonStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transfer" (
    "id" SERIAL NOT NULL,
    "transferDate" TIMESTAMP(3) NOT NULL,
    "transferFee" DOUBLE PRECISION,
    "transferType" "public"."TransferType" NOT NULL DEFAULT 'Permanent',
    "playerId" INTEGER NOT NULL,
    "fromTeamId" INTEGER,
    "toTeamId" INTEGER NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trophy" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Trophy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlayerTrophy" (
    "id" SERIAL NOT NULL,
    "season" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "trophyId" INTEGER NOT NULL,

    CONSTRAINT "PlayerTrophy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Odd" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "homeWinOdds" DOUBLE PRECISION NOT NULL,
    "drawOdds" DOUBLE PRECISION NOT NULL,
    "awayWinOdds" DOUBLE PRECISION NOT NULL,
    "matchId" INTEGER NOT NULL,

    CONSTRAINT "Odd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_LeagueTeams" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LeagueTeams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "public"."Team"("name");

-- CreateIndex
CREATE INDEX "MatchEvent_matchId_idx" ON "public"."MatchEvent"("matchId");

-- CreateIndex
CREATE INDEX "MatchEvent_playerId_idx" ON "public"."MatchEvent"("playerId");

-- CreateIndex
CREATE INDEX "PlayerMatchStats_playerId_idx" ON "public"."PlayerMatchStats"("playerId");

-- CreateIndex
CREATE INDEX "PlayerMatchStats_matchId_idx" ON "public"."PlayerMatchStats"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerMatchStats_playerId_matchId_key" ON "public"."PlayerMatchStats"("playerId", "matchId");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_playerId_idx" ON "public"."PlayerSeasonStats"("playerId");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_teamId_idx" ON "public"."PlayerSeasonStats"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerSeasonStats_playerId_teamId_leagueId_season_key" ON "public"."PlayerSeasonStats"("playerId", "teamId", "leagueId", "season");

-- CreateIndex
CREATE INDEX "Transfer_playerId_idx" ON "public"."Transfer"("playerId");

-- CreateIndex
CREATE INDEX "Transfer_fromTeamId_idx" ON "public"."Transfer"("fromTeamId");

-- CreateIndex
CREATE INDEX "Transfer_toTeamId_idx" ON "public"."Transfer"("toTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "Trophy_name_key" ON "public"."Trophy"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerTrophy_playerId_trophyId_season_key" ON "public"."PlayerTrophy"("playerId", "trophyId", "season");

-- CreateIndex
CREATE UNIQUE INDEX "Odd_matchId_key" ON "public"."Odd"("matchId");

-- CreateIndex
CREATE INDEX "_LeagueTeams_B_index" ON "public"."_LeagueTeams"("B");

-- AddForeignKey
ALTER TABLE "public"."Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatchEvent" ADD CONSTRAINT "MatchEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatchEvent" ADD CONSTRAINT "MatchEvent_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatchEvent" ADD CONSTRAINT "MatchEvent_assistingPlayerId_fkey" FOREIGN KEY ("assistingPlayerId") REFERENCES "public"."Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatchEvent" ADD CONSTRAINT "MatchEvent_playerInId_fkey" FOREIGN KEY ("playerInId") REFERENCES "public"."Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatchEvent" ADD CONSTRAINT "MatchEvent_playerOutId_fkey" FOREIGN KEY ("playerOutId") REFERENCES "public"."Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerMatchStats" ADD CONSTRAINT "PlayerMatchStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerMatchStats" ADD CONSTRAINT "PlayerMatchStats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerSeasonStats" ADD CONSTRAINT "PlayerSeasonStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerSeasonStats" ADD CONSTRAINT "PlayerSeasonStats_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerSeasonStats" ADD CONSTRAINT "PlayerSeasonStats_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transfer" ADD CONSTRAINT "Transfer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transfer" ADD CONSTRAINT "Transfer_fromTeamId_fkey" FOREIGN KEY ("fromTeamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transfer" ADD CONSTRAINT "Transfer_toTeamId_fkey" FOREIGN KEY ("toTeamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerTrophy" ADD CONSTRAINT "PlayerTrophy_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerTrophy" ADD CONSTRAINT "PlayerTrophy_trophyId_fkey" FOREIGN KEY ("trophyId") REFERENCES "public"."Trophy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Odd" ADD CONSTRAINT "Odd_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_LeagueTeams" ADD CONSTRAINT "_LeagueTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_LeagueTeams" ADD CONSTRAINT "_LeagueTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
