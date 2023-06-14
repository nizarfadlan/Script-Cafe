import { z } from "zod";

const createBooking = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  phone: z.string({
    required_error: "Phone is required",
  }),
  date: z.date({
    required_error: "Date is required",
  }),
  tableId: z.string({
    required_error: "Table is required",
  }),
})
