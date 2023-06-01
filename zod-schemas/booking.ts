import * as z from "zod"
import { CompleteTable, relatedTableModel, CompleteTransaction, relatedTransactionModel } from "./index"

export const bookingModel = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  date: z.date(),
  paid: z.boolean(),
  finished: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tableId: z.string(),
})

export interface CompleteBooking extends z.infer<typeof bookingModel> {
  table: CompleteTable
  transaction?: CompleteTransaction | null
}

/**
 * relatedBookingModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedBookingModel: z.ZodSchema<CompleteBooking> = z.lazy(() => bookingModel.extend({
  table: relatedTableModel,
  transaction: relatedTransactionModel.nullish(),
}))
