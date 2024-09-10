import prismaClient from '../../../lib/prisma/client.prisma';

const deleteLanguageDB = async (id: string) => {
  try {
    const deletedLanguage = await prismaClient.language.delete({
      where: { id: id },
    });
    return deletedLanguage;
  } catch (error) {
    throw error;
  }
};

export default deleteLanguageDB;
