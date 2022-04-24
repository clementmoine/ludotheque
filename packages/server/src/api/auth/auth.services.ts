import { PrismaClient, RefreshToken } from '@prisma/client';

import hashToken from '../../utils/hashToken';

const prisma = new PrismaClient();

// Create a refresh token
export function createRefreshToken({
  jti,
  refreshToken,
  userId,
}: {
  refreshToken: string;
  jti: RefreshToken['id'];
  userId: RefreshToken['userId'];
}) {
  return prisma.refreshToken.create({
    data: {
      userId,
      id: jti,
      hashedToken: hashToken(refreshToken),
    },
  });
}

// Find a refresh token by id
export function findRefreshTokenById(id: RefreshToken['id']) {
  return prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

// Revoke a refresh token
export function revokeRefreshToken(id: RefreshToken['id']) {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

// Revoke all refresh tokens for a user
export function revokeUserTokens(userId: RefreshToken['userId']) {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}

export default {
  findRefreshTokenById,
  createRefreshToken,
  revokeRefreshToken,
  revokeUserTokens,
};
