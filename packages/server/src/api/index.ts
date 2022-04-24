import express from 'express';

// Routes
import auth from 'api/auth/auth.routes';
import users from 'api/users/users.routes';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', users);

export default router;
