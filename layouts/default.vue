<script lang="ts" setup>

</script>

<template>
  <div class="relative flex w-full max-w-screen min-h-screen flex-col">
    <AppNavBar />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>

<style scoped>

</style>
