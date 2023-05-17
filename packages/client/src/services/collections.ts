import { Collection, Item } from '@prisma/client';

/**
 * Get collections.
 * @returns {Promise<Collection[]>}
 */

export function fetchCollections(
  query?: string
): Promise<Array<Omit<Collection, 'ownerId'> & { _count: { items: number } }>> {
  const host = `${window.location.protocol}//${window.location.host}`;
  const url = new URL(`${host}/api/v1/collections`);

  if (query) {
    url.search = new URLSearchParams({
      q: query,
    }).toString();
  }

  return fetch(url, {
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

export function getCollectionById(
  collectionId: Collection['id'],
  query?: string
): Promise<Collection & { items: Item[] }> {
  const host = `${window.location.protocol}//${window.location.host}`;
  const url = new URL(`${host}/api/v1/collections/${collectionId}`);

  if (query) {
    url.search = new URLSearchParams({
      q: query,
    }).toString();
  }

  return fetch(url, {
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
