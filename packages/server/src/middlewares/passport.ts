import bcrypt from 'bcryptjs';
import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'password',
    },
    async (login, password, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: login }, { username: login }],
          },
        });

        if (!user) {
          return done(null, false, { message: 'Login or password is incorrect.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, { message: 'Login or password is incorrect.' });
        }

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return done(new Error('User not found.'));
  }

  return done(null, user);
});

/**
 * Authenticated middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();

  // Consider showing either an error, or simply redirect the user to log in page
  res.status(401);

  throw new Error('You are not authenticated.');
};

export default isAuthenticated;
