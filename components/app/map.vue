<script setup lang="ts">
const route = useRoute();
const mapStore = useMapStore();

const mglMapRef = ref(null);
function onMapLoad(event: any) {
  if (event.map) {
    mapStore.setMapInstance(event.map);
  }
}
const { activeLocations, activeLocation, mapStyle, hoveredLocation, newLocationCoords, dataIsLoading } = storeToRefs(mapStore);

function handleOnDoubleClick(mglEvent: any) {
  mapStore.handleOnDoubleClick(mglEvent);
}

function handleMapError(error: Error) {
  console.error("Map error:", error);
  throw createError({ statusCode: 500, statusMessage: error?.message });
}
</script>

<template>
  <div class="relative w-full h-full  flex justify-center  overflow-hidden">
    <AppMapFallback v-if="dataIsLoading" />
    <MglMap
      v-else
      ref="mglMapRef"
      :map-style="mapStyle"
      @map:load="onMapLoad"
      @map:dblclick="handleOnDoubleClick"
      @map:error="handleMapError"
    >
      <MglFullscreenControl />
      <MglNavigationControl />
      <MglGeolocateControl />

      <!-- Multiple locations markers -->
      <div v-if="activeLocations?.length && route.name === 'dashboard'">
        <MglMarker
          v-for="loc in activeLocations"
          :key="loc.id"
          :coordinates="[loc.long, loc.lat]"
        >
          <template #marker>
            <div
              class="hover:tooltip tooltip-top tooltip-open hover:cursor-pointer"
              :data-tip="loc.name"
            >
              <AppPrefetchLink
                :to="{ name: 'dashboard-location-slug', params: { slug: loc.slug } }"
                :slug="loc.slug"
              >
                <Icon
                  name="tabler:map-pin-filled"
                  :size="loc.slug === hoveredLocation?.slug ? 30 : 24"
                  class="text-error hover:text-red-600 transition-all duration-200 ease-linear"
                  :class="{ '!text-red-700': loc.slug === hoveredLocation?.slug }"
                />
              </AppPrefetchLink>
            </div>
          </template>
        </MglMarker>
      </div>

      <!-- Single location marker -->
      <div v-else-if="activeLocation && route.name === 'dashboard-location-slug'">
        <MglMarker
          :coordinates="[activeLocation.long, activeLocation.lat]"
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
                class="text-primary dark:text-red-600"
              />
            </div>
          </template>
        </MglMarker>
      </div>

      <!-- New location marker (draggable) -->
      <div v-else>
        <MglMarker
          v-model:coordinates="newLocationCoords"
          :draggable="true"
          @dragend="newLocationCoords = {
            lng: newLocationCoords.lng,
            lat: newLocationCoords.lat,
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
