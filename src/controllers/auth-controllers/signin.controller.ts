import validator from 'validator';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { prismaClient } from '../../lib/prisma/client.prisma';
import { ISession } from '../../types/express-session';
import { ErrorReturn } from '../../types/error-return';
import { UserObjectStripped } from '../../types/user';
import { createLog } from '../../services/logger.service';
import { redisClient } from '../../lib/redis/client.redis';

const { isEmail, isEmpty, isStrongPassword, normalizeEmail, escape } =
  validator;

export const signInUser = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  const missingParams = [];
  if (!email) {
    missingParams.push('email');
  }
  if (!password) {
    missingParams.push('password');
  }
  if (missingParams.length > 0) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Missing body parameters',
      params: missingParams,
    };
    res.status(400).json(error);
    createLog('error', req, res, error);
    return;
  }

  const emptyFields = [];
  if (isEmpty(email, { ignore_whitespace: true })) {
    emptyFields.push('email');
  }
  if (isEmpty(password, { ignore_whitespace: true })) {
    emptyFields.push('password');
  }
  if (emptyFields.length > 0) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Empty input fields',
      params: emptyFields,
    };
    res.status(400).json(error);
    createLog('error', req, res, error);
    return;
  }

  if (!isEmail(email)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Invalid email',
      params: ['email'],
    };
    res.status(400).json(error);
    createLog('error', req, res, error);
    return;
  }

  if (!isStrongPassword(password)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Password not strong enough',
      params: ['password'],
    };
    res.status(400).json(error);
    createLog('error', req, res, error);
    return;
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
    res.status(404).json(error);
    createLog('error', req, res, error);
    return;
  }

  const match = await bcrypt.compare(password, userDB.password);
  if (!match) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Wrong password',
      params: ['password'],
    };
    res.status(400).json(error);
    createLog('error', req, res, error);
    return;
  }

  try {
    (req.session as ISession).role = userDB.role;
    (req.session as ISession).status = userDB.status;
    (req.session as ISession).email = userDB.email;
    (req.session as ISession).clientId = req.socket.remoteAddress || '';
    (req.session as ISession).agent = req.headers['user-agent'] || '';

    redisClient.sAdd(`sessions:${userDB.email}`, req.sessionID);

    req.session.save((err) => {
      if (err) {
        console.error('Session save error', err);
        const error: ErrorReturn = {
          code: 500,
          message: (err as Error).message,
        };
        createLog('critical', req, res, error);
        return res.status(500).json(error);
      }
    });

    res.cookie('sessionId', req.session.id, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
    });

    console.log('Response Headers:', res.getHeaders());

    const user: UserObjectStripped = {
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
      role: userDB.role,
      status: userDB.status,
    };

    createLog('info', req, res);
    return res.status(200).json(user);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    createLog('critical', req, res, error);
    return res.status(500).json(error);
  }
};
