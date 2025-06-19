export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.user !== null;

  if (!isAuthenticated) {
    if (to.path === "/dashboard") {
      return navigateTo("/", { external: true });
    }
  }
});
