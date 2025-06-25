<script setup lang='ts'>
import { useLocation } from "~/composables/location";

const route = useRoute();

const slug = computed(() => route.params.slug);
useHead({
  title: computed(() => `location: ${slug.value}`),
});

const { data: location, error, isPending } = useLocation(slug.value as string);
const errorMessage = computed(() => error.value?.statusMessage);
</script>

<template>
  <div>
    <h1>location details</h1>
    <div v-if="isPending" class="flex flex-col items-center gap-2 w-full">
      <p>Loading location details...</p>
      <LocationLoadingSkeleton />
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
      <p>
        Created at
        <NuxtTime
          :datetime="location.createdAt"
          year="numeric"
          month="long"
          day="numeric"
        />
      </p>
      <p>
        Updated
        <NuxtTime
          :datetime="location.updatedAt"
          year="numeric"
          month="long"
          day="numeric"
          relative
        />
      </p>
    </div>
  </div>
</template>
