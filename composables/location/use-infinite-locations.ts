import type { FetchError } from "ofetch";

import { useInfiniteQuery } from "@tanstack/vue-query";
import { $fetch } from "ofetch";

import type { PaginatedResult } from "~/lib/db/queries/locations-queries";
import type { T_SelectLocation } from "~/lib/db/schema";

export function useInfiniteLocations(limit = 12) {
  const getLocations = async ({ page }: { page: number | unknown }) => {
    try {
      return await $fetch<PaginatedResult<T_SelectLocation>>("/api/locations", {
        query: { page, limit },
      });
    }
    catch (e) {
      const error = e as FetchError;
      throw error;
    }
  };

  return useInfiniteQuery<PaginatedResult<T_SelectLocation>, FetchError>({
    queryKey: ["locations", "paginated"],
    queryFn: ({ pageParam }: { pageParam?: unknown }) => getLocations({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.meta.hasPreviousPage ? firstPage.meta.page - 1 : undefined;
    },
    initialPageParam: 1,
    maxPages: 4,
  });
}
