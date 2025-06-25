import type { FetchError } from "ofetch";

import { useMutation } from "@tanstack/vue-query";

import type { T_InsertLocation } from "~/lib/db/schema";
import type { T_LocationInfo } from "~/server/api/locations.post";

export function useInsertLocation() {
  const { $csrfFetch } = useNuxtApp();

  const insertLocation = async (values: T_InsertLocation) => {
    try {
      return await ($csrfFetch as typeof $fetch)("/api/locations", {
        method: "POST",
        body: values,
      });
    }
    catch (e) {
      const error = e as FetchError;
      throw error;
    }
  };

  return useMutation<T_LocationInfo, FetchError, T_InsertLocation>({
    mutationKey: ["addLocation"],
    mutationFn: insertLocation,
  });
}
