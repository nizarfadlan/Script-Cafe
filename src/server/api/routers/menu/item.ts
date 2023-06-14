import { createItemSchema, paramsId, updateAvailableItemSchema, updateItemSchema } from "@/server/menu/item/item.schema";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { createItemController, deleteItemController, getAll, getAllIdName, getOne, updateAvailableItemController, updateItemController } from "@/server/menu/item/item.controller";
import { paginationQuery } from "@/server/pagination/pagination.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { MenuItem } from "@prisma/client";

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
  getAllWithId: protectedProcedure
    .input(z.array(paramsId))
    .query(async({ input }) => {
      const data: MenuItem[] = [];
      for (const item of input) {
        if (!item.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Item id is required",
          });
        }

        const itemData = await getOne(item);
        data.push(itemData);
      }

      return data;
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
