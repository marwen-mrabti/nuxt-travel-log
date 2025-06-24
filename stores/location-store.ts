import type { FetchError } from "ofetch";

import { useMutation, useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";

import type { T_InsertLocation, T_SelectLocation } from "~/lib/db/schema";

export const useLocationStore = defineStore("location-store", () => {
  const route = useRoute();
  const { $csrfFetch } = useNuxtApp();

  // Fetch all locations
  async function getLocations() {
    const locations = await $fetch<T_SelectLocation[]>("/api/locations");
    return locations;
  }
  const { data: locations, error: locationsError, status: locationsStatus, isPending: locationsPending } = useQuery<T_SelectLocation[], FetchError>({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

  // Fetch a specific location by slug
  const slug = computed(() => route.params.slug as string);
  async function getLocationBySlug() {
    const location = await $fetch<T_SelectLocation>(`/api/locations/${slug.value}`);
    return location;
  }
  const { data: location, error: locationError, status: locationStatus, isPending: locationPending } = useQuery<T_SelectLocation, FetchError>({
    queryKey: ["location", slug],
    queryFn: getLocationBySlug,
    enabled: computed(() => slug.value !== undefined),
  });

  // insert location in the database
  const addLocation = async (values: T_InsertLocation) => {
    try {
      return await ($csrfFetch as typeof $fetch)("/api/locations", {
        method: "post",
        body: values,
      });
    }
    catch (e) {
      const error = e as FetchError;
      throw error;
    }
  };
  const {
    mutateAsync: insertLocationAsync,
    error: insertLocationError,
    isError: insertLocationIsError,
    isPending: insertLocationIsPending,
    isSuccess: insertLocationIsSuccess,
    reset: resetInsertLocation,
  } = useMutation(
    {
      mutationKey: ["addLocation"],
      mutationFn: addLocation,
      onError: (error: FetchError) => {
        return error;
      },
    },
  );

  return {
    locations,
    locationsError,
    locationsStatus,
    locationsPending,
    getLocations,

    location,
    locationError,
    locationStatus,
    locationPending,
    getLocationBySlug,

    insertLocationAsync,
    insertLocationError,
    insertLocationIsError,
    insertLocationIsPending,
    insertLocationIsSuccess,
    resetInsertLocation,
  };
});
