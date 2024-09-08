import { UserRole, UserStatus } from '@prisma/client';

type UserCreationData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

type GetUserSearchParams = {
  page?: number;
  limit?: number;
  name?: string;
  role?: UserRole;
  status?: UserStatus;
};

type UserUpdateData = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  guildId?: string;
  creatorId?: string;
};
