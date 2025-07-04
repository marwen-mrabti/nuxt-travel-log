<script setup lang="ts">
import type { T_SelectLocation } from "~/lib/db/schema";

const props = defineProps<{
  location: T_SelectLocation;
}>();

const { location } = toRefs(props);
</script>

<template>
  <AppPrefetchLink
    :to="{ name: 'dashboard-location-slug', params: { slug: location.slug } }"
    :slug="location.slug"
    class="card card-compact bg-base-200  w-full h-35 cursor-pointer hover:bg-base-100 border-2 hover:border-accent transition-all duration-200 ease-linear shadow-2xl"
  >
    <div class="card-body py-4 overflow-hidden">
      <h2 class="card-title text-balance capitalize">
        {{ location.name }}
      </h2>
      <p
        class="text-sm leading-snug text-pretty text-ellipsis"
      >
        {{ location.description }}
      </p>
    </div>
  </AppPrefetchLink>
</template>
