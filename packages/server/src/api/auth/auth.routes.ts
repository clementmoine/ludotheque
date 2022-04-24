import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';

import {
  createUser,
  findUserByEmail,
  findUserByEmailOrUsername,
  findUserById,
  findUserByUsername,
} from 'api/users/users.services';
import {
  createRefreshToken,
  findRefreshTokenById,
  revokeRefreshToken,
  revokeUserTokens,
} from 'api/auth/auth.services';
import generateTokens from 'utils/jwt';
import hashToken from 'utils/hashToken';
import { upload } from 'middlewares';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = express.Router();

// Register a user
router.post('/register', upload.single('avatar'), async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !password) {
      res.status(400);

      throw new Error('You must provide an email and a password.');
    }

    const existingUser = await findUserByEmailOrUsername(email, username);

    if (existingUser) {
      res.status(401);

      throw new Error('This email or username is already in use.');
    }

    const user = await createUser({
      email,
      password,
      username,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      avatar: req.file ? req.file.filename : null,
    });

    const jti = uuid();
    const { accessToken, refreshToken } = generateTokens(user.id, jti);

    await createRefreshToken({ jti, refreshToken, userId: user.id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

// Login a user
router.post('/login', async (req, res, next) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      res.status(400);

      throw new Error('You must provide a login and a password.');
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    });

    if (!user) {
      res.status(401);

      throw new Error('Login or password is incorrect.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401);

      throw new Error('Email or password is incorrect.');
    }

    const jti = uuid();
    const { accessToken, refreshToken } = generateTokens(user.id, jti);

    await createRefreshToken({ jti, refreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

// Refresh user token
router.post('/refreshToken', async (req, res, next) => {
  try {
    // Get the refresh token from the request body or the cookie
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400);

      throw new Error('Missing refresh token.');
    }

    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('Internal server error');
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (typeof payload === 'string' || !payload.jti) {
      res.status(401);

      throw new Error('Unauthorized');
    }

    const savedRefreshToken = await findRefreshTokenById(payload.jti);
    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);

      throw new Error('Unauthorized');
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);

      throw new Error('Unauthorized');
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    await revokeRefreshToken(savedRefreshToken.id);

    const jti = uuid();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, jti);

    await createRefreshToken({ jti, refreshToken: newRefreshToken, userId: user.id });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
});

// This endpoint is only for demo purpose.
// Move this logic where you need to revoke the tokens( for ex, on password reset)
router.post('/revokeRefreshTokens', async (req, res, next) => {
  try {
    const { userId } = req.body;

    await revokeUserTokens(userId);

    res.json({ message: `Tokens revoked for user with id #${userId}` });
  } catch (err) {
    next(err);
  }
});

export default router;
