import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref(null);

  return { user };
});
