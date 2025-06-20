import type { z } from "zod";

import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "~/lib/db/schema/auth";
import { locationLog } from "~/lib/db/schema/location-log";

export const locationLogImage = sqliteTable("locationLogImage", {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  key: text().notNull(),
  locationLogId: text().notNull().references(() => locationLog.id, { onDelete: "cascade" }),
  userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogImagesRelations = relations(locationLogImage, ({ one }) => ({
  locationLog: one(locationLog, {
    fields: [locationLogImage.locationLogId],
    references: [locationLog.id],
  }),
  user: one(user, {
    fields: [locationLogImage.userId],
    references: [user.id],
  }),
}));

export const InsertLocationLogImageSchema = createInsertSchema(locationLogImage, {
  key: (field: z.ZodString) => field.regex(/^\d+\/\d+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, "Invalid key"),
}).omit({
  id: true,
  locationLogId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type T_SelectLocationLogImage = typeof locationLogImage.$inferSelect;
export type T_InsertLocationLogImage = z.infer<typeof InsertLocationLogImageSchema>;
