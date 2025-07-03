<script setup lang='ts'>
import { useLocation } from "~/composables/location";

const route = useRoute();

const slug = computed(() => route.params.slug as string | undefined);

useHead({
  title: computed(() => `location: ${slug.value}`),
});

const { data: location, isPending, isError, error, refetch } = useLocation({ slug });
const errorMessage = computed(() => error.value?.statusMessage || error.value?.data?.message);
const mapStore = useMapStore();
const { activeLocation } = storeToRefs(mapStore);
watch(() => location.value, (newLocation) => {
  if (newLocation) {
    activeLocation.value = newLocation;
  }
}, { immediate: true });
</script>

<template>
  <div class="w-full flex-1 py-2">
    <div class="w-full md:w-2/3 flex flex-col items-start justify-evenly gap-2">
      <div v-if="isPending" class="flex flex-col items-center gap-2 w-full">
        <LocationLoadingSkeleton />
      </div>
      <div v-else-if="isError" class="card bg-base-100 w-full min-h-40 px-4 py-1 flex flex-1 flex-col justify-around justify-self-start gap-1">
        <p class="text-sm text-error-content bg-error/70 px-2 py-1 text-pretty">
          failed to fetch the location: {{ errorMessage }}
        </p>
        <button class="btn btn-sm btn-info btn-outline mt-2" @click="() => refetch()">
          Try Again
        </button>
      </div>
      <div v-else-if="location" class="mb-2 flex flex-col items-start justify-evenly gap-2">
        <div class="flex gap-1 flex-row items-center">
          <h2 class="text-2xl text-balance  font-bold">
            {{ location.name }}
          </h2>
          <button
            class="cursor-pointer "
            popovertarget="popover-1"
            style="anchor-name:--anchor-1"
          >
            <Icon name="tabler:dots-vertical" size="20" />
          </button>
          <ul
            id="popover-1"
            class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm space-y-2"
            popover
            style="position-anchor:--anchor-1"
          >
            <li>
              <button class="capitalize bg-success/40 flex items-center justify-between font-bold">
                Edit
                <Icon name="tabler:edit" size="20" />
              </button>
            </li>
            <li>
              <button class="capitalize bg-error/40 flex items-center justify-between font-bold">
                Delete
                <Icon name="tabler:trash" size="20" />
              </button>
            </li>
          </ul>
        </div>
        <p class="text-pretty ml-2">
          {{ location.description }}
        </p>
        <p class="ml-2">
          Coordinates: {{ location.lat.toFixed(4) }}, {{ location.long.toFixed(4) }}
        </p>
        <p class="ml-2">
          Created at
          <NuxtTime
            :datetime="location.createdAt"
            year="numeric"
            month="long"
            day="numeric"
          />
        </p>
        <p class="ml-2">
          Updated
          <NuxtTime
            :datetime="location.updatedAt"
            year="numeric"
            month="long"
            day="numeric"
            relative
          />
        </p>
      </div>
    </div>
  </div>
</template>
