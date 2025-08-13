import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Order matters due to FKs
  await prisma.review.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.matchEvent.deleteMany();
  await prisma.playerMatchStats.deleteMany();
  await prisma.odd.deleteMany();
  await prisma.match.deleteMany();
  await prisma.playerSeasonStats.deleteMany();
  await prisma.teamSeason.deleteMany();
  await prisma.leagueSeason.deleteMany();
  await prisma.standing.deleteMany();
  await prisma.playerTrophy.deleteMany();
  await prisma.trophy.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();
  await prisma.season.deleteMany();
  await prisma.league.deleteMany();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


