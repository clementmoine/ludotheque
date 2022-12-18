import { Collection, Prisma, PrismaClient } from '@prisma/client';
import { sanitizeItem } from 'api/items/items.services';
import express from 'express';

import isAuthenticated from 'middlewares/passport';
import { excludeFields } from 'utils/excludeFields';
import { addCollectionItem, createCollection, deleteCollectionItem } from './collections.services';

const router = express.Router();

const prisma = new PrismaClient();

// Get every collections
router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const { q } = req.query;
    const ownerId = req.user!.id;

    const collections = await prisma.collection.findMany({
      select: {
        ...excludeFields(Prisma.CollectionScalarFieldEnum, ['ownerId']),
        _count: {
          select: {
            items: true,
          },
        },
      },
      where: {
        ownerId,
        ...(q && {
          OR: [
            { label: { contains: q as string | undefined, mode: 'insensitive' } },
            {
              items: {
                some: {
                  title: { contains: q as string | undefined, mode: 'insensitive' },
                },
              },
            },
          ],
        }),
      },
    });

    if (collections.length) {
      res.json(collections);

      return;
    }

    res.json([]);
  } catch (err) {
    next(err);
  }
});

// Create a collection
router.post('/', isAuthenticated, async (req, res, next) => {
  try {
    const { label, icon, color } = req.body as Collection;

    const createdCollection = await createCollection({ label, icon, color, ownerId: req.user!.id });

    res.json(createdCollection);
  } catch (err) {
    next(err);
  }
});

// Delete an item from a collection
router.delete('/:id/items/:itemId', isAuthenticated, async (req, res, next) => {
  try {
    const { id, itemId } = req.params;

    const deletedItem = await deleteCollectionItem(Number(id), Number(itemId));

    res.json(deletedItem);
  } catch (err) {
    next(err);
  }
});

// Add an item to the collection
router.post('/:id/items', isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const { id } = req.params;

    const collection = await prisma.collection.findFirst({
      where: {
        ownerId: userId,
        id: Number(id),
      },
    });

    if (!collection) {
      res.status(401);

      throw new Error('Collection is not yours.');
    }

    const createdItem = await addCollectionItem(Number(id), sanitizeItem(req.body));

    res.json(createdItem);
  } catch (err) {
    next(err);
  }
});

// Get collection from the id
router.get('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const { q } = req.query;
    const { id } = req.params;

    const ownerId = req.user!.id;

    const collection = await prisma.collection.findFirst({
      select: {
        ...excludeFields(Prisma.CollectionScalarFieldEnum, ['ownerId']),
        items: q
          ? {
              where: {
                title: { contains: q as string | undefined, mode: 'insensitive' },
              },
            }
          : true,
      },
      where: {
        id: Number(id),
        ownerId,
      },
    });

    if (collection) {
      res.json(collection);

      return;
    }

    res.status(404);

    throw new Error('Collection not found.');
  } catch (err) {
    next(err);
  }
});

// Delete a collection
router.delete('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;

    const ownerId = req.user!.id;

    const collection = await prisma.collection.findFirst({
      where: {
        id: Number(id),
        ownerId,
      },
    });

    if (!collection) {
      res.status(401);

      throw new Error("Collection can't be deleted.");
    }

    // Delete the collection
    await prisma.collection.delete({
      where: {
        id: Number(id),
      },
    });

    res.json(collection);
  } catch (err) {
    next(err);
  }
});

export default router;
