import { PrismaClient, $Enums } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const name = 'Super Admin';
  const username = 'admin';
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.username) {
      await prisma.user.update({ where: { id: existing.id }, data: { username } });
      console.log('Admin user username backfilled:', username);
    } else {
      console.log('Admin user already exists:', email);
    }
    return;
  }

  await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      name,
      role: $Enums.UserRole.ADMIN,
    },
  });
  console.log('Seeded admin user:', email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
