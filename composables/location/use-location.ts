import type { FetchError } from "ofetch";

import { useQuery } from "@tanstack/vue-query";

import type { T_SelectLocation } from "~/lib/db/schema";

export function useLocation(slug: string | undefined) {
  const getLocation = async () => {
    try {
      return await $fetch<T_SelectLocation>(`/api/locations/${slug}`);
    }
    catch (e) {
      const error = e as FetchError;
      throw error;
    }
  };

  return useQuery<T_SelectLocation, FetchError>({
    queryKey: ["location", slug],
    queryFn: getLocation,
    enabled: !!slug,
  });
}
