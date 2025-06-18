<script lang="ts" setup>
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value) {
    colorMode.preference = value ? "dark" : "light";
  },
});
</script>

<template>
  <label class="swap swap-rotate mx-4">
    <input
      v-model="isDark"
      type="checkbox"
      class="theme-controller"
    >
    <Icon
      name="tabler:sun"
      size="24"
      class="swap-on h-10 w-10 fill-current"
    />

    <Icon
      name="tabler:moon-filled"
      size="24"
      class="swap-off h-10 w-10 fill-current"
    />
  </label>
</template>
