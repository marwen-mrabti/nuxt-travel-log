import { defineStore } from "pinia";

import type { T_User } from "~/lib/db/schema";

import { authClient } from "~/lib/auth-client";

export const useAuthStore = defineStore("auth-store", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.getSession>> | null>(null);

  async function init() {
    const data = await authClient.useSession(useFetch);
    session.value = data;
    return data;
  }

  const user = computed<T_User>(() => session.value?.data?.user);
  const pending = computed<boolean>(() => session.value?.isPending);

  async function signIn() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      fetchOptions: {
        headers,
      },
    });
  }

  async function signOut() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    await authClient.signOut({
      fetchOptions: {
        headers,
      },
    });
    return navigateTo("/");
  }

  return { init, user, pending, signIn, signOut };
});
