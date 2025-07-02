import type { FetchError } from "ofetch";

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/vue-query";
import { $fetch } from "ofetch";

import type { PaginatedResult } from "~/lib/db/queries/locations-queries";
import type { T_InsertLocation, T_SelectLocation } from "~/lib/db/schema";
import type { T_LocationInfo } from "~/server/api/locations.post";

export const fetcher = <T>(url: string, options?: any) => $fetch<T>(url, options);

export function useLocations() {
  return useQuery<T_LocationInfo[], FetchError>({
    queryKey: ["locations", "all"],
    queryFn: () => fetcher("/api/locations"),
  });
}

export function useInfiniteLocations({ enabled }: { enabled: ComputedRef<boolean> }) {
  return useInfiniteQuery<PaginatedResult<T_SelectLocation>, FetchError>({
    queryKey: ["locations-paginated"],
    queryFn: ({ pageParam = 1 }) =>
      fetcher("/api/locations", { query: { page: pageParam, limit: 10 } }),
    getNextPageParam: lastPage =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    getPreviousPageParam: firstPage =>
      firstPage.meta.hasPreviousPage ? firstPage.meta.page - 1 : undefined,
    initialPageParam: 1,
    maxPages: 2,
    enabled,
  });
}

export function useLocation({ slug, enabled }: { slug: ComputedRef<string | undefined>; enabled: ComputedRef<boolean> }) {
  return useQuery<T_SelectLocation, FetchError>({
    queryKey: ["location", slug],
    queryFn: () => fetcher(`/api/locations/${slug.value}`),
    enabled,
  });
}

export function useInsertLocation() {
  const { $csrfFetch } = useNuxtApp();
  return useMutation<T_LocationInfo, FetchError, T_InsertLocation>({
    mutationKey: ["addLocation"],
    mutationFn: values =>
      ($csrfFetch as typeof $fetch)("/api/locations", {
        method: "POST",
        body: values,
      }),
  });
}
