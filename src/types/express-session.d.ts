import { UserRole, UserStatus } from '@prisma/client';
import { Session } from 'express-session';

export interface ISession extends Session {
  user: {
    id: string;
    role: UserRole;
    status: UserStatus;
    email: string;
    clientId: string;
    agent: string;
  };
}

export type SessionSearchData = {
  role?: UserRole;
  status?: UserStatus;
  email?: { contains: string; mode?: any };
};
