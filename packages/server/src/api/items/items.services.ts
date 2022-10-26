import { Item, Prisma, PrismaClient } from '@prisma/client';
import { excludeFields } from 'utils/excludeFields';
import {
  SerpAPI,
  ScaleSerp,
  ValueSerp,
  ZenSerp,
  SerpWow,
  AvesAPI,
  SerpStack,
  ScrapingBee,
  DataForSEO,
} from './serp.services';

const prisma = new PrismaClient();

// Create item
export async function createItem(item: Omit<Item, 'id'>) {
  const createdItem = await prisma.item.create({
    data: item,
  });

  return createdItem;
}

// Get an item from his id
export async function getItemById(id: Item['id']) {
  const foundItem = await prisma.item.findUnique({
    where: {
      id,
    },
    include: {
      collections: {
        select: excludeFields(Prisma.CollectionScalarFieldEnum, ['ownerId']),
      },
    },
  });

  return foundItem;
}

// Sanitize item
export function sanitizeItem(item: Omit<Item, 'id'>) {
  const sanitizedItem: Omit<Item, 'id'> = {
    cover: item.cover,
    gtin: item.gtin != null ? String(item.gtin).replaceAll(/\s+/g, '').trim() : null,
    title: item.title != null ? String(item.title).replaceAll(/\s+/g, ' ').trim() : 'Aucun titre',
  };

  return sanitizedItem;
}

// Find an item from gtin or title with query
export async function findItemWithoutId(item: Omit<Item, 'id'>) {
  const sanitizedItem = sanitizeItem(item);

  const conditions: Prisma.Enumerable<Prisma.ItemWhereInput> = [
    {
      title: {
        search: sanitizedItem.title.trim().replaceAll(/\s+/g, ' & '),
        mode: 'insensitive',
      },
    },
  ];

  if (sanitizedItem.gtin != null) {
    conditions.push({
      gtin: {
        search: sanitizedItem.gtin,
        mode: 'insensitive',
      },
    });
  }

  const matchingItem = await prisma.item.findFirst({
    where: {
      OR: conditions,
    },
  });

  return matchingItem;
}

export async function findItemFromQueryString(q: any) {
  const query = String(q)
    .replaceAll(/[()|&:*!]/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .split(/\s+/g)
    .map((w) => `%${w}%`)
    .join('')
    .trim();

  const foundItem = await prisma.item.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          gtin: {
            contains: query.replaceAll(/\D/g, '') || 'INVALID_GTIN_GIVEN',
            mode: 'insensitive',
          },
        },
      ],
    },
  });

  return foundItem;
}

// Find the item in the database
export async function findItemByGtin(gtin: string) {
  // Try to find the product by gtin in the database
  const existingItem = await prisma.item.findUnique({
    where: {
      gtin,
    },
    include: {
      collections: {
        select: excludeFields(Prisma.CollectionScalarFieldEnum, ['ownerId']),
      },
    },
  });

  return existingItem;
}

// Scrap item from the GTIN
export function scrapItemByGtin(gtin: string): Promise<(Partial<Item> & { from: string }) | undefined> {
  async function scrap(lap = 0): Promise<(Partial<Item> & { from: string }) | undefined> {
    const providers = [
      SerpWow, // 100 requests / month
      ValueSerp, // 100 requests / month
      ScaleSerp, // 100 requests / month
      SerpAPI, // 100 requests / month
      SerpStack, // 100 requests / month
      ZenSerp, // 50 requests / month
      ScrapingBee, // 50 requests
      DataForSEO, // 1000 requests
      AvesAPI, // 1000 requests
    ] as const;

    if (!providers[lap]) {
      return;
    }

    const instance = new providers[lap]();

    const item = await instance.search(gtin);

    // Return the item with the provider name
    if (item) {
      return {
        ...item,
        from: instance.name,
      };
    }

    // Try to run the scraping on the next provider
    if (lap + 1 < providers.length) {
      return await scrap(lap + 1);
    }
  }

  return scrap();
}
