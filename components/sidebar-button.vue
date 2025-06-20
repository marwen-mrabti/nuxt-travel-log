<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  label: string;
  icon: string;
  to: RouteLocationRaw;
  showLabel: boolean;
  iconColor?: "text-accent" | "text-primary" | "text-secondary";
}>();

const route = useRoute();
</script>

<template>
  <li
    class="tooltip-right w-full"
    :data-tip="showLabel ? undefined : props.label"
    :class="{ tooltip: !showLabel }"
  >
    <NuxtLink
      :to="props.to"
      :class="{ 'bg-base-300': route.path === props.to, 'justify-center': !showLabel, 'justify-start': showLabel }"
      class="flex items-center gap-2 p-2 hover:bg-base-300 hover:cursor-pointer flex-nowrap"
    >
      <Icon
        :name="props.icon"
        size="24"
        :class="iconColor"
      />
      <Transition name="grow">
        <span v-if="showLabel" class="truncate">{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </li>
</template>

  <style scoped>
    .grow-enter-active {
  animation: grow 0.05s;
}
.grow-leave-active {
  animation: grow 0.05s reverse;
}
@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
