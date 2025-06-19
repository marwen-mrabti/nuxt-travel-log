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
      throw new Error(`Environment variable validation failed: ${JSON.stringify(errorTree, null, 2)}`);
    }
    else {
      console.error("An unexpected error occurred while parsing environment variables:", error);
    }
  }
}
