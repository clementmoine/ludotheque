import express from 'express';

// Routes
import auth from 'api/auth/auth.routes';
import items from 'api/items/items.routes';
import users from 'api/users/users.routes';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/items', items);

export default router;
