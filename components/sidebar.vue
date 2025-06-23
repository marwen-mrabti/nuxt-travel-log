<script setup lang="ts">
const isSidebarOpen = ref(true);

const locationStore = useLocationStore();

const { locations, locationsStatus: status } = storeToRefs(locationStore);
const loading = computed(() => status.value === "pending");

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSideBar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <aside class="bg-base-200 overflow-y-auto flex flex-col items-start gap-6 transition-all duration-300 ease-in-out" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
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

    <ul class="flex flex-col items-start gap-4 w-full" :class="{ 'items-center': !isSidebarOpen, 'items-start': isSidebarOpen }">
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

      <div v-show="loading || locations?.length" class="divider mx-2 -my-1" />
      <div v-if="loading" class="w-full flex justify-center">
        <span class="loading loading-bars loading-xs" />
      </div>
      <ul v-else-if="locations?.length" class="w-full flex flex-col">
        <SidebarButton
          v-for="location in locations"
          :key="location.id"
          :label="location.name"
          icon="tabler:map-pin"
          :to="`/dashboard/location/${location.slug}`"
          :show-label="isSidebarOpen"
        />
      </ul>

      <div class="divider mx-2 -my-1" />
      <SidebarButton
        label="Sign Out"
        icon="tabler:logout-2"
        to="/sign-out"
        :show-label="isSidebarOpen"
      />
    </ul>
  </aside>
</template>
