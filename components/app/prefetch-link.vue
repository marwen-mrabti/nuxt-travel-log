<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

import { useQueryClient } from "@tanstack/vue-query";

type Props = {
  to: RouteLocationRaw;
  slug: string;
  class?: string;
  prefetch?: boolean;
  prefetchOn?: "interaction" | "visibility";
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
  prefetchLocation({
    slug: props.slug,
    queryClient,
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
