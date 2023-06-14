import { status } from "@/server/pagination/pagination.schema";
import { z } from "zod";

// index 0 is for item, index 1 is for package item
export const itemsOrPackage = z.array(z.object({
  id: z.string(),
  quantity: z.number().int(),
}));

const createOrder = z.object({
  tableId: z.string({
    required_error: "Table is required",
  }),
  items: itemsOrPackage,
  paymentTypeId: z.string({
    required_error: "Payment type is required",
  }),
});

export const createOrderSchema = createOrder;

export const paramsId = z.object({
  id: z.string().nonempty(),
});

export const updateOrderSchema = z.object({
  params: paramsId,
  body: createOrder,
});

export const updateStatusSchema = z.object({
  params: paramsId,
  body: status
});

export type ItemsOrPackage = z.TypeOf<typeof itemsOrPackage>;
export type ParamsInput = z.TypeOf<typeof paramsId>;
export type CreateOrderInput = z.TypeOf<typeof createOrderSchema>;
export type UpdateOrderInput = z.TypeOf<typeof updateOrderSchema>;
export type UpdateStatusInput = z.TypeOf<typeof updateStatusSchema>;
