import type { DrizzleError } from "drizzle-orm";

import slugify from "slug";

import { findUniqueSlug, getLocationByNameAndUserId, insertLocation } from "~/lib/db/queries/locations-queries";
import { InsertLocationSchema } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export type T_LocationInfo = {
  id: string;
  slug: string;
  name: string;
  lat: number;
  long: number;
};

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocationSchema.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }
  const userId = event.context?.user?.id;
  if (!userId) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }
  const existingLocation = await getLocationByNameAndUserId(result.data.name.toLowerCase(), userId);
  if (existingLocation) {
    throw createError({
      statusCode: 409,
      statusMessage: "Location with this name already exists.",
    });
  }
  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    const location = await insertLocation({
      ...result.data,
      name: result.data.name.toLowerCase(),
      userId,
      slug,
    });
    return location;
  }
  catch (e) {
    const error = e as DrizzleError;
    if (error.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "Slug must be unique (the location name is used to generate the slug).",
      }));
    }
    throw error;
  }
});
