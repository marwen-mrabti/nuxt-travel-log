<script lang="ts" setup>
const router = useRouter();
const route = useRoute();
const error = useError();

const errorMessage = computed(() => error.value?.statusMessage || route.query.error || "An unknown error occurred.");

// Error type configurations
const errorConfig = computed(() => {
  const code = error.value?.statusCode;

  switch (code) {
    case 404:
      return {
        title: "Page Not Found",
        description: "The page you're looking for seems to have wandered off into the digital void.",
        emoji: "🌌",
        color: "from-purple-600 to-blue-600",
        suggestion: "Let's get you back on track",
      };
    case 500:
      return {
        title: "Server Error",
        description: "Something went wrong on our end. Our team has been notified and is working on it.",
        emoji: "⚡",
        color: "from-red-500 to-pink-600",
        suggestion: "Please try again in a moment",
      };
    case 403:
      return {
        title: "Access Denied",
        description: "You don't have permission to access this resource.",
        emoji: "🚫",
        color: "from-orange-500 to-red-500",
        suggestion: "Check your permissions or contact support",
      };
    default:
      return {
        title: "Something Went Wrong",
        description: "An unexpected error occurred. Don't worry, it's not your fault!",
        emoji: "🤖",
        color: "from-indigo-500 to-purple-600",
        suggestion: "Let's try to fix this together",
      };
  }
});

// Animation states
const isVisible = ref(false);
const isNavigating = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});

// Actions
async function goHome() {
  if (isNavigating.value)
    return;
  isNavigating.value = true;
  isVisible.value = false;
  await new Promise(resolve => setTimeout(resolve, 300)); // Wait for exit animation
  await navigateTo("/");
}

async function goBack() {
  if (isNavigating.value)
    return;
  isNavigating.value = true;
  isVisible.value = false;
  await new Promise(resolve => setTimeout(resolve, 300)); // Wait for exit animation
  router.back();
}

function reloadPage() {
  if (isNavigating.value)
    return;
  isNavigating.value = true;
  isVisible.value = false;
  // No need to wait for reload since page will refresh
  setTimeout(() => {
    window.location.reload();
  }, 200);
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
    </div>

    <!-- Floating particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-30 animate-float" />
      <div class="absolute top-3/4 left-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-float animation-delay-1000" />
      <div class="absolute top-1/2 right-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-20 animate-float animation-delay-2000" />
      <div class="absolute bottom-1/4 right-1/3 w-2 h-2 bg-pink-400 rounded-full opacity-30 animate-float animation-delay-3000" />
    </div>

    <!-- Main content -->
    <div
      class="max-w-2xl w-full text-center relative z-10 transition-all duration-1000 ease-out"
      :class="[
        isVisible
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8',
      ]"
    >
      <!-- Error code with gradient -->
      <div class="mb-8">
        <div
          class="text-8xl md:text-9xl font-black bg-gradient-to-r bg-clip-text text-transparent animate-pulse"
          :class="errorConfig.color"
        >
          {{ error?.statusCode }}
        </div>
        <div class="text-6xl mb-4 animate-bounce">
          {{ errorConfig.emoji }}
        </div>
      </div>

      <!-- Error details -->
      <div class="backdrop-blur-lg bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">
          {{ errorConfig.title }}
        </h1>

        <p class="text-lg text-gray-300 mb-8 leading-relaxed">
          {{ errorConfig.description }}
        </p>

        <div class="text-sm text-gray-400 mb-8">
          {{ errorConfig.suggestion }}
        </div>

        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            :disabled="isNavigating"
            class="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            @click="goHome"
          >
            <span class="relative z-10 flex items-center gap-2">
              <template v-if="!isNavigating">
                <Icon name="tabler:home" size="24" />
                Go Home
              </template>
              <template v-else>
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </template>
            </span>
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button
            :disabled="isNavigating"
            class="px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            @click="goBack"
          >
            <span class="relative z-10 flex items-center gap-2">
              <template v-if="!isNavigating">
                <Icon name="tabler:arrow-left" size="24" />
                Go Back
              </template>
              <template v-else>
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </template>
            </span>
          </button>

          <button
            v-if="(error?.statusCode ?? 0) >= 500"
            :disabled="isNavigating"
            class="px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            @click="reloadPage"
          >
            <span class="relative z-10 flex items-center gap-2">
              <template v-if="!isNavigating">
                🔄 Try Again
              </template>
              <template v-else>
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Reloading...
              </template>
            </span>
          </button>
        </div>

        <!-- Additional error info for development -->
        <DevOnly>
          <details v-if="errorMessage" class="mt-8 text-left">
            <summary class="text-gray-400 cursor-pointer hover:text-white transition-colors mb-4">
              🔍 Technical Details
            </summary>
            <div class="bg-black/30 rounded-lg p-4 font-mono text-sm text-red-300 border border-red-500/20">
              <div class="mb-2">
                <strong>Message:</strong> {{ errorMessage }}
              </div>
            </div>
          </details>
        </DevOnly>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

/* Smooth reveal animation */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
