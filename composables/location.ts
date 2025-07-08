import type { QueryClient } from "@tanstack/vue-query";
import type { $fetch, FetchError } from "ofetch";

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/vue-query";

import type { T_InsertLocation, T_SelectLocation } from "~/lib/db/schema";
import type { T_LocationInfo } from "~/server/api/locations.post";

import { locationQueryOptions } from "~/utils/query-options";

export function useLocations() {
  return useQuery<T_LocationInfo[], FetchError>(locationQueryOptions.all());
}

export function useInfiniteLocations() {
  return useInfiniteQuery(locationQueryOptions.infinite());
}

export function useLocation({ slug }: { slug: ComputedRef<string | undefined> }) {
  return useQuery<T_SelectLocation, FetchError>({
    ...locationQueryOptions.bySlug(slug.value),
    enabled: !!slug,
  });
}

export function useInsertLocation() {
  const { $csrfFetch } = useNuxtApp();
  return useMutation<T_LocationInfo, FetchError, T_InsertLocation>({
    mutationKey: ["addLocation"],
    mutationFn: (values: T_InsertLocation) =>
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
  queryClient.ensureQueryData(locationQueryOptions.bySlug(slug));
}

export function prefetchLocations(queryClient: QueryClient) {
  queryClient.ensureInfiniteQueryData(locationQueryOptions.infinite());
}
