<script setup lang="ts">
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";

import { LngLat } from "maplibre-gl";

const mapStore = useMapStore();
const { mapStyle, activeLocation, hoveredLocation, activeLocations, newLocationCords } = storeToRefs(mapStore);

function handleOnDoubleClick(mglEvent: MglEvent<"dblclick">) {
  mapStore.handleOnDoubleClick(mglEvent);
}

function handleMapError(error: Error) {
  console.error("Map error:", error);
  throw createError({ statusCode: 500, statusMessage: error?.message });
}
</script>

<template>
  <div class="relative w-full mt-2 min-h-[50dvh] h-[60dvh] flex justify-center border-1 border-base-100 rounded-md overflow-hidden">
    <MglMap
      :map-style="mapStyle"
      @map:dblclick="handleOnDoubleClick"
      @map:error="handleMapError"
    >
      <MglFullscreenControl />
      <MglNavigationControl />
      <MglGeolocateControl />

      <div v-if="activeLocations?.length">
        <MglMarker
          v-for="loc in activeLocations"
          :key="loc.id"
          :coordinates="new LngLat(loc.long, loc.lat)"
        >
          <template #marker>
            <div
              class="hover:tooltip tooltip-top tooltip-open hover:cursor-pointer "
              :data-tip="loc.name"
            >
              <AppPrefetchLink
                :to="{ name: 'dashboard-location-slug', params: { slug: loc.slug } }"
                :query-key="['location', loc.slug]"
                :query-fn="() => fetcher(`/api/locations/${loc.slug}`)"
              >
                <Icon
                  name="tabler:map-pin-filled"
                  size="24"
                  class="text-primary dark:text-error hover:text-success"
                  :class="{ 'text-indigo-800': loc.slug === hoveredLocation?.slug }"
                />
              </AppPrefetchLink>
            </div>
          </template>
        </MglMarker>
      </div>

      <div v-else-if="activeLocation">
        <MglMarker
          :coordinates="new LngLat(activeLocation.long, activeLocation.lat)"
          :draggable="false"
        >
          <template #marker>
            <div
              class="hover:tooltip tooltip-top tooltip-open hover:cursor-pointer"
              :data-tip="activeLocation.name"
            >
              <Icon
                name="tabler:map-pin-filled"
                size="30"
                class="text-primary dark:text-info"
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
        >
          <template #marker>
            <div
              class="hover:tooltip tooltip-top tooltip-open hover:cursor-pointer"
              data-tip="drag the marker to set the location coordinates"
            >
              <Icon
                name="tabler:map-pin-filled"
                size="35"
                class="text-primary dark:text-warning"
              />
            </div>
          </template>
        </MglMarker>
      </div>
    </MglMap>
  </div>
</template>
