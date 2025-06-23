import type { FetchError } from "ofetch";

import { useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";

import type { T_SelectLocation } from "~/lib/db/schema";

export const useLocationStore = defineStore("location-store", () => {
  const route = useRoute();

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
    enabled: !!slug,
  });

  // insert location in the database

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
  };
});
