import { UserRole, UserStatus } from '@prisma/client';

export type UserCreationData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

export type GetUserSearchParams = {
  page?: number;
  limit?: number;
  name?: string;
  role?: UserRole;
  status?: UserStatus;
};
