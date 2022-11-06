import bcrypt from 'bcryptjs';
import { Prisma, PrismaClient, User } from '@prisma/client';

import { excludeFields } from 'utils/excludeFields';
import { omit } from 'utils/omit';

const prisma = new PrismaClient();

// Create a user
export function createUser(user: Partial<User> & Required<Pick<User, 'email' | 'username' | 'password'>>) {
  user.password = bcrypt.hashSync(user.password, 12);

  return prisma.user.create({
    data: user,
  });
}

// Update a user
export function updateUser(
  user: Partial<Omit<User, 'password'>> & Required<Pick<User, 'id' | 'firstname' | 'lastname' | 'email'>>
) {
  return prisma.user.update({
    data: user,
    where: {
      id: user.id,
    },
  });
}

// Sanitize a user
export function sanitizeUser(user?: User) {
  if (!user) return;

  return omit(user, ['password']);
}

// Find a user by id
export function findUserById(id: User['id']) {
  return prisma.user.findUnique({
    where: { id },
    // Select every field except the password
    select: excludeFields(Prisma.UserScalarFieldEnum, ['password']),
  });
}

// Find a user by email or username
export function findUserByEmailOrUsername(
  email: User['email'] | User['username'],
  username?: User['username']
) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { username: username || email }],
    },
    // Select every field except the password
    select: excludeFields(Prisma.UserScalarFieldEnum, ['password']),
  });
}

// Find a user by username
export function findUserByUsername(username: User['username']) {
  return prisma.user.findUnique({
    where: { username },
    // Select every field except the password
    select: excludeFields(Prisma.UserScalarFieldEnum, ['password']),
  });
}

// Find a user by email
export function findUserByEmail(email: User['email']) {
  return prisma.user.findUnique({
    where: { email },
    // Select every field except the password
    select: excludeFields(Prisma.UserScalarFieldEnum, ['password']),
  });
}

export default {
  createUser,
  findUserById,
  findUserByEmail,
};
