<script setup lang="ts">
import { useLocations } from "~/composables/location";

const isSidebarOpen = ref(true);

const { data: locations, isPending } = useLocations();

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSideBar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <aside class="relative bg-base-100 overflow-hidden flex flex-col items-start justify-between gap-2 transition-all duration-300 ease-in-out" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
    <div class="flex flex-col w-full sticky top-0">
      <button
        class="flex w-full hover:cursor-pointer hover:bg-base-200 p-2 "
        :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }"
        @click="toggleSideBar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:chevron-left"
          size="32"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="32"
        />
      </button>
      <div class="flex flex-col items-start gap-4 w-full flex-1" :class="{ 'items-center': !isSidebarOpen, 'items-start': isSidebarOpen }">
        <SidebarButton
          label="Locations"
          icon="tabler:map"
          to="/dashboard"
          :show-label="isSidebarOpen"
        />

        <SidebarButton
          label="Add Location"
          icon="tabler:circle-plus-filled"
          to="/dashboard/add"
          :show-label="isSidebarOpen"
        />
      </div>
      <div v-show="isPending || locations?.length" class="divider mx-2 -my-1" />
    </div>

    <div v-if="isPending" class="w-full pl-2 py-1 flex flex-1 flex-col justify-start justify-self-start gap-2">
      <div class="skeleton w-2/3 h-6" />
      <div class="skeleton w-2/3 h-6" />
      <div class="skeleton w-2/3 h-6" />
    </div>
    <ul v-else-if="locations?.length" class="w-full flex flex-col flex-1 justify-self-start overflow-x-hidden overflow-y-auto py-1">
      <SidebarButton
        v-for="location in locations"
        :key="location.id"
        :label="location.name"
        icon="tabler:map-pin"
        :to="`/dashboard/location/${location.slug}`"
        :show-label="isSidebarOpen"
      />
    </ul>

    <div class="flex flex-col w-full sticky bottom-0">
      <div class="divider mx-2 -my-1" />
      <SidebarButton
        label="Sign Out"
        icon="tabler:logout-2"
        to="/sign-out"
        :show-label="isSidebarOpen"
      />
    </div>
  </aside>
</template>
