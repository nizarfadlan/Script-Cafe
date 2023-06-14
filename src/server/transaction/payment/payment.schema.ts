import { z } from "zod";

const createPayment = z.object({
  name: z.string({
    required_error: "Name payment is required",
  }),
  accountNumber: z.number({
    required_error: "Account number is required",
  }),
  active: z.boolean().optional(),
});

export const createPaymentSchema = createPayment;

export const paramsId = z.object({
  id: z.string().nonempty(),
});

export const updatePaymentSchema = z.object({
  params: paramsId,
  body: createPayment,
});

export type ParamsInput = z.TypeOf<typeof paramsId>;
export type CreatePaymentInput = z.TypeOf<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.TypeOf<typeof updatePaymentSchema>;
