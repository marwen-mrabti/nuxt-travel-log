<template>
  <div
    class="overflow-x-auto whitespace-nowrap flex space-x-4 p-2 relative [scrollbar-width:thin] mask-x-from-90% mask-x-to-95%"
  >
    <ul class="flex flex-row flex-nowrap items-center justify-evenly py-2 px-4 gap-4">
      <li
        v-for="n in 6"
        :key="n"
        class="w-[16rem]"
      >
        <div class="card bg-base-100/80 text-base-content w-full h-35 shadow-xl">
          <div class="card-body">
            <!-- Title skeleton -->
            <div class="card-title">
              <div class="h-6 skeleton w-3/4" />
            </div>

            <!-- Description skeleton - multiple lines -->
            <div class="space-y-2">
              <div class="h-3 skeleton w-full" />
              <div class="h-3 skeleton w-5/6" />
              <div class="h-3 skeleton w-4/6" />
              <div class="h-3 skeleton w-3/6" />
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
