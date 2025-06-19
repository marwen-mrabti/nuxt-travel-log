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
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
