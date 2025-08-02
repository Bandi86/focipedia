import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator role with full access',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Standard user role',
    },
  });

  console.log('✅ Roles created:', { adminRole, userRole });

  // Create a test admin user
  const adminPassword = await argon2.hash('admin123');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@focipedia.hu' },
    update: {},
    create: {
      email: 'admin@focipedia.hu',
      passwordHash: adminPassword,
      name: 'Admin User',
      emailVerifiedAt: new Date(),
    },
  });

  // Assign admin role to admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log('✅ Admin user created:', { email: adminUser.email, name: adminUser.name });

  // Create a test regular user
  const userPassword = await argon2.hash('user123');
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@focipedia.hu' },
    update: {},
    create: {
      email: 'user@focipedia.hu',
      passwordHash: userPassword,
      name: 'Test User',
      emailVerifiedAt: new Date(),
    },
  });

  // Assign user role to regular user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: regularUser.id,
        roleId: userRole.id,
      },
    },
    update: {},
    create: {
      userId: regularUser.id,
      roleId: userRole.id,
    },
  });

  console.log('✅ Regular user created:', { email: regularUser.email, name: regularUser.name });

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Test accounts:');
  console.log('Admin: admin@focipedia.hu / admin123');
  console.log('User: user@focipedia.hu / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 