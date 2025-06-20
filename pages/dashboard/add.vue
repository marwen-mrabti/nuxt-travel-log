<script setup>
definePageMeta({
  title: "add location",
});
</script>

<template>
  <main class="container max-w-md mx-auto p-4 space-y-4">
    <div class="my-4 space-y-2">
      <h1 class="text-2xl font-bold">
        Add Location
      </h1>
      <p class="text-pretty text-sm">
        A location is a place that you traveled or will travel to. it can be a city, a country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <LocationForm />
  </main>
</template>
