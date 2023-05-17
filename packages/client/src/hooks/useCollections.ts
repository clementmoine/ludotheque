import { Collection } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { fetchCollections } from 'services/collections';

/**
 * Hook to get the collections
 */
export default function useCollections(query?: string) {
  const {
    data: collections,
    error,
    status,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['collections', query],
    queryFn: () => fetchCollections(query),
    retry: false,
  });

  return {
    // Get the collections of the user.
    refetch,
    isLoading,

    collections,
    error,
    status,
  };
}
