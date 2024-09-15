import { NextFunction, Request, Response } from 'express';
import prismaClient from '../../lib/prisma/client.prisma';
import bcrypt from 'bcrypt';
import getResetTokenRedis from '../../services/redis-services/auth-redis-services/get-reset-token-redis.services';
import deleteKeyRedis from '../../services/redis-services/delete-key-redis.service';
import updateUserDB from '../../services/db-services/user-db-services/update-user.service';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const validateReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, repeatPassword, token } = req.body;

  try {
    const data = await getResetTokenRedis(token);

    if (!data) {
      return next(
        new CustomError(
          'The reset link is invalid or has expired.',
          400,
          `Invalid or expired reset token: ${token}`
        )
      );
    }

    if (password != repeatPassword.trim()) {
      return next(new CustomError('Passwords do not match.', 400));
    }

    if (data.email != email) {
      return next(
        new CustomError(
          'The reset link is invalid or has expired.',
          400,
          `Email mismatch: token email ${data.email} does not match provided email ${email}.`
        )
      );
    }

    const user = await prismaClient.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return next(
        new CustomError(
          'Unable to reset password. Please try again later.',
          400,
          `User with email ${email} not found during password reset process.`
        )
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await updateUserDB(user.id, {
      password: hashedPassword,
    });

    await deleteKeyRedis(`passwordReset:token:${token}`);
    return responseHandler(req, res, 200);
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

export default validateReset;
