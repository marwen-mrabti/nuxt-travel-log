<script setup lang="ts">
import { LngLat } from "maplibre-gl";

import type { T_SelectLocation } from "~/lib/db/schema";

const props = defineProps<{
  location?: T_SelectLocation | undefined;
  locations?: T_SelectLocation[] | undefined;
}>();

const colorMode = useColorMode();
const mapStyle = computed(() => colorMode.value === "dark" ? "https://tiles.openfreemap.org/styles/dark" : "https://tiles.openfreemap.org/styles/liberty");
const zoom = computed(() => props.locations?.length ? 2 : 5);
const newLocationCords = useCords();

const center = computed(() => {
  if (props.locations?.length) {
    return new LngLat(props?.locations[0]?.long as number, props.locations[0]?.lat as number);
  }
  else if (props.location) {
    return new LngLat(props?.location?.long, props.location?.lat);
  }
  else {
    return new LngLat(newLocationCords.value.lng, newLocationCords.value.lat);
  }
});
</script>

<template>
  <div class="relative w-full mt-2 min-h-[50dvh] h-[60dvh] flex justify-center border-1 border-base-100 rounded-md overflow-hidden">
    <MglMap
      :center="center"
      :zoom="zoom"
      :map-style="mapStyle"
    >
      <MglFullscreenControl />
      <MglNavigationControl />
      <MglGeolocateControl />

      <div v-if="locations?.length">
        <MglMarker
          v-for="loc in locations"
          :key="loc.id"
          :coordinates="new LngLat(loc.long, loc.lat)"
        >
          <template #marker>
            <div
              class="hover:tooltip tooltip-top tooltip-open hover:cursor-pointer"
              :data-tip="loc.description"
            >
              <AppPrefetchLink
                :to="{ name: 'dashboard-location-slug', params: { slug: loc.slug } }"
                :query-key="['location', loc.slug]"
                :query-fn="() => fetcher(`/api/locations/${loc.slug}`)"
              >
                <Icon
                  name="tabler:map-pin-filled"
                  size="24"
                  class="text-primary dark:text-error hover:brightness-90"
                />
              </AppPrefetchLink>
            </div>
          </template>
        </MglMarker>
      </div>

      <div v-else-if="location">
        <MglMarker
          :coordinates="new LngLat(location.long, location.lat)"
          :draggable="false"
        >
          <template #marker>
            <div
              class="hover:tooltip tooltip-top tooltip-open hover:cursor-pointer"
              data-tip="Drag to your desired location"
            >
              <Icon
                name="tabler:map-pin-filled"
                size="24"
                class="text-primary dark:text-error"
              />
            </div>
          </template>
        </MglMarker>
      </div>

      <div v-else>
        <MglMarker
          v-model:coordinates="newLocationCords"
          :draggable="true"
          @dragend="newLocationCords = {
            lng: newLocationCords.lng,
            lat: newLocationCords.lat,
          }"
        />
      </div>
    </MglMap>
  </div>
</template>
