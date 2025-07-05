<template>
  <div class="mb-2 w-full flex flex-col items-start justify-evenly gap-2">
    <div class="flex flex-row items-center justify-start gap-4 w-full">
      <!-- Title skeleton -->
      <div class="skeleton h-8 w-32" />
    </div>

    <!-- Description skeleton -->
    <div class="ml-2 space-y-2 w-full">
      <div class="skeleton h-4 w-full" />
      <div class="skeleton h-4 w-3/4" />
    </div>

    <!-- Coordinates skeleton -->
    <div class="ml-2">
      <div class="skeleton h-4 w-48" />
    </div>

    <!-- Created at skeleton -->
    <div class="ml-2">
      <div class="skeleton h-4 w-54" />
    </div>

    <!-- Updated skeleton -->
    <div class="ml-2">
      <div class="skeleton h-4 w-44" />
    </div>
  </div>
</template>
