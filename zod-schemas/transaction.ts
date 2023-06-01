import * as z from "zod"
import { CompletePaymentType, relatedPaymentTypeModel, CompleteTransactionOnItem, relatedTransactionOnItemModel, CompleteTransactionOnPackage, relatedTransactionOnPackageModel, CompleteTable, relatedTableModel, CompleteBooking, relatedBookingModel } from "./index"

export const transactionModel = z.object({
  id: z.string(),
  total: z.number().int(),
  paid: z.boolean(),
  finished: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  paymentTypeId: z.string(),
  tableId: z.string().nullish(),
  bookingId: z.string().nullish(),
})

export interface CompleteTransaction extends z.infer<typeof transactionModel> {
  paymentType: CompletePaymentType
  items: CompleteTransactionOnItem[]
  packages: CompleteTransactionOnPackage[]
  table?: CompleteTable | null
  booking?: CompleteBooking | null
}

/**
 * relatedTransactionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTransactionModel: z.ZodSchema<CompleteTransaction> = z.lazy(() => transactionModel.extend({
  paymentType: relatedPaymentTypeModel,
  items: relatedTransactionOnItemModel.array(),
  packages: relatedTransactionOnPackageModel.array(),
  table: relatedTableModel.nullish(),
  booking: relatedBookingModel.nullish(),
}))
