import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import env from "./lib/env";

export default defineConfig({
  out: "./lib/db/migrations",
  schema: "./lib/db/schema/index.ts",
  casing: "snake_case",
  dialect: "turso",
  dbCredentials: {
    url: env.NODE_ENV === "development" ? env.DEV_DB_URL! : env.TURSO_DATABASE_URL,
    authToken: env.NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN,
  },
});
