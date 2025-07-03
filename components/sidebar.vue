<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";

import { useInfiniteLocations } from "~/composables/location";

const queryClient = useQueryClient();
const isSidebarOpen = ref(true);

const { data, isPending, isError, error, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteLocations();

const locations = computed(() =>
  data.value?.pages?.flatMap(page => page.data) || [],
);
const errorMessage = computed(() => error.value?.statusMessage || error.value?.data?.message);

const rootRef = ref(null);
const nextRef = ref(null);
const prevRef = ref(null);

function setupObserver(target: Ref<HTMLElement | null>, callback: () => void) {
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (import.meta.client && target.value) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0] && entries[0].isIntersecting)
            callback();
        },
        { root: null, threshold: 1.0, rootMargin: "100px" },
      );
      observer.observe(target.value);
    }
  });

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  });
}

setupObserver(nextRef, () => {
  if (hasNextPage)
    fetchNextPage();
});
setupObserver(prevRef, () => {
  if (hasPreviousPage)
    fetchPreviousPage();
});

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSideBar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}

function prefetchOnMouseEnter({ href, slug }: { href?: string; slug?: string }) {
  if (slug) {
    return queryClient.ensureQueryData({
      queryKey: ["location", slug],
      queryFn: () => fetcher(`/api/locations/${slug}`),
    });
  }
  else if (href === "dashboard") {
    queryClient.ensureInfiniteQueryData({
      queryKey: ["locations-paginated"],
      queryFn: ({ pageParam = 1 }) =>
        fetcher("/api/locations", { query: { page: pageParam, limit: 10 } }),
      initialPageParam: 1,
    });
  }
}

const mapStore = useMapStore();
const { setHoveredLocation } = mapStore;
const { activeLocations } = storeToRefs(mapStore);
watch(() => locations.value, (newLocations) => {
  if (newLocations) {
    activeLocations.value = newLocations;
  }
}, { immediate: false, deep: true });
</script>

<template>
  <aside class="relative bg-base-100 overflow-hidden flex flex-col items-start justify-between gap-2 transition-all duration-300 ease-in-out" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
    <div class="flex flex-col w-full sticky top-0">
      <button
        class="flex w-full hover:cursor-pointer hover:bg-base-200 p-2 "
        :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }"
        @click="toggleSideBar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:chevron-left"
          size="32"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="32"
        />
      </button>
      <div class="flex flex-col items-start gap-4 w-full flex-1" :class="{ 'items-center': !isSidebarOpen, 'items-start': isSidebarOpen }">
        <SidebarButton
          label="Locations"
          icon="tabler:map"
          to="/dashboard"
          :show-label="isSidebarOpen"
          @mouseenter="prefetchOnMouseEnter({ href: 'dashboard' })"
        />

        <SidebarButton
          label="Add Location"
          icon="tabler:circle-plus-filled"
          to="/dashboard/add"
          :show-label="isSidebarOpen"
        />
      </div>
      <div v-show="isPending || locations?.length" class="divider mx-1 -my-1" />
    </div>

    <div v-if="isPending" class="w-full pl-2 py-1 flex flex-1 flex-col justify-start justify-self-start gap-2">
      <div class="skeleton w-2/3 h-6" />
      <div class="skeleton w-2/3 h-6" />
      <div class="skeleton w-2/3 h-6" />
    </div>

    <div v-else-if="isError" class="w-full px-2 py-1 flex flex-1 flex-col justify-start justify-self-start gap-2">
      <p class="text-sm text-error-content bg-error px-2 py-1 text-pretty">
        {{ errorMessage || "failed to fetch the locations." }}
      </p>
      <button class="btn btn-sm btn-info btn-outline mt-2" @click="() => refetch()">
        Try Again
      </button>
    </div>

    <div
      v-else-if="locations?.length"
      ref="rootRef"
      class="w-full flex flex-col flex-1 justify-self-start overflow-x-hidden overflow-y-auto py-1"
    >
      <ul class="w-full flex flex-col">
        <div class="relative w-full">
          <div ref="prevRef" class=" h-2 w-full" />
          <span
            v-if="isFetchingPreviousPage"
            class="loading loading-spinner loading-sm absolute  text-info"
          />
        </div>
        <SidebarButton
          v-for="location in locations"
          :key="location.id"
          :label="location.name"
          icon="tabler:map-pin"
          :to="`/dashboard/location/${location.slug}`"
          :show-label="isSidebarOpen"
          @mouseenter="prefetchOnMouseEnter({ slug: location.slug })"
          @mouseover="() => setHoveredLocation(location)"
          @mouseout="() => setHoveredLocation(undefined)"
        />
        <div class="relative w-full">
          <div ref="nextRef" class=" h-2 w-full" />
          <span
            v-if="isFetchingNextPage"
            class="loading loading-spinner loading-sm absolute  text-info"
          />
        </div>
      </ul>
    </div>

    <div class="flex flex-col w-full sticky bottom-2">
      <div class="divider mx-1 -my-1" />
      <SidebarButton
        label="Sign Out"
        icon="tabler:logout-2"
        to="/sign-out"
        :show-label="isSidebarOpen"
      />
    </div>
  </aside>
</template>
