import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Check if test user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'test@example.com' },
        { profile: { username: 'testuser' } }
      ]
    }
  });

  if (existingUser) {
    console.log('✅ Test user already exists');
    return;
  }

  // Hash password
  const hashedPassword = await argon2.hash('TestPassword123!', {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: hashedPassword,
      isVerified: true,
      profile: {
        create: {
          username: 'testuser',
          displayName: 'Test User',
        }
      },
      settings: {
        create: {
          theme: 'light',
          notificationsEnabled: true,
          privacyLevel: 'public',
        }
      }
    },
    include: {
      profile: true,
    }
  });

  console.log('✅ Test user created:', {
    id: user.id,
    email: user.email,
    username: user.profile?.username,
    displayName: user.profile?.displayName,
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 