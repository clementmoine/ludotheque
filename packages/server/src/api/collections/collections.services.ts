import { Collection, Item, PrismaClient } from '@prisma/client';
import { createItem, findItemWithoutId } from 'api/items/items.services';

const prisma = new PrismaClient();

// Create collection
export async function createCollection(collection: Omit<Collection, 'id'>) {
  const createdCollection = await prisma.collection.create({
    data: collection,
  });

  return createdCollection;
}

// Add item to the collection
export async function addCollectionItem(id: Collection['id'], item: Omit<Item, 'id'>) {
  let existingItem = await findItemWithoutId(item);

  // Create the item when not existing
  if (!existingItem) {
    existingItem = await createItem(item);
  }

  // Check the collection is

  // Add the item to the collection
  await prisma.collection.update({
    where: { id },
    data: {
      items: {
        connect: {
          id: existingItem.id,
        },
      },
    },
  });

  return existingItem;
}

// Delete item to the collection
export async function deleteCollectionItem(id: Collection['id'], itemId: Item['id']) {
  // Check the item exists in the collection
  const existingItem = await prisma.collection
    .findFirst({
      where: {
        id,
        items: {
          some: {
            id: itemId,
          },
        },
      },
    })
    .items({
      where: {
        id: itemId,
      },
    });

  if (!existingItem) {
    throw new Error("Item doesn't exists");
  }

  // Add the item to the collection
  await prisma.collection.update({
    where: { id },
    data: {
      items: {
        disconnect: {
          id: itemId,
        },
      },
    },
  });

  return existingItem;
}

// Find the collection by id
export async function findCollectionById(id: Collection['id']) {
  return await prisma.collection.findUnique({
    where: { id },
  });
}
