import prismaClient from '../../../lib/prisma/client.prisma';

const updateLanguageDB = async (langId: string, name: string) => {
  try {
    const updatedLang = await prismaClient.language.update({
      where: { id: langId },
      data: { name },
    });
    return updatedLang;
  } catch (error) {
    throw error;
  }
};

export default updateLanguageDB;
