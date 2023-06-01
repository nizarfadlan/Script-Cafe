import * as z from "zod"
import { CompleteMenuItem, relatedMenuItemModel, CompletePackage, relatedPackageModel } from "./index"

export const packageItemModel = z.object({
  itemId: z.string(),
  packageId: z.string(),
  quantity: z.number().int(),
  assignedAt: z.date(),
})

export interface CompletePackageItem extends z.infer<typeof packageItemModel> {
  item: CompleteMenuItem
  packages: CompletePackage
}

/**
 * relatedPackageItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedPackageItemModel: z.ZodSchema<CompletePackageItem> = z.lazy(() => packageItemModel.extend({
  item: relatedMenuItemModel,
  packages: relatedPackageModel,
}))
