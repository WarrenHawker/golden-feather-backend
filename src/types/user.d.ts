import { UserRole, UserStatus } from '@prisma/client';

export type UserCreationData = {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

export type GetUserSearchParams = {
  page?: number;
  limit?: number;
  username?: string;
  role?: UserRole;
  status?: UserStatus;
};

export type UserUpdateData = {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  guildId?: string;
  creatorId?: string;
};
