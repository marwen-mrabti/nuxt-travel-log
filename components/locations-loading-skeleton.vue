<template>
  <div
    class="overflow-x-auto whitespace-nowrap flex  px-6 relative [scrollbar-width:thin] mask-x-from-90% mask-x-to-95%"
  >
    <ul class="mx-4 flex flex-row flex-nowrap items-center justify-evenly py-2 px-4 gap-4">
      <li
        v-for="n in 10"
        :key="n"
        class="w-[16rem] h-35 border-2 rounded-md"
      >
        <div class="card bg-base-100/80 text-base-content w-full shadow-xl">
          <div class="card-body">
            <!-- Title skeleton -->
            <div class="card-title">
              <div class="h-6 skeleton w-3/4" />
            </div>

            <!-- Description skeleton - multiple lines -->
            <div class="space-y-2">
              <div class="h-3 skeleton w-full" />
              <div class="h-3 skeleton w-[95%]" />
              <div class="h-3 skeleton w-[90%]" />
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
