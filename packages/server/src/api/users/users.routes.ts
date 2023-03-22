import express from 'express';

import upload from 'middlewares/upload';
import isAuthenticated from 'middlewares/passport';

import { findUserById, sanitizeUser, updateUser } from './users.services';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = express.Router();

// Update the avatar of the user
router.patch('/me/avatar', isAuthenticated, upload.single('avatar'), async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const avatar = req.file ? req.file.filename : null;

    const updatedUser = await prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          avatar,
        },
      })
      .then((user) => {
        return sanitizeUser(user);
      });

    if (!updatedUser) {
      res.status(404);

      throw new Error('User not found.');
    }

    // Format the user's avatar
    if (updatedUser.avatar) {
      updatedUser.avatar = `/uploads/${updatedUser.avatar}`;
    }

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// Update the profile
router.put('/me', isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const updatedUser = await updateUser({ id: userId, ...req.body }).then((user) => {
      return sanitizeUser(user);
    });

    if (!updatedUser) {
      res.status(404);

      throw new Error('User not found.');
    }

    // Format the user's avatar
    if (updatedUser.avatar) {
      updatedUser.avatar = `/uploads/${updatedUser.avatar}`;
    }

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// Get my profile
router.get('/me', isAuthenticated, async (req, res, next) => {
  try {
    const user = sanitizeUser(req.user);

    if (!user) {
      res.status(401);

      throw new Error('You are not authenticated.');
    }

    // Format the user's avatar
    if (user.avatar) {
      user.avatar = `/uploads/${user.avatar}`;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Get user by id
router.get('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      res.status(404);

      throw new Error('User not found.');
    }

    // Format the user's avatar
    if (user.avatar) {
      user.avatar = `/uploads/${user.avatar}`;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
