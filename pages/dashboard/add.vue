<script setup lang="ts">
useHead({
  title: "Add Location",
});

const mapStore = useMapStore();
const { newLocationCoords: coords } = storeToRefs(mapStore);
function formatNumber(value?: number) {
  if (!value)
    return 0;
  return value.toFixed(5);
}
</script>

<template>
  <main class="container w-full mx-auto px-2 py-2 space-y-2">
    <div class="max-w-md mx-auto w-full flex flex-col items-start justify-around gap-2">
      <h1 class="text-2xl font-bold text-balance">
        Add Location
      </h1>
      <p class="text-pretty text-xs">
        A location is a place that you traveled or will travel to. it can be a city, a country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <LocationForm>
      <div class="flex flex-col items-start justify-around gap-1">
        <p class="text-xs text-gray-400">
          Current coordinates: {{ formatNumber(coords.lat) }}, {{ formatNumber(coords.lng) }}
        </p>
        <p>
          To set the coordinates:
        </p>
        <ul class="list-disc ml-8 text-xs text-secondary-content">
          <li>
            Drag the <Icon name="tabler:map-pin-filled" class="text-primary dark:text-warning" /> marker on the map.
          </li>
          <li>
            Double click the map.
          </li>
          <li>
            Search for a location below.
          </li>
        </ul>
      </div>
    </LocationForm>
  </main>
</template>
