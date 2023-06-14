import { z } from "zod";

const createItem = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  price: z.number({
    required_error: "Price is required",
  }).int(),
  available: z.boolean().optional(),
  discountPercent: z.number().optional(),
});

export const createItemSchema = createItem;

export const paramsId = z.object({
  id: z.string().nonempty(),
});

const recoverySchema = z.object({
  deletedAt: z.boolean().optional(),
});

export const updateItemSchema = z.object({
  params: paramsId,
  body: createItem.pick({ name: true, price: true, discountPercent: true }),
});

export const updateAvailableItemSchema = z.object({
  params: paramsId,
  body: recoverySchema.merge(createItem.pick({ available: true })),
});

export type ParamsInput = z.TypeOf<typeof paramsId>;
export type CreateItemInput = z.TypeOf<typeof createItem>;
export type UpdateItemInput = z.TypeOf<typeof updateItemSchema>;
export type UpdateAvailableItemInput = z.TypeOf<typeof updateAvailableItemSchema>;
