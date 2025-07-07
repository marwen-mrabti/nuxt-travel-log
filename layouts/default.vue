<script lang="ts" setup>
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { Analytics } from "@vercel/analytics/nuxt";

const authStore = useAuthStore();
await authStore.init();

// eslint-disable-next-line node/no-process-env
const isProd = process.env.NODE_ENV === "production";
</script>

<template>
  <div class="relative bg-base-200 flex flex-col w-full overflow-x-hidden overflow-y-hidden max-w-screen h-screen">
    <AppNavBar />
    <main class="flex flex-col flex-1 overflow-hidden">
      <slot />
      <Analytics v-if="isProd" />
      <VueQueryDevtools :initial-is-open="false" />
    </main>
  </div>
</template>

<style>
html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
