import type { QueryKey } from "@tanstack/vue-query";

import { $fetch } from "ofetch";

import type { PaginatedResult } from "~/lib/db/queries/locations-queries";
import type { T_SelectLocation } from "~/lib/db/schema";
import type { T_LocationInfo } from "~/server/api/locations.post";

export const fetcher = <T>(url: string, options?: any) => $fetch<T>(url, options);

// Query key factories
const locationKeys = {
  all: ["locations", "all"] as QueryKey,
  paginated: ["locations", "paginated"] as QueryKey,
  detail: (slug: string) => ["location", slug] as QueryKey,
};

// Query options
export const locationQueryOptions = {
  all: () => ({
    queryKey: locationKeys.all,
    queryFn: () => fetcher<T_LocationInfo[]>("/api/locations"),
  }),

  infinite: () => ({
    queryKey: ["locations", "paginated"],
    queryFn: (context: { pageParam?: number }) =>
      fetcher<PaginatedResult<T_SelectLocation>>("/api/locations", {
        query: { page: context.pageParam ?? 1, limit: 11 },
      }),
    getNextPageParam: (lastPage: PaginatedResult<T_SelectLocation>) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    getPreviousPageParam: (firstPage: PaginatedResult<T_SelectLocation>) =>
      firstPage.meta.hasPreviousPage ? firstPage.meta.page - 1 : undefined,
    initialPageParam: 1 as const,
    maxPages: 2,
  }),

  bySlug: (slug: string) => ({
    queryKey: locationKeys.detail(slug),
    queryFn: () => fetcher<T_SelectLocation>(`/api/locations/${slug}`),
  }),
};
