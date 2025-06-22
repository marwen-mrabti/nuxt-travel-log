import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import type { T_InsertLocation } from "~/lib/db/schema/location";

import db from "~/lib/db";
import { location } from "~/lib/db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

 type T_InsertLocationWithUserIdAndSlug = T_InsertLocation & {
   userId: string;
   slug: string;
 };

export async function insertLocation(locationData: T_InsertLocationWithUserIdAndSlug) {
  const [created] = await db.insert(location).values(locationData).returning({ id: location.id, slug: location.slug, name: location.name });
  return created;
}

export async function getLocationsByUserId(userId: string) {
  const locations = await db.query.location.findMany({
    where: eq(location.userId, userId),
  });
  return locations;
}

export async function getLocation(slug: string, userId: string) {
  return await db.query.location.findFirst({
    where: and(
      eq(location.slug, slug),
      eq(location.userId, userId),
    ),
  });
}

export async function getLocationByNameAndUserId(name: string, userId: string) {
  return await db.query.location.findFirst({
    where: and(
      eq(location.name, name),
      eq(location.userId, userId),
    ),
  });
}

export async function getLocationBySlug(slug: string) {
  const location = await db.query.location.findFirst({
    where: (location, { eq }) => eq(location.slug, slug),
  });
  return location;
}

export async function findUniqueSlug(slug: string) {
  let existing = !!(await getLocationBySlug(slug));
  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await getLocationBySlug(idSlug));
    if (!existing) {
      return idSlug;
    }
  }
  return slug;
}
