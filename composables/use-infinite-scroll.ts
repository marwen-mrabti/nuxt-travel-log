import type { Ref } from "vue";

// composables/useInfiniteScroll.ts
import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";

type UseInfiniteScrollOptions = {
  hasNextPage: Ref<boolean> | boolean;
  hasPreviousPage: Ref<boolean> | boolean;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
  rootMargin?: string;
  threshold?: number;
};

export function useInfiniteScroll(
  nextTrigger: Ref<HTMLElement | null>,
  prevTrigger: Ref<HTMLElement | null>,
  scrollContainer: Ref<HTMLElement | null>,
  options: UseInfiniteScrollOptions,
) {
  let nextObserver: IntersectionObserver | null = null;
  let prevObserver: IntersectionObserver | null = null;

  const cleanup = () => {
    if (nextObserver) {
      nextObserver.disconnect();
      nextObserver = null;
    }
    if (prevObserver) {
      prevObserver.disconnect();
      prevObserver = null;
    }
  };

  const setupObservers = async () => {
    if (!import.meta.client)
      return;

    // Wait for DOM to be ready
    await nextTick();

    // Cleanup existing observers first
    cleanup();

    // Setup next page observer
    if (nextTrigger.value) {
      nextObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const hasNext = typeof options.hasNextPage === "boolean"
                ? options.hasNextPage
                : options.hasNextPage.value;

              if (hasNext) {
                options.fetchNextPage();
              }
            }
          });
        },
        {
          root: scrollContainer.value,
          threshold: options.threshold || 0.1,
          rootMargin: options.rootMargin || "50px",
        },
      );
      nextObserver.observe(nextTrigger.value);
    }

    // Setup previous page observer
    if (prevTrigger.value) {
      prevObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const hasPrev = typeof options.hasPreviousPage === "boolean"
                ? options.hasPreviousPage
                : options.hasPreviousPage.value;

              if (hasPrev) {
                options.fetchPreviousPage();
              }
            }
          });
        },
        {
          root: scrollContainer.value,
          threshold: options.threshold || 0.1,
          rootMargin: options.rootMargin || "50px",
        },
      );
      prevObserver.observe(prevTrigger.value);
    }
  };

  onMounted(() => {
    setupObservers();
  });

  onBeforeUnmount(() => {
    cleanup();
  });

  // Watch for changes in trigger elements and re-setup observers
  watch([nextTrigger, prevTrigger, scrollContainer], () => {
    setupObservers();
  }, { flush: "post" });

  // Watch for changes in pagination state
  if (typeof options.hasNextPage !== "boolean") {
    watch(options.hasNextPage, () => {
      setupObservers();
    });
  }
  if (typeof options.hasPreviousPage !== "boolean") {
    watch(options.hasPreviousPage, () => {
      setupObservers();
    });
  }

  return {
    setupObservers,
    cleanup,
  };
}
