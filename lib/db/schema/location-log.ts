import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "~/lib/db/schema/auth";
import { location } from "~/lib/db/schema/location";
import { locationLogImage } from "~/lib/db/schema/location-log-image";

export const locationLog = sqliteTable("locationLog", {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  description: text().notNull(),
  startedAt: int().notNull(),
  endedAt: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: text().notNull().references(() => location.id, { onDelete: "cascade" }),
  userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
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
  name: schema => schema.min(3, "Please provide a valid name of the location").max(100, "Name must be less than 100 characters").refine(val => val.trim() !== "", {
    message: "Name must not be empty",
  }),
  description: schema => schema.min(10, "Description is required").refine(val => val.trim() !== "", {
    message: "Description must not be empty",
  }),
  lat: schema => schema.min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  long: schema => schema.min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
}).omit({
  id: true,
  userId: true,
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
export type T_InsertLocationLog = Omit<T_SelectLocationLog, "id" | "userId" | "locationId" | "createdAt" | "updatedAt">;
