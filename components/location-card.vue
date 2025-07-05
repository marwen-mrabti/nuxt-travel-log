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
    class="card card-compact bg-base-200 w-full  cursor-pointer hover:bg-base-100 border-2 hover:border-accent transition-all duration-200 ease-linear shadow-2xl"
  >
    <div class="card-body overflow-hidden whitespace-normal">
      <h2 class="card-title text-balance capitalize">
        {{ location.name }}
      </h2>
      <p
        class="text-sm line-clamp-3"
      >
        {{ location.description }}
      </p>
    </div>
  </AppPrefetchLink>
</template>
