import { auth } from "~/lib/auth";
import { InsertLocationSchema } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocationSchema.safeParse);
  if (!result.success) {
    console.log(result.error.flatten().fieldErrors);
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: result.error.message || "invalid location data",
    }));
  }
  try {
    const session = await auth.api.getSession(event);
    if (!session || !session.user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "unauthorized",
      }));
    }
    const userId = session.user.id;
    const locationData = {
      ...result.data,
      userId,
    };
    console.log("Inserting location:", locationData);
  }
  catch (e) {
    const error = e as Error;

    if (error && error.message) {
      return sendError(event, createError({
        statusCode: 500,
        statusMessage: "failed to add location. Please try again.",
      }));
    }
  }
});
