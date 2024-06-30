import { UserRole, UserStatus } from '@prisma/client';

export type UserObjectStripped = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};
