import { Request, Response } from 'express';
import createLog from '../../services/logger.service';
import ErrorReturn from '../../types/error-return';
import { isEmail, isStrongPassword, normalizeEmail } from 'validator';
import prismaClient from '../../lib/prisma/client.prisma';
import bcrypt from 'bcrypt';
import updateUserDB from '../../services/user-db-services/update-user.service';
import getResetTokenRedis from '../../services/redis-services/auth-redis-services/get-reset-token-redis.services';
import deleteKeyRedis from '../../services/redis-services/delete-key-redis.service';

const validateReset = async (req: Request, res: Response) => {
  let { email, password, repeatPassword, token } = req.body;

  try {
    if (!isEmail(email)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Invalid email',
        params: ['email'],
      };
      return res.status(400).json(error);
    }

    const data = await getResetTokenRedis(token);

    if (!data) {
      const error: ErrorReturn = {
        code: 404,
        message: 'token data not found',
      };
      return res.status(404).json(error);
    }

    if (!isStrongPassword(password)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Password not strong enough',
        params: ['password'],
      };
      return res.status(400).json(error);
    }

    if (password != repeatPassword) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Passwords do not match',
        params: ['password', 'repeatPassword'],
      };
      return res.status(400).json(error);
    }

    email = normalizeEmail(email, { gmail_remove_dots: false });

    if (data.email != email) {
      const error: ErrorReturn = {
        code: 400,
        message: 'request body email does not match token email',
        params: ['email'],
      };
      return res.status(400).json(error);
    }

    const user = await prismaClient.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      const error: ErrorReturn = {
        code: 404,
        message: 'user not found',
      };
      return res.status(404).json(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await updateUserDB(user.id, {
      password: hashedPassword,
    });

    await deleteKeyRedis(`passwordReset:token:${token}`);
    res.status(200).json({ message: 'password updated successfully' });
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    createLog('critical', req, res, error);
    return res.status(500).json(error);
  }
};

export default validateReset;
