
import 'dotenv/config';
import prisma from './src/config/db.js';

async function main() {
  const user = await prisma.user.findFirst();
  if (user) {
    console.log('User ID:', user.id);
  } else {
    console.log('No users found. Creating one...');
    const newUser = await prisma.user.create({
      data: {
        id: 'test-user-123',
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
      }
    });
    console.log('Created User ID:', newUser.id);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
