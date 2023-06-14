import { z } from "zod";

export const status = z.enum([
  "all",
  "available",
  "active",
  "unavailable",
  "inactive",
  "deleted",
  "paid",
  "unpaid",
  "finish",
  "processing",
  "rejected",
]).optional();

export const paginationQuery = z.object({
  limit: z.number().optional().default(10),
  cursor: z.string().optional().nullish(),
  skip: z.number().optional(),
  search: z.string().optional(),
  status,
});

export type PaginationQueryInput = z.TypeOf<typeof paginationQuery>;
export type StatusData = z.TypeOf<typeof status>;
