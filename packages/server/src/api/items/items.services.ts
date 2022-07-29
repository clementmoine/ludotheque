// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SerpApi from 'google-search-results-nodejs';

import { Item, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const search = new SerpApi.GoogleSearch(process.env.SERP_API_KEY);

export async function findItemByGtin(gtin: string) {
  // Try to find the product by gtin in the database
  const existingItem = await prisma.item.findUnique({
    where: {
      gtin,
    },
  });

  return existingItem;
}

export async function scrapItemByGtin(gtin: string): Promise<Partial<Item | undefined>> {
  const result = await new Promise<Record<string, any>>((resolve, reject) => {
    try {
      search.json(
        {
          hl: 'fr',
          gl: 'fr',
          tbm: 'shop',
          engine: 'google',
          google_domain: 'google.com',
          q: `${gtin} site:rakuten OR ${gtin}`,
        },
        resolve
      );
    } catch (e) {
      reject(e);
    }
  });

  if (result?.shopping_results?.length) {
    const product = result.shopping_results.find((product: Record<string, any>) => product?.title?.length);

    if (product) {
      return {
        title: product.title,
        gtin,
      };
    }
  }
}
