import validator from 'validator';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import createLog from '../../services/logger.service';
import createUserDB from '../../services/user-db-services/create-user.service';
import ErrorReturn from '../../types/error-return';
import { UserRole, UserStatus } from '@prisma/client';
import prismaClient from '../../lib/prisma/client.prisma';

const { isEmail, isStrongPassword, normalizeEmail, escape } = validator;

const signUpUser = async (req: Request, res: Response) => {
  let { name, email, password, repeatPassword } = req.body;

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

  if (password != repeatPassword) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Passwords do not match',
      params: ['password', 'repeatPassword'],
    };
    res.status(400).json(error);
    createLog('error', req, res, error);
    return;
  }

  name = escape(name).trim();
  email = escape(email).trim();
  email = normalizeEmail(email, { gmail_remove_dots: false });
  password = password.trim();
  repeatPassword = repeatPassword.trim();

  const user = await prismaClient.user.findUnique({ where: { email: email } });
  if (user) {
    const error: ErrorReturn = {
      code: 409,
      message: 'User with that email already exists',
      params: ['email'],
    };
    res.status(409).json(error);
    createLog('error', req, res, error);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUserData = {
    name: name,
    email: email,
    password: hashedPassword,
    created_on: new Date(),
    role: 'user' as UserRole,
    status: 'inactive' as UserStatus,
  };

  try {
    const user = await createUserDB(newUserData);
    res.status(201).json(user);
    createLog('info', req, res);
    return;
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    res.status(500).json(error);
    createLog('critical', req, res, error);
    return;
  }
};

export default signUpUser;
