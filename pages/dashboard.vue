<template>
  <div class="grid grid-cols-[auto_1fr] grid-rows-1 gap-2 relative w-full h-full overflow-hidden">
    <Sidebar class="flex flex-col h-full shrink-0 flex-1" />

    <main class="px-4 pb-4 overflow-x-hidden overflow-y-auto">
      <NuxtPage />
      <ClientOnly fallback-tag="div">
        <template #fallback>
          <AppMapFallback />
        </template>

        <AppMapErrorBoundary>
          <AppMap />
        </AppMapErrorBoundary>
      </ClientOnly>
    </main>
  </div>
</template>
