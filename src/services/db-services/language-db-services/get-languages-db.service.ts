import prismaClient from '../../../lib/prisma/client.prisma';

const getLanguagesDB = async () => {
  try {
    const data = await prismaClient.language.findMany();
    const languages = data.map((lang) => {
      return lang.name;
    });
    return languages;
  } catch (error) {
    throw error;
  }
};

export default getLanguagesDB;
