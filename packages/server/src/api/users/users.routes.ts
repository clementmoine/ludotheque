import express from 'express';

import isAuthenticated from 'middlewares/passport';
import { findUserById, sanitizeUser } from './users.services';

const router = express.Router();

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
      user.avatar = `${req.protocol}://${req.get('host')}/uploads/${user.avatar}`;
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
      user.avatar = `${req.protocol}://${req.get('host')}/uploads/${user.avatar}`;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
