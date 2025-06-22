<script setup lang="ts">
import type { T_SelectLocation } from "~/lib/db/schema";

const props = defineProps<{
  location: T_SelectLocation;
}>();
const { location } = toRefs(props);
</script>

<template>
  <div class="card bg-base-100 text-base-content w-full shadow-xl">
    <div class="card-body">
      <h2 class="card-title">
        {{ location.name }}
      </h2>
      <p>{{ location.description }}</p>
      <div class="card-actions justify-end">
        <NuxtLink
          :to="{ name: 'dashboard-location-slug', params: { slug: location.slug } }"
          class="btn btn-info text-info-content btn-sm"
        >
          View Details
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
