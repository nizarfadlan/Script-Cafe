import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../trpc";
import { createOrderSchema, itemsOrPackage, paramsId, updateOrderSchema, updateStatusSchema } from "@/server/transaction/order/order.schema";
import { countDiscountAndTotal, createOrderController, getAll, getOne, updateOrderController, updateStatusController } from "@/server/transaction/order/order.controller";
import { paginationQuery } from "@/server/pagination/pagination.schema";
import { TRPCError } from "@trpc/server";

export const orderRouter = createTRPCRouter({
  getSummary: publicProcedure
    .input(itemsOrPackage)
    .query(({ input }) => {
      return countDiscountAndTotal({ data: input });
    }),
  createOrder: publicProcedure
    .input(createOrderSchema)
    .mutation(({ input }) => {
      return createOrderController({ data: input });
    }),
  getOneAll: publicProcedure
    .input(paramsId)
    .query(({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Order id is required",
        });
      }

      return getOne({
        id: input.id,
        all: true
      });
    }),
  getOne: publicProcedure
    .input(paramsId)
    .query(({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Order id is required",
        });
      }

      return getOne({
        id: input.id,
        all: false
      });
    }),
  getAll: protectedProcedure
    .input(paginationQuery)
    .query(({ input }) => {
      return getAll({ paginationQuery: input });
    }),
  updateStatus: protectedProcedure
    .input(updateStatusSchema)
    .mutation(({ input }) => {
      if (!input.params.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Order id is required",
        });
      }

      return updateStatusController(input);
    }),
  updateOrder: protectedProcedure
    .input(updateOrderSchema)
    .mutation(({ input }) => {
      if (!input.params.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Order id is required",
        });
      }

      return updateOrderController(input);
    }),
});
