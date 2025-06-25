<script setup lang='ts'>
import type { FetchError } from "ofetch";
import type { z } from "zod";

import { useQueryClient } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/zod";

import { useInsertLocation } from "~/composables/location";
import { InsertLocationSchema, type T_InsertLocation } from "~/lib/db/schema";

const validationSchema = toTypedSchema(InsertLocationSchema as unknown as z.ZodObject<any>);

const router = useRouter();
const queryClient = useQueryClient();

const { handleSubmit, errors, setErrors, resetForm, meta } = useForm<T_InsertLocation>({
  validationSchema,
});

const { mutateAsync: insertLocationAsync, error, isError, isPending, isSuccess: isSubmitted, reset } = useInsertLocation();

const onSubmit = handleSubmit(async (values) => {
  await insertLocationAsync(values, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations", "all"] });
      queryClient.invalidateQueries({ queryKey: ["locations", "paginated"] });
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
  if (!isSubmitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirmCancel = confirm("You have unsaved changes. Are you sure you want to cancel? Your changes will not be saved.");
    if (confirmCancel) {
      reset();
      setErrors({});
      resetForm();
      return navigateTo("/dashboard");
    }
  }
  return router.back();
}

onBeforeMount(() => {
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
  <div
    v-if="isError"
    role="alert"
    class="alert alert-error max-w-[350px] mx-auto"
  >
    <Icon name="tabler:circle-x-filled" size="24" />
    <span>{{ error?.statusMessage || error?.data?.message || "An unknown error occurred." }}</span>
  </div>
  <div
    v-else-if="isSubmitted"
    role="alert"
    class="alert alert-success max-w-[350px] mx-auto"
  >
    <Icon name="tabler:circle-check-filled" size="24" />
    <span>
      Location added successfully!
    </span>
  </div>
  <form
    class="flex flex-col gap-2 w-full max-w-[350px] mx-auto"
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
    <AppFormField
      label="Latitude"
      name="lat"
      :error="errors.lat"
      :disabled="isPending"
    />
    <AppFormField
      label="Longitude"
      name="long"
      :error="errors.long"
      :disabled="isPending"
    />
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
        :disabled="isPending || !meta.dirty || !!errors.name || !!errors.description || !!errors.lat || !!errors.long"
      >
        <span>
          {{ isPending ? "Processing" : "Add Location" }}
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
</template>

<style scoped>
</style>
