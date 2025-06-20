import { z } from "zod";

import tryParseEnv from "./try-parse-env";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DEV_DB_URL: z.string().url().optional(),
  TURSO_DATABASE_URL: z.string().url().nonempty(),
  TURSO_AUTH_TOKEN: z.string().nonempty(),
  BETTER_AUTH_SECRET: z.string().nonempty().min(32, "BETTER_AUTH_SECRET must be at least 32 characters long"),
  BETTER_AUTH_URL: z.string().url().nonempty(),
  AUTH_GITHUB_CLIENT_ID: z.string().nonempty(),
  AUTH_GITHUB_CLIENT_SECRET: z.string().nonempty(),
});

export type T_EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env);
