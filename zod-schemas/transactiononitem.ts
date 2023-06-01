import * as z from "zod"
import { CompleteMenuItem, relatedMenuItemModel, CompleteTransaction, relatedTransactionModel } from "./index"

export const transactionOnItemModel = z.object({
  itemId: z.string(),
  transactionId: z.string(),
  assignedAt: z.date(),
})

export interface CompleteTransactionOnItem extends z.infer<typeof transactionOnItemModel> {
  items: CompleteMenuItem
  transactions: CompleteTransaction
}

/**
 * relatedTransactionOnItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTransactionOnItemModel: z.ZodSchema<CompleteTransactionOnItem> = z.lazy(() => transactionOnItemModel.extend({
  items: relatedMenuItemModel,
  transactions: relatedTransactionModel,
}))
