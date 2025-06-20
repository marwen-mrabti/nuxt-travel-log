<script lang="ts" setup>
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
  <div class="relative flex flex-col w-full overflow-x-hidden overflow-y-hidden max-w-screen h-screen">
    <AppNavBar />
    <main class="flex-1 flex flex-col overflow-hidden">
      <slot />
    </main>
  </div>
</template>
