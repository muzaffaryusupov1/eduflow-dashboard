const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_OWNER_EMAIL || 'owner@eduflow.dev';
  const password = process.env.SEED_OWNER_PASSWORD || 'Owner123!';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'OWNER' },
    create: { email, passwordHash, role: 'OWNER' },
  });

  console.log(`Seeded OWNER user: ${email}`);

  const courses = [
    { title: 'Mathematics Fundamentals', monthlyPrice: 120, status: 'ACTIVE' },
    { title: 'English for Beginners', monthlyPrice: 90, status: 'ACTIVE' },
    { title: 'Physics Lab', monthlyPrice: 150, status: 'INACTIVE' },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { title: course.title },
      update: course,
      create: course,
    });
  }
  console.log('Seeded sample courses');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
