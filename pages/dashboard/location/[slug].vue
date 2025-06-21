<script setup lang='ts'>
const route = useRoute();

useHead({
  title: computed(() => `location: ${route.params.slug}`),
});
</script>

<template>
  <div>
    <h1>location details</h1>
  </div>
</template>
