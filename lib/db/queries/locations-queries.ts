import { and, desc, eq, sql } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import type { T_InsertLocation, T_SelectLocation } from "~/lib/db/schema/location";

import db from "~/lib/db";
import { location } from "~/lib/db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

 type T_InsertLocationWithUserIdAndSlug = T_InsertLocation & {
   userId: string;
   slug: string;
 };

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export async function insertLocation(locationData: T_InsertLocationWithUserIdAndSlug) {
  const [created] = await db.insert(location).values(locationData).returning({ id: location.id, slug: location.slug, name: location.name, lat: location.lat, long: location.long });
  return created;
}

export async function getLocationsByUserId(userId: string) {
  const locations = await db.query.location.findMany({
    where: eq(location.userId, userId),
    columns: {
      id: true,
      name: true,
      slug: true,
      lat: true,
      long: true,
    },
    orderBy: [desc(location.createdAt)],
  });
  return locations;
}

export async function getPaginatedLocations(userId: string, { page, limit }: PaginationParams): Promise<PaginatedResult<T_SelectLocation>> {
  const offset = (page - 1) * limit;

  // Get total count for pagination metadata
  const [totalResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(location)
    .where(eq(location.userId, userId));

  const total = totalResult?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  // Get paginated data
  const locations = await db.query.location.findMany({
    where: eq(location.userId, userId),
    limit,
    offset,
    orderBy: [desc(location.createdAt)],
  });

  return {
    data: locations,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
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
