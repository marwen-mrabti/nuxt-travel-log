/* eslint-disable node/no-process-env */
import type { ZodObject, ZodRawShape } from "zod/v4";

import { ZodError } from "zod";

export default function tryParseEnv<T extends ZodRawShape>(EnvSchema: ZodObject<T>, buildEnv: Record<string, string | undefined> = process.env) {
  try {
    EnvSchema.parse(buildEnv);
  }
  catch (error) {
    if (error instanceof ZodError) {
      console.log("Processing ZodError with issues:", error.issues); // Add this
      let message = "Missing required values in .env:\n";
      error.issues.forEach((issue) => {
        message += `${issue.path[0]}\n`;
      });
      const e = new Error(message);
      e.stack = "";
      console.log("Throwing custom error:", message); // Add this
      throw e;
    }
    else {
      console.error(error);
    }
  }
}
