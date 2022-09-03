import { Item, PrismaClient } from '@prisma/client';
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

// Find the item in the database
export async function findItemByGtin(gtin: string) {
  // Try to find the product by gtin in the database
  const existingItem = await prisma.item.findUnique({
    where: {
      gtin,
    },
  });

  return existingItem;
}

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
