<script setup lang="ts">
import { useInfiniteLocations } from "~/composables/location";

useHead({
  title: "Locations",
});
const bottomScrollTrigger = ref<HTMLElement | null>(null);
const topScrollTrigger = ref<HTMLElement | null>(null);

const { data, isPending, isError, error, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteLocations();

const locations = computed(() => data.value?.pages.flatMap(page => page.data) || []);
const errorMessage = computed(() => error.value?.statusMessage || error.value?.data?.message);

function handleFetchPreviousPage(entries: IntersectionObserverEntry[]) {
  const [entry] = entries;
  if (entry && entry.isIntersecting && hasPreviousPage.value && !isFetchingPreviousPage.value) {
    fetchPreviousPage();
  }
}
function handleFetchNextPage(entries: IntersectionObserverEntry[]) {
  const [entry] = entries;
  if (entry && entry.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
    fetchNextPage();
  }
}

let topObserver: IntersectionObserver | null = null;
let bottomObserver: IntersectionObserver | null = null;
watchEffect(() => {
  // Bottom observer — trigger next page fetch
  if (bottomScrollTrigger.value) {
    bottomObserver = new IntersectionObserver(
      handleFetchNextPage,
      {
        root: null,
        rootMargin: "250px",
        threshold: 0.1,
      },
    );
    bottomObserver.observe(bottomScrollTrigger.value);
  }

  // Top observer — trigger previous page fetch
  if (topScrollTrigger.value) {
    topObserver = new IntersectionObserver(
      handleFetchPreviousPage,
      {
        root: null,
        rootMargin: "250px",
        threshold: 0.1,
      },
    );
    topObserver.observe(topScrollTrigger.value);
  }
});

onUnmounted(() => {
  if (topObserver)
    topObserver.disconnect();
  if (bottomObserver)
    bottomObserver.disconnect();
});
</script>

<template>
  <div class="page-content-top relative isolate container mx-auto px-4 py-4 flex flex-col gap-4">
    <h2 class="w-full py-2 text-2xl font-bold sticky top-4 z-100 backdrop-blur-sm">
      Locations
    </h2>
    <div ref="topScrollTrigger" class="scroll-trigger" />
    <div v-show="isFetchingPreviousPage" class="w-full flex justify-center items-center py-2">
      <span>Loading earlier locations</span>
      <span class="loading loading-dots loading-sm ml-2" />
    </div>
    <LocationsLoadingSkeleton v-if="isPending " />

    <div v-else-if="isError || errorMessage" class="text-center">
      <p class="text-red-500">
        failed to fetch the locations: {{ errorMessage }}
      </p>
      <button class="btn btn-sm btn-outline mt-2" @click="() => refetch()">
        Try Again
      </button>
    </div>

    <ul
      v-else-if="locations && locations.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 py-1"
    >
      <li
        v-for="location in locations"
        :key="location.id"
      >
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
    <div ref="bottomScrollTrigger" class="scroll-trigger" />
    <div v-show="isFetchingNextPage" class="w-full flex justify-center items-center py-2">
      <span>Loading more locations</span>
      <span class="loading loading-dots loading-sm ml-2" />
    </div>
  </div>
</template>

<style scoped>
.scroll-trigger {
  height: 5px;
  visibility: hidden;
}
</style>