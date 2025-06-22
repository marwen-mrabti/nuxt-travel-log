import { defineStore } from "pinia";

import type { T_SelectLocation } from "~/lib/db/schema";

export const useLocationStore = defineStore("useLocationStore", () => {
  const route = useRoute();

  const { data: locations, status: locationsStatus, error: locationsError, refresh: refreshLocations } = useFetch<T_SelectLocation[]>("/api/locations", {
    method: "GET",
    lazy: true,
  });

  const slug = computed(() => route.params.slug as string);
  const locationUrlWithSlug = computed(() => `/api/locations/${slug.value}`);

  const { data: location, status: locationStatus, error: locationError, refresh: refreshLocation } = useFetch<T_SelectLocation>(locationUrlWithSlug, {
    method: "GET",
    lazy: true,
    immediate: false,
    watch: [slug],
  });

  return {
    locations,
    locationsStatus,
    locationsError,
    refreshLocations,
    location,
    locationStatus,
    locationError,
    refreshLocation,
  };
});
