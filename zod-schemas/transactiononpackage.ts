import * as z from "zod"
import { CompletePackage, relatedPackageModel, CompleteTransaction, relatedTransactionModel } from "./index"

export const transactionOnPackageModel = z.object({
  packageId: z.string(),
  transactionId: z.string(),
  assignedAt: z.date(),
})

export interface CompleteTransactionOnPackage extends z.infer<typeof transactionOnPackageModel> {
  packages: CompletePackage
  transactions: CompleteTransaction
}

/**
 * relatedTransactionOnPackageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTransactionOnPackageModel: z.ZodSchema<CompleteTransactionOnPackage> = z.lazy(() => transactionOnPackageModel.extend({
  packages: relatedPackageModel,
  transactions: relatedTransactionModel,
}))
