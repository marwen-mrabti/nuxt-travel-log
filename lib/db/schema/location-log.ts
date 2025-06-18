import type { z } from "zod/v4";

import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { location } from "~/lib/db/schema/location";
import { locationLogImage } from "~/lib/db/schema/location-log-image";
import { DateSchema, DescriptionSchema, LatSchema, LongSchema, NameSchema } from "~/lib/zod-schemas";

export const locationLog = sqliteTable("locationLog", {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  description: text(),
  startedAt: int().notNull(),
  endedAt: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: text().notNull().references(() => location.id, { onDelete: "cascade" }),
  // userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogRelations = relations(locationLog, ({ one, many }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
  images: many(locationLogImage),
}));

export const InsertLocationLogSchema = createInsertSchema(locationLog, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
  startedAt: DateSchema,
  endedAt: DateSchema,
}).omit({
  id: true,
  // userId: true,
  locationId: true,
  createdAt: true,
  updatedAt: true,
}).check((context) => {
  if (context.value.startedAt !== context.value.endedAt) {
    context.issues.push({
      code: "custom",
      message: "Start Date must be before End Date",
      path: ["startedAt"],
      input: context.value.startedAt,
    });
    context.issues.push({
      code: "custom",
      message: "End Date must be after Start Date",
      path: ["endedAt"],
      input: context.value.endedAt,
    });
  }
});

export type T_SelectLocationLog = typeof locationLog.$inferSelect;
export type T_InsertLocationLog = z.infer<typeof InsertLocationLogSchema>;
