import * as z from "zod"
import { CompleteTransaction, relatedTransactionModel, CompleteBooking, relatedBookingModel } from "./index"

export const tableModel = z.object({
  id: z.string(),
  numberTable: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteTable extends z.infer<typeof tableModel> {
  transaction: CompleteTransaction[]
  booking: CompleteBooking[]
}

/**
 * relatedTableModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTableModel: z.ZodSchema<CompleteTable> = z.lazy(() => tableModel.extend({
  transaction: relatedTransactionModel.array(),
  booking: relatedBookingModel.array(),
}))
