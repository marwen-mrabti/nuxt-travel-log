<script lang="ts" setup>
import { useQueryClient } from "@tanstack/vue-query";

import heroImg from "~/assets/images/hero-img.webp";
import { fetcher } from "~/composables/location";
import { useAuthStore } from "~/stores/auth-store";

const authStore = useAuthStore();
const queryClient = useQueryClient();

function handleOnMouseEnter() {
  queryClient.prefetchInfiniteQuery({
    queryKey: ["locations", "paginated"],
    queryFn: ({ pageParam = 1 }) =>
      fetcher("/api/locations", { query: { page: pageParam, limit: 12 } }),
    initialPageParam: 1,
  });
  queryClient.prefetchQuery({
    queryKey: ["locations", "all"],
    queryFn: () => fetcher("/api/locations"),
  });
}
</script>

<template>
  <div class="hero relative bg-base-300 h-full container mx-auto my-2">
    <div
      class="absolute flex-1 inset-0 bg-cover bg-center bg-no-repeat"
      :style="`background-image: url(${heroImg})`"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-blue-800/80 via-green-700/80 to-indigo-900/80" />
    </div>
    <div class="hero-content flex flex-col items-center justify-start text-center min-h-96">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">
          Travel Log
        </h1>
        <p class="py-6">
          Keep track of your travels and adventures with this simple travel log app. Add locations, photos, and notes to create a digital journal of your journeys.
        </p>
        <AuthButton v-if="!authStore.user" />
        <NuxtLink
          v-else
          to="/dashboard"
          class="btn btn-primary"
          @mouseenter="handleOnMouseEnter"
        >
          Start Logging
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
