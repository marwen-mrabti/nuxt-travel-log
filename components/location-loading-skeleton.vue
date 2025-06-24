<template>
  <div class="flex justify-center w-full">
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
  </div>
</template>
