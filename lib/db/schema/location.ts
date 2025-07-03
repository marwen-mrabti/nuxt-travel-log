import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import type { T_SelectLocationLog } from "~/lib/db/schema/location-log";

import { user } from "~/lib/db/schema/auth";
import { locationLog } from "~/lib/db/schema/location-log";
import { DescriptionSchema, LatSchema, LongSchema, NameSchema } from "~/lib/zod-schemas";

export const location = sqliteTable("location", {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [unique().on(t.name, t.userId)]);

export const InsertLocationSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
});

export const locationRelations = relations(location, ({ many }) => ({
  locationLogs: many(locationLog),
}));

export type T_SelectLocation = typeof location.$inferSelect;
export type T_InsertLocation = typeof InsertLocationSchema._type;
export type T_SelectLocationWithLogs = T_SelectLocation & {
  locationLogs: T_SelectLocationLog[];
};
