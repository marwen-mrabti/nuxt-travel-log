<template>
  <div class="grid grid-cols-[auto_1fr] grid-rows-1 gap-2 relative w-full h-full overflow-hidden">
    <Sidebar class="flex flex-col h-full shrink-0 flex-1" />

    <main class="px-4 pb-4 overflow-x-hidden overflow-y-auto">
      <NuxtPage />
      <ClientOnly fallback-tag="div">
        <template #fallback>
          <AppMapClientFallback />
        </template>

        <NuxtErrorBoundary>
          <AppMap />

          <template #error="{ error, clearError }">
            <div class="mt-2 min-h-[50dvh] h-[60dvh] flex flex-col items-center justify-center bg-base-200 border-1 border-base-100 rounded-md">
              <Icon
                name="tabler:alert-triangle"
                size="48"
                class="text-warning mb-4"
              />
              <h3 class="text-lg font-semibold mb-2">
                Map Component Error
              </h3>
              <p class="text-sm text-base-content/70 mb-4 max-w-md text-center">
                {{ error?.message || 'Something went wrong with the map component.' }}
              </p>
              <div class="flex gap-2">
                <button
                  class="btn btn-primary btn-sm"
                  @click="() => {
                    clearError();
                    navigateTo({ query: { error: undefined } }, { replace: true });
                  }"
                >
                  Reload Map
                </button>
              </div>
            </div>
          </template>
        </NuxtErrorBoundary>
      </ClientOnly>
    </main>
  </div>
</template>
