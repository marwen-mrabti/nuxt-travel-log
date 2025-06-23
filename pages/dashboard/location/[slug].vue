<script setup lang='ts'>
const route = useRoute();

useHead({
  title: computed(() => `location: ${route.params.slug}`),
});

const locationStore = useLocationStore();
const { location, locationError: error, locationStatus: status } = storeToRefs(locationStore);
const loading = computed(() => status.value === "pending");
const errorMessage = computed(() => error.value?.statusMessage);

onMounted(() => {
  locationStore.refreshLocation();
});
</script>

<template>
  <div>
    <h1>location details</h1>
    <div v-if="loading" class="flex flex-col items-center gap-2 w-full">
      <p>Loading location details...</p>
      <span class="loading loading-dots loading-xl" />
    </div>
    <div v-else-if="errorMessage" class="text-red-500">
      {{ errorMessage }}
    </div>
    <div v-else-if="location" class="mb-4">
      <h2 class="text-2xl">
        {{ location.name }}
      </h2>
      <p>{{ location.description }}</p>
      <p>Coordinates: {{ location.lat }}, {{ location.long }}</p>
      <p>Created at: {{ new Date(location.createdAt).toLocaleDateString() }}</p>
      <p>Updated at: {{ new Date(location.updatedAt).toLocaleDateString() }}</p>
    </div>
  </div>
</template>
