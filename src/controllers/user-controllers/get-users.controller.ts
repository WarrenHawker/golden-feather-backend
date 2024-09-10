import { Request, Response } from 'express';
import validator from 'validator';
import { GetUserSearchParams } from '../../types/user';
import {
  isNumber,
  isUserRole,
  isUserStatus,
} from '../../utils/functions/validate-input.function';
import { UserRole, UserStatus } from '@prisma/client';
import getUsersDB from '../../services/db-services/user-db-services/get-users.service';
import { ErrorReturn } from '../../types/error-return';

const { escape } = validator;

const getUsers = async (req: Request, res: Response) => {
  let { page, limit, name, role, status } = req.query;
  let searchParams: GetUserSearchParams = {};
  try {
    if (page) {
      if (!isNumber(page as string)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid "page" search param',
        };
        return res.status(400).json(error);
      } else {
        searchParams.page = parseInt(page as string);
      }
    }

    if (limit) {
      if (!isNumber(limit as string)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid "limit" search param',
        };
        return res.status(400).json(error);
      } else {
        searchParams.limit = parseInt(limit as string);
      }
    }

    if (name) {
      searchParams.name = escape(name as string).trim();
    }

    if (role) {
      if (!isUserRole(role as string)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid "role" search param',
        };
        return res.status(400).json(error);
      } else {
        searchParams.role = role as UserRole;
      }
    }

    if (status) {
      if (!isUserStatus(status as string)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid "status" search param',
        };
        return res.status(400).json(error);
      } else {
        searchParams.status = status as UserStatus;
      }
    }
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }

  try {
    const { pagination, users } = await getUsersDB(searchParams);
    return res.status(200).json({
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      entries: pagination.entries,
      totalEntries: pagination.totalEntries,
      users,
    });
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default getUsers;
