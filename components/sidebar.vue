<script setup lang="ts">
import type { InfiniteData, UseInfiniteQueryReturnType } from "@tanstack/vue-query";
import type { FetchError } from "ofetch";

import { useQueryClient } from "@tanstack/vue-query";

import type { PaginatedResult } from "~/lib/db/queries/locations-queries";
import type { T_SelectLocation } from "~/lib/db/schema";

const queryClient = useQueryClient();
const mapStore = useMapStore();
const isSidebarOpen = ref(true);
const { setHoveredLocation } = mapStore;

const paginatedQuery
= inject <UseInfiniteQueryReturnType<InfiniteData<PaginatedResult<T_SelectLocation>>, FetchError>>("paginatedLocations");

if (!paginatedQuery) {
  throw new Error("Missing paginatedLocations injection");
}

const { data, isPending, isError, error, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, refetch } = paginatedQuery;
const locations = computed(() => data.value?.pages.flatMap((page: PaginatedResult<T_SelectLocation>) => page.data) || []);
const errorMessage = computed(() => error.value?.statusMessage || error.value?.data?.message);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSideBar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}

const hoverTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
function handleOnMouseEnter(location: T_SelectLocation) {
  hoverTimeout.value = setTimeout(() => {
    setHoveredLocation(location);
  }, 750);
}
function handleOnMouseLeave() {
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }
  hoverTimeout.value = setTimeout(() => {
    setHoveredLocation(undefined);
  }, 500);
}
</script>

<template>
  <aside class="relative isolate bg-base-100 overflow-hidden flex flex-col items-start justify-between gap-2 transition-all duration-300 ease-in-out" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
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
      <div class="flex flex-col items-start gap-4 w-full flex-1 " :class="{ 'items-center': !isSidebarOpen, 'items-start': isSidebarOpen }">
        <SidebarButton
          label="Locations"
          icon="tabler:map"
          to="/dashboard"
          :show-label="isSidebarOpen"
          @mouseenter="() => prefetchLocations(queryClient)"
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

    <div v-if="isPending" class="w-full pl-2 py-1 flex flex-1 flex-col justify-start justify-self-start gap-2 overflow-y-scroll">
      <div
        v-for="n in 7"
        :key="n"
        class="skeleton w-5/6 pr-4 py-2 flex items-center"
      >
        <Icon name="tabler:map-pin" size="24" />
      </div>
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
      class="w-full flex flex-col flex-1 justify-self-start gap-4 overflow-x-hidden overflow-y-auto py-1"
    >
      <div
        v-show="hasPreviousPage"
        class="tooltip tooltip-right w-full relative z-50"
        data-tip="fetch previous locations"
      >
        <button
          class="btn btn-sm btn-soft btn-circle absolute right-2 -top-1"
          @click="() => fetchPreviousPage()"
        >
          <span
            v-if="isFetchingPreviousPage"
            class="loading loading-spinner loading-sm absolute  text-info"
          />
          <Icon
            v-else
            name="tabler:arrow-back-up-double"
            size="24"
          />
          <span class="sr-only">fetch previous locations</span>
        </button>
      </div>
      <div class="w-full flex flex-col flex-1 justify-self-start">
        <ul class="w-full flex flex-col pr-4 relative">
          <SidebarButton
            v-for="location in locations"
            :key="location.id"
            :label="location.name"
            icon="tabler:map-pin"
            :to="`/dashboard/location/${location.slug}`"
            :show-label="isSidebarOpen"
            @mouseenter="() => prefetchLocation({ slug: location.slug, queryClient })"
            @mouseover="() => handleOnMouseEnter(location)"
            @mouseout="handleOnMouseLeave"
          />
        </ul>
      </div>
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
