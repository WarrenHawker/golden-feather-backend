import { NextFunction, Request, Response } from 'express';
import { isEmail, normalizeEmail } from 'validator';
import prismaClient from '../../lib/prisma/client.prisma';
import crypto from 'crypto';
import formatDate from '../../utils/functions/format-date.function';
import sendEmail from '../../services/email-service/email.service';
import storeResetTokenRedis from '../../services/redis-services/auth-redis-services/store-reset-token-redis.services';
import passwordResetEmailTemplate from '../../services/email-service/templates/password-reset.template';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const requestPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { email } = req.body;

  try {
    const user = await prismaClient.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return responseHandler(req, res, 200, {
        message:
          'If an account with that email exists, we have sent instructions to reset your password.',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    await storeResetTokenRedis(token, user.email, user.id);
    const resetUrl = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;
    const userIP = req.ip || req.socket.remoteAddress || '';
    const now = formatDate(Date());

    const { text, html } = passwordResetEmailTemplate(resetUrl, userIP, now);
    await sendEmail(email, 'password reset request', html, text);

    return responseHandler(req, res, 200, {
      message:
        'If an account with that email exists, we have sent instructions to reset your password.',
    });
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

export default requestPassword;
