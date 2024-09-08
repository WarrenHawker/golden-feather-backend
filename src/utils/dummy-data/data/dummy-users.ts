import { UserCreationData } from '../../../types/user';

const users: UserCreationData[] = [
  {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'password123',
    role: 'user',
    status: 'active',
  },
  {
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    password: 'password456',
    role: 'admin',
    status: 'inactive',
  },
  {
    name: 'Alice Johnson',
    email: 'alicej@example.com',
    password: 'alicePass789',
    role: 'user',
    status: 'locked',
  },
  {
    name: 'Bob Williams',
    email: 'bobw@example.com',
    password: 'bobPass321',
    role: 'user',
    status: 'active',
  },
  {
    name: 'Charlie Brown',
    email: 'charlieb@example.com',
    password: 'charlie123',
    role: 'admin',
    status: 'locked',
  },
  {
    name: 'Diana Prince',
    email: 'dianap@example.com',
    password: 'dianaPass456',
    role: 'user',
    status: 'inactive',
  },
  {
    name: 'Ethan Hunt',
    email: 'ethanh@example.com',
    password: 'ethanPass789',
    role: 'user',
    status: 'active',
  },
  {
    name: 'Fiona Gallagher',
    email: 'fionag@example.com',
    password: 'fiona123',
    role: 'admin',
    status: 'active',
  },
  {
    name: 'George Martin',
    email: 'georgem@example.com',
    password: 'georgePass321',
    role: 'user',
    status: 'locked',
  },
  {
    name: 'Hannah Wells',
    email: 'hannahw@example.com',
    password: 'hannahPass456',
    role: 'user',
    status: 'inactive',
  },
];

export default users;
