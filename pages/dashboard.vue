<template>
  <div class="grid grid-cols-[auto_1fr] grid-rows-1 gap-2 relative w-full h-full overflow-hidden">
    <Sidebar class="flex flex-col h-full flex-1" />

    <main class="px-4 pb-4 overflow-x-hidden overflow-y-auto">
      <NuxtPage />
      <AppMapErrorBoundary>
        <ClientOnly fallback-tag="div">
          <template #fallback>
            <AppMapFallback />
          </template>
          <AppMap />
        </ClientOnly>
      </AppMapErrorBoundary>
    </main>
  </div>
</template>
