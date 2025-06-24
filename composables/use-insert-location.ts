import type { FetchError } from "ofetch";

import { useMutation, useQueryClient } from "@tanstack/vue-query";

import type { T_InsertLocation } from "~/lib/db/schema";

export function useInsertLocation() {
  const queryClient = useQueryClient();
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

  return useMutation<unknown, FetchError, T_InsertLocation>({
    mutationFn: insertLocation,
    mutationKey: ["addLocation"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}
