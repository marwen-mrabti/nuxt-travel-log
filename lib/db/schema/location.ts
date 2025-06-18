import type { z } from "zod/v4";

import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { DescriptionSchema, LatSchema, LongSchema, NameSchema } from "~/lib/zod-schemas";

export const location = sqliteTable("location", {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  // userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});// ,t => [//   unique().on(t.name, t.userId)];

export const InsertLocationSchema = createInsertSchema(location, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
}).omit({
  id: true,
  // userId: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

// export const locationRelations = relations(location, ({ one }) => ({
// user: one(location, {
//   fields: [location.userId],
//   references: [user.id],
// }),
// }));

export type T_Location = typeof location.$inferSelect;
export type T_InsertLocation = z.infer<typeof InsertLocationSchema>;
