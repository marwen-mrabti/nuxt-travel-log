<script setup lang="ts">
const isSidebarOpen = ref(true);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSideBar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <aside class="bg-base-200 overflow-x-hidden overflow-y-auto flex flex-col items-start gap-6 transition-all duration-100 ease-in-out" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
    <button
      class="flex w-full hover:cursor-pointer hover:bg-base-200 p-2 "
      :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }"
      @click="toggleSideBar"
    >
      <Icon
        v-if="isSidebarOpen"
        name="tabler:chevron-left"
        size="24"
      />
      <Icon
        v-else
        name="tabler:chevron-right"
        size="24"
      />
    </button>

    <ul class="flex flex-col items-start gap-4 w-full " :class="{ 'items-center': !isSidebarOpen, 'items-start': isSidebarOpen }">
      <SidebarButton
        label="Locations"
        icon="tabler:map"
        to="/dashboard/locations"
        :show-label="isSidebarOpen"
      />

      <SidebarButton
        label="Add Location"
        icon="tabler:plus"
        to="/dashboard/add"
        :show-label="isSidebarOpen"
      />

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
