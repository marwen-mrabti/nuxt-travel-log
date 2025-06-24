<script setup lang="ts">
useHead({
  title: "Locations",
});

const { data: locations, error, isPending } = useLocations();
const errorMessage = computed(() => error.value?.statusMessage);
</script>

<template>
  <div class="page-content-top container mx-auto px-4 py-4 flex flex-col gap-4">
    <h2 class="text-2xl">
      Locations
    </h2>
    <LocationsLoadingSkeleton v-if="isPending" />
    <div v-else-if="errorMessage" class="text-center">
      <p class="text-red-500">
        failed to fetch the locations: {{ errorMessage }}
      </p>
    </div>
    <ul
      v-else-if="locations && locations.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <li v-for="location in locations" :key="location.id">
        <LocationCard :location="location" />
      </li>
    </ul>
    <div v-else class="text-center">
      <p>You have not added any location yet.</p>
      <p class="mt-2 text-success text-lg">
        <NuxtLink to="/dashboard/add" class="btn btn-primary">
          Get Started! Add Location
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
