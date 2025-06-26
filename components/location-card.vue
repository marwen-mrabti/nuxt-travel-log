<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";

import type { T_SelectLocation } from "~/lib/db/schema";

const props = defineProps<{
  location: T_SelectLocation;
}>();

const queryClient = useQueryClient();
const { location } = toRefs(props);

function prefetchOnMouseEnter({ slug }: { slug?: string }) {
  if (slug) {
    return queryClient.ensureQueryData({
      queryKey: ["location", slug],
      queryFn: () => fetcher(`/api/locations/${slug}`),
    });
  }
}
</script>

<template>
  <NuxtLink
    :to="{ name: 'dashboard-location-slug', params: { slug: location.slug } }"
    class="card card-compact bg-base-200 min-h-35 h-fit  min-w-fit w-full shrink-0 cursor-pointer hover:bg-base-100 border-2 hover:border-accent transition-all duration-200 ease-linear shadow-2xl"
    prefetch-on="interaction"
    @mouseenter="prefetchOnMouseEnter({ slug: location.slug })"
  >
    <div class="card-body">
      <slot name="top" />
      <h2 class="card-title capitalize">
        {{ location.name }}
      </h2>
      <p>{{ location.description }}</p>
    </div>
  </NuxtLink>
</template>
