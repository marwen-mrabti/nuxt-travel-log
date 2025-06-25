import type { FetchError } from "ofetch";

import { useQuery } from "@tanstack/vue-query";
import { $fetch } from "ofetch";

type T_LocationInfo = {
  id: string;
  slug: string;
  name: string;
};

export function useLocations() {
  const getLocations = async () => {
    try {
      return await $fetch<T_LocationInfo[]>("/api/locations");
    }
    catch (e) {
      const error = e as FetchError;
      throw error;
    }
  };
  return useQuery<T_LocationInfo[], FetchError>({
    queryKey: ["locations", "all"],
    queryFn: getLocations,
  });
}
