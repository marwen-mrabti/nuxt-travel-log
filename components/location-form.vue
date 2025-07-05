<script setup lang='ts'>
import type { FetchError } from "ofetch";
import type { z } from "zod";

import { useQueryClient } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/zod";

import type { T_InsertLocation } from "~/lib/db/schema";

import { useInsertLocation } from "~/composables/location";
import { GREENWICH_Coords } from "~/lib/constants";
import { InsertLocationSchema } from "~/lib/db/schema";

const router = useRouter();
const queryClient = useQueryClient();
const canceling = ref(false);

type T_InsertLocationWithoutCoords = Omit<T_InsertLocation, "longitude" | "latitude">;

const validationSchema = toTypedSchema(
  InsertLocationSchema.omit({ long: true, lat: true }) as unknown as z.ZodObject<any>,
);

const { handleSubmit, errors, setErrors, resetForm, meta } = useForm<T_InsertLocationWithoutCoords>({
  validationSchema,
});

const { mutateAsync: insertLocationAsync, error, isError, isPending, isSuccess: isSubmitted, reset } = useInsertLocation();

const mapStore = useMapStore();
const { newLocationCoords: coords } = storeToRefs(mapStore);

const onSubmit = handleSubmit(async (values) => {
  await insertLocationAsync({ ...values, lat: coords.value.lat, long: coords.value.lng }, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      setErrors({});
      resetForm();
      reset();
      return navigateTo("/dashboard");
    },
    onError: (error: FetchError) => {
      if (error.data?.data) {
        setErrors(error.data?.data);
      }
    },
  });
});

function onCancel() {
  const confirmMsg = "You have unsaved changes. Are you sure you want to cancel? Your changes will not be saved.";
  canceling.value = true;
  if (!isSubmitted.value && meta.value.dirty && !canceling.value) {
    // eslint-disable-next-line no-alert
    if (confirm(confirmMsg)) {
      reset();
      setErrors({});
      resetForm();
      canceling.value = false;
      return navigateTo("/dashboard");
    }
  }
  canceling.value = false;
  return router.back();
}

onBeforeMount(() => {
  mapStore.setNewLocationCoords(GREENWICH_Coords);
  reset();
  setErrors({});
});

onBeforeRouteLeave(() => {
  if (!isSubmitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirmLeave = confirm("You have unsaved changes. Are you sure you want to leave? Your changes will not be saved.");
    if (!confirmLeave) {
      return false;
    }
  }
  return true;
});
</script>

<template>
  <div class="max-w-md mx-auto w-full flex flex-col items-center justify-center gap-2">
    <div
      v-if="isError"
      role="alert"
      class="alert alert-error w-full"
    >
      <Icon name="tabler:circle-x-filled" size="24" />
      <span>{{ error?.statusMessage || error?.data?.message || "An unknown error occurred." }}</span>
    </div>
    <div
      v-else-if="isSubmitted"
      role="alert"
      class="alert alert-success w-full mx-auto"
    >
      <Icon name="tabler:circle-check-filled" size="24" />
      <span>
        Location added successfully!
      </span>
    </div>
    <form
      class="flex flex-col gap-2 w-full mx-auto"
      @submit.prevent="onSubmit"
    >
      <AppFormField
        label="Name"
        name="name"
        :error="errors.name"
        :disabled="isPending"
      />
      <AppFormField
        label="Description"
        name="description"

        :error="errors.description"
        type="textarea"
        :disabled="isPending"
      />
      <!-- coordinate slot -->
      <slot />

      <div class="flex items-center justify-end gap-2 ">
        <button
          type="button"
          class="btn btn-outline"
          :disabled="isPending"
          aria-label="Cancel"
          @click="onCancel"
        >
          <Icon name="tabler:arrow-left" size="24" />
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary flex items-center gap-2"
          :disabled="isPending || !meta.dirty || !!errors.name || !!errors.description"
        >
          <span>
            {{ isPending ? "Processing" : "Add" }}
          </span>
          <span v-if="isPending" class="loading loading-spinner loading-md" />
          <Icon
            v-else
            name="tabler:circle-plus-filled"
            size="24"
          />
        </button>
      </div>
    </form>
  </div>
</template>
