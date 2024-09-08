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

import { unescape } from 'validator';
import prismaClient from '../../../lib/prisma/client.prisma';
import { CreatorCreationData } from '../../../types/creator';

export const createCreatorDB = async (options: CreatorCreationData) => {
  try {
    /*
      if userId is given, check the user exists and is not already
      linked to another creator profile. If either case happens the 
      creator profile will be created without a linked user and a 
      warning returned with the new creator. 
    */
    let warningMessage = '';
    let user;

    if (options.userId) {
      user = await prismaClient.user.findUnique({
        where: { id: options.userId },
        include: {
          creator: true,
        },
      });

      if (!user) {
        warningMessage =
          'User not found. Creator profile will be created without a linked user.';
      } else if (user.creator) {
        warningMessage =
          'User is already linked to another creator profile. Profile will be created without linking the user.';
      }
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
      user:
        user && !user.creator ? { connect: { id: options.userId } } : undefined,
    };

    const newCreator = await prismaClient.creator.create({
      data: newCreatorData,
    });
    return { newCreator, warningMessage };
  } catch (error) {
    throw error;
  }
};