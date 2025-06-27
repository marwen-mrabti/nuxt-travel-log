<script setup lang="ts">
import { useInfiniteLocations } from "~/composables/location";

useHead({
  title: "Locations",
});

const { data, isPending, isError, error, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteLocations();

const locations = computed(() => data.value?.pages.flatMap(page => page.data) || []);
const errorMessage = computed(() => error.value?.statusMessage || error.value?.data?.message);
</script>

<template>
  <div class="page-content-top relative isolate container mx-auto px-4 py-4 flex flex-col gap-4">
    <h2 class="w-full py-2 text-2xl font-bold  sticky top-4 z-100 backdrop-blur-sm">
      Saved Locations
    </h2>

    <LocationsLoadingSkeleton v-if="isPending " />

    <div v-else-if="isError || errorMessage" class="text-center">
      <p class="text-error-content bg-error px-2 py-1 text-pretty">
        failed to fetch the locations: {{ errorMessage }}
      </p>
      <button class="btn btn-sm btn-info btn-outline mt-2" @click="() => refetch()">
        Try Again
      </button>
    </div>

    <div v-else-if="locations?.length" class="w-full">
      <LocationsList
        :locations="locations"
        :has-next-page="hasNextPage"
        :has-previous-page="hasPreviousPage"
        :fetch-next-page="fetchNextPage"
        :fetch-previous-page="fetchPreviousPage"
        :is-fetching-next-page="isFetchingNextPage"
        :is-fetching-previous-page="isFetchingPreviousPage"
      />
    </div>

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
