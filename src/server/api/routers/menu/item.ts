import { createItemSchema, paramsId, updateAvailableItemSchema, updateItemSchema } from "@/server/menu/item/item.schema";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { createItemController, deleteItemController, getAll, getAllIdName, getOne, updateAvailableItemController, updateItemController } from "@/server/menu/item/item.controller";
import { paginationQuery } from "@/server/pagination/pagination.schema";
import { TRPCError } from "@trpc/server";

export const itemRouter = createTRPCRouter({
  createItem: protectedProcedure
    .input(createItemSchema)
    .mutation(({ input }) => {
      return createItemController({ data: input });
    }),
  getAll: protectedProcedure
    .input(paginationQuery)
    .query(({ input }) => {
      return getAll({ paginationQuery: input });
    }),
  getAllIdName: protectedProcedure
    .query(() => {
      return getAllIdName();
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
  updateItem: protectedProcedure
    .input(updateItemSchema)
    .mutation(({ input }) => {
      if (!input.params.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item id is required",
        });
      }

      return updateItemController(input);
    }),
  updateAvailableItem: protectedProcedure
    .input(updateAvailableItemSchema)
    .mutation(({ input }) => {
      if (!input.params.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item id is required",
        });
      }

      return updateAvailableItemController(input);
    }),
  deleteItem: protectedProcedure
    .input(paramsId)
    .mutation(({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item id is required",
        });
      }

      return deleteItemController(input);
    }),
});
