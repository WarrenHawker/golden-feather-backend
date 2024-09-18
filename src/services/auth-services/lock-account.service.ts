import { User } from '@prisma/client';
import prismaClient from '../../lib/prisma/client.prisma';
import { IOredisClient } from '../../lib/redis/client.redis';
import sendEmail from '../email-service/email.service';
import accountLockedTemplate from '../email-service/templates/account-locked-template';
import crypto from 'crypto';
import storeResetTokenRedis from '../redis-services/auth-redis-services/store-reset-token-redis.services';

const lockAccount = async (user: User) => {
  try {
    await prismaClient.user.update({
      where: { email: user.email },
      data: { status: 'locked' },
    });

    const activeSessions = await IOredisClient.smembers(
      `sessions:${user.email}`
    );
    for (const sessionId of activeSessions) {
      await IOredisClient.del(`sess:${sessionId}`);
    }

    await IOredisClient.del(`sessions:${user.email}`);

    const token = crypto.randomBytes(32).toString('hex');
    await storeResetTokenRedis(token, user.email, user.id);
    const resetUrl = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;

    const { text, html } = accountLockedTemplate(user.username, resetUrl);
    await sendEmail(user.email, 'account locked', text, html);
  } catch (error) {
    throw error;
  }
};

export default lockAccount;
