import validator from 'validator';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { redisClient } from '../../lib/redis/client.redis';
import prismaClient from '../../lib/prisma/client.prisma';
import ErrorReturn from '../../types/error-return';
import { ISession } from '../../types/express-session';
import csrf from 'csurf';

const { isEmail, isStrongPassword, normalizeEmail, escape } = validator;
const csrfProtection = csrf({ cookie: true });

const signInUser = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  if (!isEmail(email)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Invalid email',
      params: ['email'],
    };
    return res.status(400).json(error);
  }

  if (!isStrongPassword(password)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Password not strong enough',
      params: ['password'],
    };
    return res.status(400).json(error);
  }

  email = escape(email).trim();
  email = normalizeEmail(email, { gmail_remove_dots: false });
  password = password.trim();

  const userDB = await prismaClient.user.findUnique({
    where: { email: email },
  });
  if (!userDB) {
    const error: ErrorReturn = {
      code: 404,
      message: 'User not found',
      params: ['email'],
    };
    return res.status(404).json(error);
  }

  const match = await bcrypt.compare(password, userDB.password);
  if (!match) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Wrong password',
      params: ['password'],
    };
    return res.status(400).json(error);
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

    const csrfToken = req.csrfToken();

    const user = {
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
      role: userDB.role,
      status: userDB.status,
    };

    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json(user);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
};

export default signInUser;
