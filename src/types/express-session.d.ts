import { UserRole, UserStatus } from '@prisma/client';
import { Session } from 'express-session';

interface ISession extends Session {
  user: {
    id: string;
    role: UserRole;
    status: UserStatus;
    email: string;
    clientId: string;
    agent: string;
  };
}

type SessionSearchData = {
  role?: UserRole;
  status?: UserStatus;
  email?: { contains: string; mode?: any };
};
