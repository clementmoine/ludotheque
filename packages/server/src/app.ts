import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';

import api from 'api';
import notFound from 'middlewares/notFound';
import errorHandler from 'middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(flash());
app.use(helmet());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }), express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

export default app;
