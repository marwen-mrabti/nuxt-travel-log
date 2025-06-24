<template>
  <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <li v-for="n in 8" :key="n">
      <div class="card bg-base-100 text-base-content w-full shadow-xl">
        <div class="card-body">
          <!-- Title skeleton -->
          <div class="card-title">
            <div class="h-6 skeleton w-3/4" />
          </div>

          <!-- Description skeleton - multiple lines -->
          <div class="space-y-2">
            <div class="h-3 skeleton w-full" />
            <div class="h-3 skeleton w-5/6" />
            <div class="h-3 skeleton w-2/3" />
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>
