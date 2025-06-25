import type { FetchError } from "ofetch";

import { useQuery } from "@tanstack/vue-query";
import { $fetch } from "ofetch";

import type { T_SelectLocation } from "~/lib/db/schema";

export function useLocations() {
  const getLocations = async () => {
    try {
      return await $fetch<T_SelectLocation[]>("/api/locations");
    }
    catch (e) {
      const error = e as FetchError;
      throw error;
    }
  };
  return useQuery<T_SelectLocation[], FetchError>({
    queryKey: ["locations"],
    queryFn: getLocations,
  });
}
