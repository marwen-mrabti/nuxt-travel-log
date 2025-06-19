import { defineStore } from "pinia";

// import { authClient } from "~/lib/auth-client";

export const useAuthStore = defineStore("authStore", async () => {
  // const { data: session } = await authClient.getSession();
  // console.log(session);
  const user = ref(null);

  return { user };
});
