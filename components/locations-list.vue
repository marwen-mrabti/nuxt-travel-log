<script lang="ts" setup>
import type { T_SelectLocation } from "~/lib/db/schema";

const props = defineProps<{
  locations: T_SelectLocation[];
}>();
</script>

<template>
  <ul

    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 py-1"
  >
    <li
      v-for="location in props.locations"
      :key="location.id"
    >
      <LocationCard :location="location" />
    </li>
  </ul>
</template>

<style scoped>

</style>
