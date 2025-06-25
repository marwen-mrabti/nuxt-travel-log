<script setup lang="ts">
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
</script>

<template>
  <div class="grid grid-cols-[auto_1fr] grid-rows-1 gap-2 relative w-full h-full overflow-hidden">
    <Sidebar class="flex flex-col h-full" />

    <main class="px-4 overflow-y-auto">
      <NuxtPage />
    </main>
    <VueQueryDevtools :initial-is-open="false" />
  </div>
</template>
