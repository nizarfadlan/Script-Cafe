import * as z from "zod"
import { CompletePackageItem, relatedPackageItemModel, CompleteTransactionOnItem, relatedTransactionOnItemModel } from "./index"

export const menuItemModel = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().int(),
  discountPercent: z.number().int().nullish(),
  available: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
})

export interface CompleteMenuItem extends z.infer<typeof menuItemModel> {
  packages: CompletePackageItem[]
  transaction: CompleteTransactionOnItem[]
}

/**
 * relatedMenuItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedMenuItemModel: z.ZodSchema<CompleteMenuItem> = z.lazy(() => menuItemModel.extend({
  packages: relatedPackageItemModel.array(),
  transaction: relatedTransactionOnItemModel.array(),
}))
