<script lang="ts" setup>
import { useQueryClient } from "@tanstack/vue-query";

import heroImg from "~/assets/images/hero-img.webp";
import { useAuthStore } from "~/stores/auth-store";

const authStore = useAuthStore();
const queryClient = useQueryClient();
function handleOnMouseEnter() {
  prefetchLocations(queryClient);
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
        <button
          v-else
          class="btn btn-primary"
          @click="navigateTo('/dashboard')"
          @mouseover="handleOnMouseEnter"
        >
          Start Logging
        </button>
      </div>
    </div>
  </div>
</template>
