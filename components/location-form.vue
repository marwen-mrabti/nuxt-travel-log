<script setup lang='ts'>
import type { FetchError } from "ofetch";
import type { z } from "zod";

import { toTypedSchema } from "@vee-validate/zod";

import { InsertLocationSchema, type T_InsertLocation } from "~/lib/db/schema";

const validationSchema = toTypedSchema(InsertLocationSchema as unknown as z.ZodObject<any>);

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const { handleSubmit, errors, resetForm } = useForm<T_InsertLocation>({
  validationSchema,
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    const result = await $fetch("/api/location", {
      method: "POST",
      body: {
        ...values,
      },
    });
    console.log("Location added:", result);
    submitted.value = true;
    submitError.value = "";
    resetForm();
  }
  catch (e) {
    const error = e as FetchError;
    submitError.value = error.statusMessage || "Unknown error has occurred";
    submitted.value = false;
  }
  finally {
    loading.value = false;
  }
});

function onCancel() {
  resetForm();
  submitted.value = false;
  submitError.value = "";
}
</script>

<template>
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
        :disabled="loading || !!errors.name || !!errors.description || !!errors.lat || !!errors.long"
      >
        <span>
          {{ submitted ? "Submitted" : "Add Location" }}
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
