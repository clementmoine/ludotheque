import { Collection, Item } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { getCollectionById } from 'services/collections';

/**
 * Hook to get the collections
 */
export default function useCollection(collectionId: Collection['id'], query?: string) {
  const {
    data: collection,
    error,
    status,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['collections', collectionId, query],
    queryFn: () => getCollectionById(collectionId, query),
    enabled: !!collectionId,
    retry: false,
  });

  return {
    // Get the collection of the user.
    refetch,
    isLoading,

    collection,
    error,
    status,
  };
}
