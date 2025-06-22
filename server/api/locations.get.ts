import type { DrizzleError } from "drizzle-orm";

import { getLocationsByUserId } from "~/lib/db/queries/locations-queries";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id;
  try {
    const locations = await getLocationsByUserId(userId);
    return locations;
  }
  catch (e) {
    const error = e as DrizzleError;
    if (error.message.includes("SQLITE_CONSTRAINT")) {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "A database constraint was violated.",
      }));
    }
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: error?.message || "Internal Server Error",
    }));
  }
});
