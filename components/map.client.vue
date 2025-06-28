<script setup lang="ts">
import { LngLat } from "maplibre-gl";

import type { T_SelectLocation } from "~/lib/db/schema";

const props = defineProps<{
  location: T_SelectLocation | undefined;
}>();

const colorMode = useColorMode();
const newCoordinates = ref(new LngLat(13.409542978931427, 52.52016381695441));
const mapStyle = computed(() => colorMode.value === "dark" ? "https://tiles.openfreemap.org/styles/liberty" : "https://tiles.openfreemap.org/styles/bright");
const lng = computed(() => props.location?.long);
const lat = computed(() => props.location?.lat);
const coordinates = computed(() => new LngLat(lng.value ?? 13.409542978931427, lat.value ?? 52.52016381695441));
const center = computed(() => coordinates.value);
const zoom = ref(7);
</script>

<template>
  <div class="relative w-full mt-2 min-h-[50dvh] h-[60dvh] flex justify-center border-2 border-base-100 rounded-md overflow-hidden">
    <MglMap
      :center="center"
      :zoom="zoom"
      :map-style="mapStyle"
    >
      <MglFullscreenControl />
      <MglNavigationControl />
      <MglGeolocateControl />
      <mgl-marker
        v-model:coordinates="newCoordinates"
        :draggable="true"
        class-name="z-50"
        @dragstart="console.log('dragstart', newCoordinates)"
        @drag="console.log('drag')"
        @dragend="console.log('dragend', newCoordinates)"
      />
      <MglMarker
        v-if="coordinates"
        class-name="z-50"
        :coordinates="coordinates"
      >
        <template #marker>
          <div
            class="hover:tooltip tooltip-top tooltip-open hover:cursor-pointer"
            data-tip="Drag to your desired location"
          >
            <Icon
              name="tabler:map-pin-filled"
              size="35"
              class="text-primary dark:text-error"
            />
          </div>
        </template>
      </MglMarker>
    </MglMap>
  </div>
</template>
