import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../../lib/redis/client.redis';
import prismaClient from '../../lib/prisma/client.prisma';
import { ISession } from '../../types/express-session';
import lockAccount from '../../services/auth-services/lock-account.service';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const signInUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const userDB = await prismaClient.user.findUnique({
    where: { email: email },
    include: {
      authProviders: {
        where: { provider: 'credentials' },
        select: {
          password: true,
        },
      },
    },
  });

  const userPassword = userDB?.authProviders[0].password;

  if (!userDB) {
    return next(
      new CustomError(
        'Invalid credentials.',
        401,
        `User with email ${email} not found in the database.`
      )
    );
  }

  if (!userPassword) {
    return next(
      new CustomError(
        'Invalid credentials.',
        401,
        `Password not found for user with email ${email}.`
      )
    );
  }

  if (userDB.status == 'locked') {
    return next(
      new CustomError(
        'Account is locked.',
        403,
        `User with email ${email} is locked due to suspicious activity.`
      )
    );
  }

  const match = await bcrypt.compare(password, userPassword);
  if (!match) {
    const timeout = 10;
    const response = await redisClient
      .multi()
      .incr(`${userDB.email}_attempts`)
      .exec();
    const attempts = response[0];

    if (attempts == 1) {
      await redisClient.expire(`${userDB.email}_attempts`, timeout);
    }

    if ((attempts as number) > 5) {
      await lockAccount(userDB);
      return next(
        new CustomError(
          'Account is locked.',
          403,
          `User with email ${email} is locked due to too many failed signin attempts.`
        )
      );
    } else {
      return next(
        new CustomError(
          'Invalid credentials.',
          401,
          `Password doesn't match user with email ${email}.`
        )
      );
    }
  }

  try {
    (req.session as ISession).user = {
      id: userDB.id,
      role: userDB.role,
      status: userDB.status,
      email: userDB.email,
      clientId: req.socket.remoteAddress || '',
      agent: req.headers['user-agent'] || '',
    };

    redisClient.sAdd(`sessions:${userDB.email}`, req.sessionID);

    const user = {
      id: userDB.id,
      username: userDB.username,
      email: userDB.email,
      role: userDB.role,
      status: userDB.status,
    };

    return responseHandler(req, res, 200, user);
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

export default signInUser;
