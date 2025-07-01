<script setup lang="ts">
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";

import { LngLat } from "maplibre-gl";

const mapStore = useMapStore();
const { mapStyle, activeLocation, activeLocations, newLocationCords } = storeToRefs(mapStore);

function handleOnDoubleClick(mglEvent: MglEvent<"dblclick">) {
  mapStore.handleOnDoubleClick(mglEvent);
}

// Optional: Handle map-specific errors
function handleMapError(error: any) {
  console.error("Map error:", error);
  throw new Error(`Map failed to load: ${error.message || "Unknown error"}`);
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

      <div v-else-if="activeLocation">
        <MglMarker
          :coordinates="new LngLat(activeLocation.long, activeLocation.lat)"
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
