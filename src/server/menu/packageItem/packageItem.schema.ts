import { z } from "zod";

const createPackage = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  price: z.number({
    required_error: "Price is required",
  }).int(),
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().int(),
  })),
  discountPercent: z.number().int().nullish(),
});

export const createPackageSchema = createPackage;

export const paramsId = z.object({
  id: z.string().nonempty(),
});

export const updatePackageSchema = z.object({
  params: paramsId,
  body: createPackage.pick({ name: true, price: true, discountPercent: true, items: true }),
});

export const enumStatusPackage = z.enum(["all", "available", "unavailable"]);

export type ParamsInput = z.TypeOf<typeof paramsId>;
export type CreatePackageInput = z.TypeOf<typeof createPackage>;
export type UpdatePackageInput = z.TypeOf<typeof updatePackageSchema>;
export type StatusPackage = z.TypeOf<typeof enumStatusPackage>;
