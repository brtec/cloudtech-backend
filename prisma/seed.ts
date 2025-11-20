import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const password = await bcrypt.hash('password123', 10);

  // Create Users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password,
      name: 'User One',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      password,
      name: 'User Two',
    },
  });

    const user3 = await prisma.user.upsert({
    where: { email: 'user3@example.com' },
    update: {},
    create: {
      email: 'user3@example.com',
      password,
      name: 'User Three',
    },
  });

  // Create Company
  const company = await prisma.company.create({
    data: {
      name: 'CloudTech',
      members: {
        create: [
            {
                userId: user1.id,
                role: Role.OWNER
            },
             {
                userId: user2.id,
                role: Role.ADMIN
            }
        ]
      }
    },
  });

  await prisma.user.update({
      where: { id: user1.id },
      data: { activeCompanyId: company.id }
  });

  console.log({ user1, user2, user3, company });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
