import prismaClient from '../../../lib/prisma/client.prisma';

const createLanguageDB = async (name: string) => {
  try {
    const newLanguage = await prismaClient.language.create({ data: { name } });
    return newLanguage;
  } catch (error) {
    throw error;
  }
};

export default createLanguageDB;
