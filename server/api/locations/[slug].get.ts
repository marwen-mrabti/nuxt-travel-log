import { getLocation } from "~/lib/db/queries/locations-queries";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const userId = event.context.user.id;

  if (!slug) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: "Slug is required",
    }));
  }
  try {
    const location = await getLocation(slug, userId);
    if (!location) {
      return sendError(event, createError({
        statusCode: 404,
        statusMessage: "Location not found",
      }));
    }
    return location;
  }
  catch (e) {
    const error = e as Error;
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    }));
  }
});
