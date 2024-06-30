import { UserRole, UserStatus } from '@prisma/client';
import { Session } from 'express-session';

export interface ISession extends Session {
  role: UserRole;
  status: UserStatus;
  email: string;
}

export type SessionSearchData = {
  role?: UserRole;
  status?: UserStatus;
  email?: { contains: string; mode?: any };
};
