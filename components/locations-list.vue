<script setup lang="ts">
import type { T_SelectLocation } from "~/lib/db/schema";

const props = defineProps<{
  locations: T_SelectLocation[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
}>();

const rootRef = ref(null);
const nextRef = ref(null);
const prevRef = ref(null);

// Use infinite scroll composable
useInfiniteScroll(
  nextRef,
  prevRef,
  rootRef,
  {
    hasNextPage: toRef(props, "hasNextPage"),
    hasPreviousPage: toRef(props, "hasPreviousPage"),
    fetchNextPage: () => props.fetchNextPage(),
    fetchPreviousPage: () => props.fetchPreviousPage(),
    rootMargin: "50px",
    threshold: 0.5,
  },
);
</script>

<template>
  <div
    ref="rootRef"
    class="overflow-x-auto whitespace-nowrap flex space-x-4 px-6 relative [scrollbar-width:thin] mask-x-from-90% mask-x-to-95%"
  >
    <div class="inline-block relative w-6">
      <div ref="prevRef" class="absolute left-0 top-0 bottom-0 w-1" />
      <span
        v-if="isFetchingPreviousPage"
        class="loading loading-spinner loading-md absolute -left-4 top-1/2 -translate-y-1/2 text-info"
      />
    </div>
    <ul class="max-h-fit flex flex-row flex-nowrap items-center justify-evenly py-2 px-4 gap-4">
      <li
        v-for="location in locations"
        :key="location.id"
        class="w-[16rem] border-2 rounded-md"
      >
        <LocationCard :location="location" />
      </li>
    </ul>
    <div class="inline-block relative w-6">
      <div ref="nextRef" class="absolute right-0 top-0 bottom-0 w-1" />
      <span
        v-if="isFetchingNextPage"
        class="loading loading-spinner loading-sm absolute -right-4 top-1/2 -translate-y-1/2 text-info"
      />
    </div>
  </div>
</template>
