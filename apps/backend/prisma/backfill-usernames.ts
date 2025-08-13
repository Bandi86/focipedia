import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);
}

async function generateUniqueUsername(base: string): Promise<string> {
  let candidate = slugify(base) || `user`;
  let suffix = 0;
  // Ensure starts with a letter or underscore
  if (!/^[_a-z]/.test(candidate)) candidate = `_${candidate}`;
  // Try until unique
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await prisma.user.findUnique({ where: { username: candidate } });
    if (!exists) return candidate;
    suffix += 1;
    candidate = `${candidate.slice(0, 20)}_${suffix}`;
  }
}

async function main() {
  // Use raw SQL to remain compatible even if the Prisma schema marks username as NOT NULL
  const users = await prisma.$queryRaw<{
    id: number;
    email: string;
    name: string | null;
  }[]>`SELECT id, email, name FROM "User" WHERE username IS NULL`;
  for (const user of users) {
    const local = user.email.split('@')[0];
    const base = user.name || local;
    const username = await generateUniqueUsername(base);
    await prisma.user.update({ where: { id: user.id }, data: { username } });
    console.log(`Backfilled username for user ${user.email} -> ${username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


