<script setup lang='ts'>
import type { FetchError } from "ofetch";
import type { z } from "zod";

import { toTypedSchema } from "@vee-validate/zod";

import { InsertLocationSchema, type T_InsertLocation } from "~/lib/db/schema";

const validationSchema = toTypedSchema(InsertLocationSchema as unknown as z.ZodObject<any>);

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const { $csrfFetch } = useNuxtApp();
const router = useRouter();

const { handleSubmit, errors, setErrors, resetForm, meta } = useForm<T_InsertLocation>({
  validationSchema,
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  submitted.value = false;
  submitError.value = "";
  try {
    await ($csrfFetch as typeof $fetch)("/api/locations", {
      method: "post",
      body: values,
    });

    submitted.value = true;
    submitError.value = "";
    setErrors({});
    resetForm();

    return navigateTo(`/dashboard`);
  }
  catch (e) {
    const error = e as FetchError;

    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = error?.data.statusMessage || error.statusMessage || "Unknown error has occurred";
    submitted.value = false;
  }
  finally {
    loading.value = false;
  }
});

function onCancel() {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirmCancel = confirm("You have unsaved changes. Are you sure you want to cancel? Your changes will not be saved.");
    if (confirmCancel) {
      resetForm();
      submitted.value = false;
      submitError.value = "";
      router.back();
    }
  }
  router.back();
}

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
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
    v-if="submitError"
    role="alert"
    class="alert alert-error max-w-[350px] mx-auto"
  >
    <Icon name="tabler:circle-x-filled" size="24" />
    <span>{{ submitError }}</span>
  </div>
  <div
    v-else-if="submitted"
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
      :disabled="loading"
    />
    <AppFormField
      label="Description"
      name="description"
      :error="errors.description"
      type="textarea"
      :disabled="loading"
    />
    <AppFormField
      label="Latitude"
      name="lat"
      :error="errors.lat"
      :disabled="loading"
    />
    <AppFormField
      label="Longitude"
      name="long"
      :error="errors.long"
      :disabled="loading"
    />
    <div class="flex items-center justify-end gap-2 ">
      <button
        type="button"
        class="btn btn-outline"
        :disabled="loading"
        aria-label="Cancel"
        @click="onCancel"
      >
        <Icon name="tabler:arrow-left" size="24" />
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-primary flex items-center gap-2"
        :disabled="loading || !meta.dirty || !!errors.name || !!errors.description || !!errors.lat || !!errors.long"
      >
        <span>
          {{ loading ? "Processing" : "Add Location" }}
        </span>
        <span v-if="loading" class="loading loading-spinner loading-md" />
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
