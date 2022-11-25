import { Collection } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { getCollectionById } from 'services/collections';

/**
 * Hook to get the collections
 */
export default function useCollection(collectionId: Collection['id']) {
  console.log(collectionId);
  const {
    data: collection,
    error,
    status,
    isLoading,
    refetch,
  } = useQuery<Collection, Error>({
    queryKey: ['collections', collectionId],
    queryFn: () => getCollectionById(collectionId),
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
