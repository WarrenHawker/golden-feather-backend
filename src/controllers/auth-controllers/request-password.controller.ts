import { Request, Response } from 'express';
import { isEmail, normalizeEmail } from 'validator';
import prismaClient from '../../lib/prisma/client.prisma';
import crypto from 'crypto';
import passwordResetEmailTemplate from '../../utils/templates/password-reset.template';
import formatDate from '../../utils/functions/format-date.function';
import sendEmail from '../../services/email.service';
import storeResetTokenRedis from '../../services/redis-services/auth-redis-services/store-reset-token-redis.services';
import { ErrorReturn } from '../../types/error-return';

const requestPassword = async (req: Request, res: Response) => {
  let { email } = req.body;

  try {
    if (!isEmail(email)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Invalid email',
        params: ['email'],
      };
      return res.status(400).json(error);
    }

    email = normalizeEmail(email, { gmail_remove_dots: false });

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

    const token = crypto.randomBytes(32).toString('hex');
    await storeResetTokenRedis(token, user.email, user.id);
    const resetUrl = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;
    const userIP = req.ip || req.socket.remoteAddress || '';
    const now = formatDate(Date());

    const { text, html } = passwordResetEmailTemplate(resetUrl, userIP, now);
    await sendEmail(email, 'password reset request', html, text);

    return res.sendStatus(201);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
};

export default requestPassword;
