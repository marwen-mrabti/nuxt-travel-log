<script setup lang="ts">
import { EDIT_PAGES } from "~/lib/constants";

const route = useRoute();
const query = useInfiniteLocations();
provide("paginatedLocations", query);
</script>

<template>
  <div class="grid grid-cols-[auto_1fr] grid-rows-1 gap-0 relative w-full h-full overflow-hidden">
    <Sidebar class="flex flex-col h-full flex-1" />
    <main
      class="size-full overflow-x-hidden overflow-y-auto flex flex-col"
      :class="{
        '!flex-row': EDIT_PAGES.has(String(route.name)),
      }"
    >
      <div
        class="w-full"
        :class="{
          '!w-85 px-2 py-2 shrink-0': EDIT_PAGES.has(String(route.name)),
        }"
      >
        <NuxtPage />
      </div>
      <div class="h-full w-full flex-1">
        <AppMapErrorBoundary>
          <ClientOnly fallback-tag="div">
            <template #fallback>
              <AppMapFallback />
            </template>
            <AppMap />
          </ClientOnly>
        </AppMapErrorBoundary>
      </div>
    </main>
  </div>
</template>
