<script setup lang="ts">
import type { InfiniteData, UseInfiniteQueryReturnType } from "@tanstack/vue-query";
import type { FetchError } from "ofetch";

import type { PaginatedResult } from "~/lib/db/queries/locations-queries";
import type { T_SelectLocation } from "~/lib/db/schema";

useHead({
  title: "Locations",
});

const paginatedQuery
= inject <UseInfiniteQueryReturnType<InfiniteData<PaginatedResult<T_SelectLocation>>, FetchError>>("paginatedLocations");

if (!paginatedQuery) {
  throw new Error("Missing paginatedLocations injection");
}

const { data, isPending, isError, error, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, fetchNextPage, hasNextPage, isFetchingNextPage, refetch }
= paginatedQuery;

const locations = computed(() => data.value?.pages.flatMap((page: PaginatedResult<T_SelectLocation>) => page.data) || []);
const errorMessage = computed(() => error.value?.statusMessage || error.value?.data?.message);

const mapStore = useMapStore();
watch(() => locations.value, (newLocations) => {
  mapStore.setActiveLocations(newLocations);
}, { immediate: true });
</script>

<template>
  <div class="page-content-top relative isolate container mx-auto px-4 py-2 flex flex-col gap-2">
    <h2 class="w-full py-2 text-2xl font-bold  sticky top-2 z-100 backdrop-blur-sm">
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
