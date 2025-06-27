<script setup lang="ts">
import { onMounted, ref } from "vue";

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
  if (props.hasNextPage)
    props.fetchNextPage();
});
setupObserver(prevRef, () => {
  if (props.hasPreviousPage)
    props.fetchPreviousPage();
});
</script>

<template>
  <div
    ref="rootRef"
    class="overflow-x-auto whitespace-nowrap flex space-x-4 p-2 relative [scrollbar-width:thin] mask-x-from-90% mask-x-to-95%"
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
        class="w-[16rem]"
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
