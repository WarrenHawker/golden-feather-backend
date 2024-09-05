import createLog from '../../services/logger.service';
import ErrorReturn from '../../types/error-return';
import { Request, Response } from 'express';
import { UserUpdateData } from '../../types/user';
import {
  isUserRole,
  isUserStatus,
  isValidCuid,
} from '../../utils/functions/validate-input.function';
import isEmail from 'validator/lib/isEmail';
import { normalizeEmail, escape, isStrongPassword } from 'validator';
import bcrypt from 'bcrypt';
import updateUserDB from '../../services/user-db-services/update-user.service';

const updateUser = async (req: Request, res: Response) => {
  let { id: userId } = req.query;
  let { name, email, password, role, status, guildId, creatorId } = req.body;
  try {
    if (!isValidCuid(userId as string)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'invalid user id',
        params: ['id'],
      };
      return res.status(400).json(error);
    }

    const updateData: UserUpdateData = {};

    if (guildId) {
      if (!isValidCuid(guildId as string)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid guild id',
          params: ['guildId'],
        };
        return res.status(400).json(error);
      } else {
        updateData.guildId = guildId;
      }
    }

    if (creatorId) {
      if (!isValidCuid(creatorId as string)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid creator id',
          params: ['creatorId'],
        };
        return res.status(400).json(error);
      } else {
        updateData.creatorId = creatorId;
      }
    }

    if (status) {
      if (!isUserStatus(status)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid status',
          params: ['status'],
        };
        return res.status(400).json(error);
      } else {
        updateData.status = status;
      }
    }

    if (role) {
      if (!isUserRole(role)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid role',
          params: ['role'],
        };
        return res.status(400).json(error);
      } else {
        updateData.role = role;
      }
    }

    if (email) {
      if (!isEmail(email)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid email',
          params: ['email'],
        };
        return res.status(400).json(error);
      } else {
        updateData.email =
          normalizeEmail(email, { gmail_remove_dots: false }) || undefined;
      }
    }

    if (password) {
      if (!isStrongPassword(password)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'Password not strong enough',
          params: ['password'],
        };
        return res.status(400).json(error);
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (name) updateData.name = escape(name).trim();

    const { updatedUser, warningMessage1, warningMessage2 } =
      await updateUserDB(guildId as string, updateData);
    return res
      .status(200)
      .json({ updatedUser, warnings: [warningMessage1, warningMessage2] });
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    createLog('critical', req, res, error);
    return res.status(500).json(error);
  }
};

export default updateUser;
