/* eslint-disable node/no-process-env */
import type { ZodObject, ZodRawShape } from "zod/v4";

import { z, ZodError } from "zod/v4";

export default function tryParseEnv<T extends ZodRawShape>(EnvSchema: ZodObject<T>, buildEnv: Record<string, string | undefined> = process.env) {
  try {
    EnvSchema.parse(buildEnv);
  }
  catch (error) {
    if (error instanceof ZodError) {
      const errorTree = z.flattenError(error);
      console.error("Environment variable validation failed:", errorTree);
      console.error("Please ensure all required environment variables are set correctly.");
      process.exit(1);
    }
    else {
      console.error("An unexpected error occurred while parsing environment variables:", error);
    }
  }
}
