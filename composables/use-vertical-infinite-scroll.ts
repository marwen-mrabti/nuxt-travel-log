export function useVerticalInfiniteScroll(
  { hasPreviousPage, isFetchingPrev, fetchPreviousPage, hasNextPage, isFetchingNext, fetchNextPage, options }: {
    hasPreviousPage: Ref<boolean>;
    isFetchingPrev: Ref<boolean>;
    fetchPreviousPage: () => void;
    hasNextPage: Ref<boolean>;
    isFetchingNext: Ref<boolean>;
    fetchNextPage: () => void;
    options: {
      rootMargin?: string;
      threshold?: number;
    };
  },
) {
  const triggerPrevRef = ref<HTMLElement | null>(null);
  const triggerNextRef = ref<HTMLElement | null>(null);
  const containerRef = ref<HTMLElement | null>(null);

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (import.meta.client && triggerPrevRef.value) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasPreviousPage.value && !isFetchingPrev.value) {
            fetchPreviousPage();
          }
        },
        {
          root: containerRef.value,
          rootMargin: options.rootMargin || "50px",
          threshold: options.threshold || 0.4,
        },
      );

      observer.observe(triggerPrevRef.value);
    }
  });

  if (import.meta.client && triggerNextRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage.value && !isFetchingNext.value) {
          fetchNextPage();
        }
      },
      {
        root: containerRef.value,
        rootMargin: options.rootMargin || "150px",
        threshold: options.threshold || 0.5,
      },
    );

    observer.observe(triggerNextRef.value);
  }

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  });

  return {
    triggerPrevRef,
    triggerNextRef,
    containerRef,
  };
}
