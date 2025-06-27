import { z } from "zod";

export const SearchSchema = z.object({
  q: z.string().min(1, "You must enter a search term."),
});

export type SearchSchema = z.infer<typeof SearchSchema>;

export const NameSchema = z.string({ message: "Name is required" }).min(3, "Please provide a valid name of the location").max(100, "Name must be less than 100 characters").refine(val => val.trim() !== "", {
  message: "Name must not be empty",
});
export const DescriptionSchema = z.string({ message: "Description is required" }).min(10, "Description is required").max(120, "Description must be less than 500 characters").refine(val => val.trim() !== "", {
  message: "Description must not be empty",
});
export const LatSchema = z.coerce.number({ message: "Latitude must be a number between -90 and 90" }).min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90");
export const LongSchema = z.coerce.number({ message: "Longitude must be a number between -180 and 180" }).min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180");

export const DateSchema = z.number({
  message: "Date is required",
});
