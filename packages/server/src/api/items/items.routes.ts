import { Item, Prisma, PrismaClient } from '@prisma/client';
import express from 'express';

import isAuthenticated from 'middlewares/passport';
import { excludeFields } from 'utils/excludeFields';
import { findItemByGtin, findItemFromQueryString, getItemById, scrapItemByGtin } from './items.services';

const router = express.Router();
const prisma = new PrismaClient();

// Get every items paginated
router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const limit = Math.max(Number(req.query.limit ?? 20), 1);

    const [items, total] = await prisma.$transaction([
      prisma.item.findMany({
        take: limit,
        skip: (page - 1) * limit,
        include: {
          collections: {
            select: excludeFields(Prisma.CollectionScalarFieldEnum, ['ownerId']),
          },
        },
      }),
      prisma.item.count(),
    ]);

    const response: {
      total: number;
      previous?: { page: number; limit: number };
      next?: { page: number; limit: number };
      results: Item[];
    } = {
      total: Math.max(total, 0),
      previous: {
        page: page - 1,
        limit: limit,
      },
      next: {
        page: page + 1,
        limit: limit,
      },
      results: items,
    };

    if (response.previous && response.previous?.page <= 0) {
      delete response.previous;
    }

    if (response.next && response.next?.page <= 0) {
      delete response.next;
    }

    res.status(206);

    res.json(response);

    return;
  } catch (err) {
    next(err);
  }
});

// Search an item from query string
router.get('/search', isAuthenticated, async (req, res, next) => {
  try {
    const { q = '' } = req.query;

    if (String(q).trim().length) {
      const items = await findItemFromQueryString(String(q).trim());

      if (items.length) {
        res.json(items);

        return;
      }
    }

    res.json([]);
  } catch (err) {
    next(err);
  }
});

// Search item from GTIN
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

      return;
    }

    res.status(404);

    throw new Error('Item not found.');
  } catch (err) {
    next(err);
  }
});

// Get the item from the id
router.get('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await getItemById(Number(id));

    if (item) {
      res.json(item);

      return;
    }

    res.status(404);

    throw new Error('Item not found.');
  } catch (err) {
    next(err);
  }
});

export default router;
