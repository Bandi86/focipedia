-- CreateEnum
CREATE TYPE "public"."CompetitionType" AS ENUM ('DomesticLeague', 'DomesticCup', 'InternationalClub', 'InternationalNational');

-- AlterTable
ALTER TABLE "public"."League" ADD COLUMN     "competitionType" "public"."CompetitionType" NOT NULL DEFAULT 'DomesticLeague';
