import express from 'express';
import passport from 'passport';

import upload from 'middlewares/upload';
import { createUser, findUserByEmailOrUsername, sanitizeUser } from 'api/users/users.services';
import isAuthenticated from 'middlewares/passport';

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
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      avatar: req.file ? req.file.filename : null,
    });

    // Authenticate the user with passport
    req.login(user, (err) => {
      if (err) {
        throw err;
      }

      if (user.avatar) {
        user.avatar = `/uploads/${user.avatar}`;
      }

      res.json(sanitizeUser(user));
    });
  } catch (err) {
    next(err);
  }
});

// Login a user
router.post('/login', (req, res, next) => {
  try {
    passport.authenticate('local', (err, user) => {
      if (err) return next(err);

      if (!user) {
        res.status(401);

        return next(new Error('Login or password is incorrect.'));
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        if (user.avatar) {
          user.avatar = `/uploads/${user.avatar}`;
        }

        res.json(sanitizeUser(user));
      });
    })(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.get('/logout', isAuthenticated, async (req, res) => {
  req.logout();

  res.status(200);
  res.json({
    status: 'success',
    message: 'You have been logged out.',
  });
});

export default router;
