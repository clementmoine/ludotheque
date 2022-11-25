import { Collection } from '@prisma/client';

/**
 * Get collections.
 * @returns {Promise<Collection[]>}
 */
export function fetchCollections(): Promise<Collection[]> {
  return fetch('/api/v1/collections', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      try {
        return response.json();
      } catch (error) {
        return [];
      }
    }

    throw new Error(response.statusText);
  });
}

export function getCollectionById(collectionId: Collection['id']): Promise<Collection> {
  return fetch(`/api/v1/collections/${collectionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      try {
        return response.json();
      } catch (error) {
        return [];
      }
    }

    throw new Error(response.statusText);
  });
}
