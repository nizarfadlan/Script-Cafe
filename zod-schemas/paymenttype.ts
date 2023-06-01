import * as z from "zod"
import { CompleteTransaction, relatedTransactionModel } from "./index"

export const paymentTypeModel = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePaymentType extends z.infer<typeof paymentTypeModel> {
  transaction: CompleteTransaction[]
}

/**
 * relatedPaymentTypeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedPaymentTypeModel: z.ZodSchema<CompletePaymentType> = z.lazy(() => paymentTypeModel.extend({
  transaction: relatedTransactionModel.array(),
}))
