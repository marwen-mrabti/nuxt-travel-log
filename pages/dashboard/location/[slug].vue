<script setup lang='ts'>
import { useLocation } from "~/composables/location";

const route = useRoute();

const slug = computed(() => route.params.slug);
useHead({
  title: computed(() => `location: ${slug.value}`),
});

const { data: location, isPending, isError, error, refetch } = useLocation(slug.value as string);
const errorMessage = computed(() => error.value?.statusMessage || error.value?.data?.message);
</script>

<template>
  <div>
    <h2 class="w-full py-2 text-2xl font-bold">
      location details
    </h2>
    <div v-if="isPending" class="flex flex-col items-center gap-2 w-full">
      <p>Loading location details...</p>
      <LocationLoadingSkeleton />
    </div>
    <div v-else-if="isError" class="w-full px-2 py-1 flex flex-1 flex-col justify-start justify-self-start gap-2">
      <p class="text-sm text-error-content bg-error px-2 py-1 text-pretty">
        failed to fetch the location: {{ errorMessage }}
      </p>
      <button class="btn btn-sm btn-info btn-outline mt-2" @click="() => refetch()">
        Try Again
      </button>
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
    <ClientOnly fallback-tag="div">
      <Map :location="location" />
      <template #fallback>
        <MapClientFallback />
      </template>
    </ClientOnly>
  </div>
</template>
