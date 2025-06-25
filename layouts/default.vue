<script lang="ts" setup>
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";

const authStore = useAuthStore();
await authStore.init();
</script>

<template>
  <div class="relative bg-base-200 flex flex-col w-full overflow-x-hidden overflow-y-hidden max-w-screen h-screen">
    <AppNavBar />
    <main class="flex flex-col flex-1 overflow-hidden">
      <slot />
    </main>
    <VueQueryDevtools :initial-is-open="false" />
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
