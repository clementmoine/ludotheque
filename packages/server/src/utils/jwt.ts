import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

// Generate an access token
function generateAccessToken(userId: User['id']): string {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error('Internal server error');
  }

  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
}

// Generate a refresh token
function generateRefreshToken(userId: User['id'], jti: string): string {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('Internal server error');
  }

  return jwt.sign({ userId, jti }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
}

// Generate both access and refresh tokens
function generateTokens(userId: User['id'], jti: string): { accessToken: string; refreshToken: string } {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId, jti);

  return { accessToken, refreshToken };
}

export default generateTokens;
