<script lang="ts" setup>
useSeoMeta({
  title: "Travel log",
  ogTitle: "Travel log",
  description: "Pin your travel logs on the map. Save your favorite locations and share your journey with others.",
  ogDescription: "Pin your travel logs on the map. Save your favorite locations and share your journey with others.",
});

useHead({
  title: "Travel log",
  meta: [
    { name: "description", content: "Pin your travel logs on the map. Save your favorite locations and share your journey with others." },
  ],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
button,
a {
  cursor: pointer;
}
</style>
