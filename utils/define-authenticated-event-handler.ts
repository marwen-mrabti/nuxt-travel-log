import type { H3Event, H3EventContext } from "h3";

import type { T_User } from "~/lib/db/schema";

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: T_User | null;
  };
};

export default function defineAuthenticatedEventHandler<T>(
  handler: (event: AuthenticatedEvent) => T,
) {
  return defineEventHandler(async (event) => {
    if (!event.context.user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    return handler(event as AuthenticatedEvent);
  });
}
