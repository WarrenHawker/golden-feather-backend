import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { UserRole, UserStatus } from '@prisma/client';
import prismaClient from '../../lib/prisma/client.prisma';
import createUserDB from '../../services/db-services/user-db-services/create-user.service';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, repeatPassword } = req.body;

  if (password != repeatPassword.trim()) {
    return next(new CustomError('Passwords do not match.', 400));
  }

  const user = await prismaClient.user.findUnique({ where: { email: email } });
  if (user) {
    return next(
      new CustomError(
        'Unable to process your request. Please try again later.',
        400,
        `User with email ${email} already exists.`
      )
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUserData = {
    username: username,
    email: email,
    password: hashedPassword,
    created_on: new Date(),
    role: 'user' as UserRole,
    status: 'inactive' as UserStatus,
  };

  try {
    const user = await createUserDB(newUserData);
    return responseHandler(req, res, 201, user);
  } catch (error) {
    const statusCode = (error as any).statusCode || 500;
    const detailedMessage = (error as any).message || 'Unknown error occurred';
    return next(
      new CustomError(
        'An unexpected error occurred. Please try again later.',
        statusCode,
        detailedMessage
      )
    );
  }
};

export default signUpUser;
