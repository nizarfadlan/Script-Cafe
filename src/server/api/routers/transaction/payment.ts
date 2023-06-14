import { createPaymentSchema, paramsId, updatePaymentSchema } from "@/server/transaction/payment/payment.schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../trpc";
import { createPaymentController, deletePaymentController, getAll, getAllIdNumber, getOne, updatePaymentController } from "@/server/transaction/payment/payment.controller";
import { paginationQuery } from "@/server/pagination/pagination.schema";
import { TRPCError } from "@trpc/server";

export const paymentRouter = createTRPCRouter({
  createPayment: protectedProcedure
    .input(createPaymentSchema)
    .mutation(({ input }) => {
      return createPaymentController({ data: input });
    }),
  getAll: protectedProcedure
    .input(paginationQuery)
    .query(({ input }) => {
      return getAll({ paginationQuery: input });
    }),
  getAllIdName: publicProcedure
    .query(() => {
      return getAllIdNumber();
    }),
  getOne: protectedProcedure
    .input(paramsId)
    .query(({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item id is required",
        });
      }

      return getOne(input);
    }),
  updatePayment: protectedProcedure
    .input(updatePaymentSchema)
    .mutation(({ input }) => {
      if (!input.params.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item id is required",
        });
      }

      return updatePaymentController(input);
    }),
  deletePayment: protectedProcedure
    .input(paramsId)
    .mutation(({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item id is required",
        });
      }

      return deletePaymentController(input);
    }
  ),
});
