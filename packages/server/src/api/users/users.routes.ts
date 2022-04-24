import express from 'express';

import { findUserById } from 'api/users/users.services';
import { isAuthenticated } from 'middlewares';

const router = express.Router();

// Get my profile
router.get('/me', isAuthenticated, async (req, res, next) => {
  try {
    const user = await findUserById(req.user.userId);

    if (!user) {
      res.status(404);

      throw new Error('User not found.');
    }

    res.json({
      ...user,
      avatar: user.avatar ? `${req.protocol}://${req.get('host')}/uploads/${user.avatar}` : null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
