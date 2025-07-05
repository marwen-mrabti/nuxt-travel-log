<template>
  <div class="relative w-full  h-full  flex justify-center  overflow-hidden">
    <!-- Main skeleton background with subtle pattern -->
    <div class="absolute inset-0 bg-gradient-to-br from-base-200 via-base-100 to-base-200 animate-pulse">
      <!-- Grid pattern to simulate map tiles -->
      <div class="absolute inset-0 opacity-20">
        <div class="grid grid-cols-8 grid-rows-6 h-full w-full">
          <div
            v-for="i in 48"
            :key="i"
            class="border border-base-300/30"
          />
        </div>
      </div>
    </div>

    <!-- Map controls skeleton -->
    <div class="absolute top-4 right-4 z-10 space-y-2">
      <!-- Fullscreen control -->
      <div class="skeleton w-8 h-8 bg-base-300" />
      <!-- Navigation control -->
      <div class="skeleton w-8 h-16 bg-base-300" />
      <!-- Geolocate control -->
      <div class="skeleton w-8 h-8 bg-base-300" />
    </div>

    <!-- Center loading indicator -->
    <div class="absolute inset-0 flex items-center justify-center z-20">
      <div class="flex flex-col items-center space-y-4">
        <!-- Map icon skeleton -->
        <div class="relative">
          <div class="skeleton w-16 h-16 rounded-full bg-base-300" />
          <div class="absolute inset-0 flex items-center justify-center">
            <Icon
              name="tabler:map-2"
              size="32"
              class="text-base-content/30"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Map marker skeletons at various positions -->
    <div class="absolute top-1/3 left-1/4 z-10">
      <Icon
        name="tabler:map-pin-filled"
        size="32"
        class="text-primary/30 skeleton"
      />
    </div>

    <div class="absolute top-2/3 right-1/3 z-10">
      <Icon
        name="tabler:map-pin-filled"
        size="32"
        class="text-secondary/30 skeleton"
      />
    </div>

    <div class="absolute bottom-1/4 left-2/3 z-10">
      <Icon
        name="tabler:map-pin-filled"
        size="32"
        class="text-accent/30 skeleton"
      />
    </div>

    <!-- Optional: Pulsing circles to simulate loading -->
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
      <div class="relative">
        <div class="w-32 h-32 border-2 border-primary/20 rounded-full animate-ping" />
        <div class="absolute inset-4 border-2 border-primary/30 rounded-full animate-ping delay-300" />
        <div class="absolute inset-8 border-2 border-primary/40 rounded-full animate-ping animation-delay-500" />
      </div>
    </div>

    <!-- Attribution area skeleton -->
    <div class="absolute bottom-2 right-2 z-10">
      <div class="skeleton h-4 w-20 bg-base-300/50" />
    </div>
  </div>
</template>
