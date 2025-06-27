import type { DrizzleError } from "drizzle-orm";

import { getLocationsByUserId, getPaginatedLocations } from "~/lib/db/queries/locations-queries";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id;
  const query = getQuery(event);

  // Check if pagination parameters are provided
  const pageParam = query.page as string;
  const limitParam = query.limit as string;

  try {
    // If pagination params exist, use paginated query
    if (pageParam || limitParam) {
      const page = Math.max(1, Number.parseInt(pageParam) || 1);
      const limit = Math.min(100, Math.max(1, Number.parseInt(limitParam) || 10));
      const result = await getPaginatedLocations(userId, { page, limit });
      return result;
    }
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
