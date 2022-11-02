import { Item } from '@prisma/client';

/**
 * Search an item.
 * @param {String} q The search query.
 * @returns {Promise<Item>}
 */
export function search(q: string): Promise<Item[]> {
  const query = new URLSearchParams({
    q,
  }).toString();

  const url = `/api/v1/items/search?${query}`;

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
