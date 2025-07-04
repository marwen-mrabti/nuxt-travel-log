import type { QueryClient } from "@tanstack/vue-query";
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

export function useInfiniteLocations() {
  return useInfiniteQuery<PaginatedResult<T_SelectLocation>, FetchError>({
    queryKey: ["locations", "paginated"],
    queryFn: ({ pageParam = 1 }) =>
      fetcher("/api/locations", { query: { page: pageParam, limit: 11 } }),
    getNextPageParam: lastPage =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    getPreviousPageParam: firstPage =>
      firstPage.meta.hasPreviousPage ? firstPage.meta.page - 1 : undefined,
    initialPageParam: 1,
    maxPages: 2,
  });
}

export function useLocation({ slug }: { slug: ComputedRef<string | undefined> }) {
  return useQuery<T_SelectLocation, FetchError>({
    queryKey: ["location", slug.value],
    queryFn: () => fetcher(`/api/locations/${slug.value}`),
    enabled: !!slug,
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

// Prefetch helpers
export function prefetchLocation({ slug, queryClient }: { slug: string; queryClient: QueryClient }) {
  if (!slug)
    return;
  queryClient.ensureQueryData({
    queryKey: ["location", slug],
    queryFn: () => fetcher(`/api/locations/${slug}`),
  });
}

export function prefetchLocations(queryClient: QueryClient) {
  queryClient.ensureInfiniteQueryData({
    queryKey: ["locations", "paginated"],
    queryFn: ({ pageParam = 1 }) =>
      fetcher("/api/locations", { query: { page: pageParam, limit: 11 } }),
    initialPageParam: 1,
  });
}
