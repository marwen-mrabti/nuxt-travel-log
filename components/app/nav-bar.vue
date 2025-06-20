<template>
  <header class="flex sticky top-0 z-100 bg-primary text-primary-content shadow-sm">
    <nav class="navbar-start px-2 md:px-10">
      <NuxtLink to="/" class="font-bold btn btn-ghost text-xl">
        Travel Log
      </NuxtLink>
    </nav>

    <div class="navbar-end gap-4">
      <AppThemeToggle />
      <AuthButton />
    </div>
  </header>
</template>

<style scoped>

</style>
