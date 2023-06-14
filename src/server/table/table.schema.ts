import { z } from "zod";

const createTable = z.object({
  numberTable: z.string({
    required_error: "Number table is required",
  }),
});

export const createTableSchema = createTable;

export const paramsId = z.object({
  id: z.string().nonempty(),
});

export const updateTableSchema = z.object({
  params: paramsId,
  body: createTable,
});

export type ParamsInput = z.TypeOf<typeof paramsId>;
export type CreateTableInput = z.TypeOf<typeof createTableSchema>;
export type UpdateTableInput = z.TypeOf<typeof updateTableSchema>;
