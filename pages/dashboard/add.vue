<script setup lang="ts">
useHead({
  title: "Add Location",
});
</script>

<template>
  <main class="container w-full mx-auto p-4 space-y-2">
    <div class="my-4 space-y-2 max-w-md mx-auto w-full flex flex-col items-center justify-center gap-4">
      <h1 class="text-2xl font-bold">
        Add Location
      </h1>
      <p class="text-pretty text-sm">
        A location is a place that you traveled or will travel to. it can be a city, a country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <LocationForm />

    <ClientOnly fallback-tag="div">
      <Map />
      <template #fallback>
        <MapClientFallback />
      </template>
    </ClientOnly>
  </main>
</template>
