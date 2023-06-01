import * as z from "zod"
import { CompletePackageItem, relatedPackageItemModel, CompleteTransactionOnPackage, relatedTransactionOnPackageModel } from "./index"

export const packageModel = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().int(),
  discountPercent: z.number().int().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
})

export interface CompletePackage extends z.infer<typeof packageModel> {
  items: CompletePackageItem[]
  transaction: CompleteTransactionOnPackage[]
}

/**
 * relatedPackageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedPackageModel: z.ZodSchema<CompletePackage> = z.lazy(() => packageModel.extend({
  items: relatedPackageItemModel.array(),
  transaction: relatedTransactionOnPackageModel.array(),
}))
