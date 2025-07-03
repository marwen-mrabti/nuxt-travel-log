<script setup lang="ts">
import type { QueryKey } from "@tanstack/vue-query";
import type { RouteLocationRaw } from "vue-router";

import { useQueryClient } from "@tanstack/vue-query";

type Props = {
  to: RouteLocationRaw;
  class?: string;
  prefetch?: boolean;
  prefetchOn?: "interaction" | "visibility";
  queryKey: QueryKey;
  queryFn: () => Promise<any>;
  [key: string]: any;
};

const props = withDefaults(defineProps<Props>(), {
  prefetch: true,
  prefetchOn: "interaction",
});

const queryClient = useQueryClient();

const {
  queryKey,
  queryFn,
  prefetch,
  prefetchOn,
  ...nuxtLinkProps
} = props;

async function handlePrefetch() {
  if (!prefetch || !queryKey || !queryFn) {
    console.warn(
      "[PrefetchNuxtLink] 'queryKey' and 'queryFn' must be provided when 'prefetch' is true.",
    );
    return;
  }

  queryClient.ensureQueryData({
    queryKey,
    queryFn,
  });
}
</script>

<template>
  <NuxtLink
    v-bind="nuxtLinkProps"
    :prefetch-on="prefetchOn"
    @mouseenter="handlePrefetch"
  >
    <slot />
  </NuxtLink>
</template>
