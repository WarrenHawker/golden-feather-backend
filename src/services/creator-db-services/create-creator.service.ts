/**
 * @file create-creator-db.service.ts
 * @description Service function for creating a new creator record in the database. This function takes
 *              in the creator's data, including name, description, video URL, socials, language, status,
 *              and tags. It processes the input data, including generating a slug from the name, and
 *              connects or creates related records in the database for language and tags using Prisma's
 *              connectOrCreate feature. If the creation is successful, the new creator record is returned.
 *
 * @module services/creator
 *
 * @function createCreatorDB - Asynchronous function to handle the creation of a new creator in the database.
 *
 * @param {CreatorCreationData} options - An object containing the data required to create a new creator, including
 *                                        name, description, video URL, socials, language, status, and tags.
 *
 * @returns {Promise<object>} - A promise that resolves with the newly created creator record.
 *
 * @throws {Error} - Throws an error if the tags array is empty or if there is any issue during the creation
 *                   process in the database.
 *
 * @warning All data passed to this function must be properly validated and sanitized before being passed in
 *          to avoid potential security risks, such as SQL injection or XSS attacks. This function assumes
 *          that validation and sanitization have been handled externally.
 *
 * @requires validator - A library used to sanitize and escape/unescape input strings.
 * @requires ../../lib/prisma/client.prisma - Prisma client for interacting with the database.
 * @requires ../../types/creator - Type definition for the structure of the creator creation data.
 */

import validator from 'validator';
import { prismaClient } from '../../lib/prisma/client.prisma';
import { CreatorCreationData } from '../../types/creator';

const { unescape } = validator;

export const createCreatorDB = async (options: CreatorCreationData) => {
  try {
    if (options.tags.length == 0) {
      throw new Error(
        'you must include at least one category in the categories array'
      );
    }

    const newCreatorData = {
      name: options.name,
      slug: unescape(options.name)
        .toLowerCase()
        .replace(/\//g, '-')
        .replace(/\s+/g, '-'),
      description: options.description,
      videoUrl: options.videoUrl,
      socials: options.socials,
      language: {
        connectOrCreate: {
          where: { name: options.language },
          create: {
            name: options.language,
          },
        },
      },
      status: options.status,
      tags: {
        create: options.tags.map((tag) => ({
          tag: {
            connectOrCreate: {
              where: { name: tag },
              create: {
                name: tag,
                description: `${tag} related content.`,
              },
            },
          },
        })),
      },
    };

    const newCreator = await prismaClient.creator.create({
      data: newCreatorData,
    });
    return newCreator;
  } catch (error) {
    console.error(`error creating ${options.name}`);
    throw error;
  }
};
