<script lang="ts" setup>

</script>

<template>
  <div class="grid grid-cols-[auto_1fr] gap-2 w-full flex-1">
    <Sidebar />
    <main class="bg-base-300 py-4 px-4 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<style scoped>

</style>
