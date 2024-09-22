import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export const initializePrisma = async () => {
  try {
    await prismaClient.$connect();
  } catch (err) {
    console.error('error connecting to prisma', err);
  }
};

export const disconnectPrisma = async () => {
  try {
    await prismaClient.$disconnect();
  } catch (err) {
    console.error('error disconnecting from prisma', err);
  }
};

export default prismaClient;
