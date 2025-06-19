<script lang="ts" setup>
const authStore = useAuthStore();
const { user, pending, signIn } = authStore;
</script>

<template>
  <div v-if="!pending && user" class="flex gap-4 items-center ">
    <div class="dropdown dropdown-end dropdown-hover">
      <div
        tabindex="0"
        class="border-2 border-accent rounded-full"
      >
        <div v-if="!!user?.image" class="avatar">
          <button class="w-12 rounded-full">
            <img
              :src="user.image"
              :alt="user.name"
              class="rounded-full"
            >
          </button>
        </div>
        <div v-else class="avatar avatar-placeholder">
          <div class="bg-neutral text-neutral-content w-12 rounded-full">
            <span>{{ user.name.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
      </div>
      <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        <li>
          <NuxtLink to="/sign-out">
            Sign Out
            <Icon name="tabler:logout-2" size="24" />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
  <button
    v-else
    :disabled="pending"
    class="btn btn-accent"
    @click="signIn"
  >
    Sign In With Github
    <span v-if="pending" class="loading loading-spinner loading-md" />
    <Icon
      v-else
      name="tabler:brand-github"
      size="24"
    />
  </button>
</template>
