import { PrismaClient } from '@prisma/client';
import express from 'express';

import isAuthenticated from 'middlewares/passport';
import { findItemByGtin, scrapItemByGtin } from './items.services';

const router = express.Router();

router.get('/gtin/:gtin', isAuthenticated, async (req, res, next) => {
  try {
    const { gtin } = req.params;

    const item = await findItemByGtin(gtin);

    if (item) {
      res.json(item);

      return;
    }

    // If the item doesn't exist, try to find it from scraped data
    const scrapedItem = await scrapItemByGtin(gtin);

    if (scrapedItem) {
      res.json(scrapedItem);
    }

    res.status(404);

    throw new Error('Item not found.');
  } catch (err) {
    next(err);
  }
});

export default router;
