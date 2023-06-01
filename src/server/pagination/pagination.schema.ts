import { z } from "zod";

const status = z.enum(["all", "available", "unavailable", "deleted"]).optional();

export const paginationQuery = z.object({
  limit: z.number().optional().default(10),
  cursor: z.string().nullish(),
  skip: z.number().optional(),
  search: z.string().optional(),
  status,
})

export type PaginationQueryInput = z.TypeOf<typeof paginationQuery>;
export type StatusData = z.TypeOf<typeof status>;
