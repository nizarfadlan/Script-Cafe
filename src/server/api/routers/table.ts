import { createTableSchema, paramsId, updateTableSchema } from "@/server/table/table.schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { createTableController, deleteTableController, getAll, getAllIdNumber, getOne, updateTableController } from "@/server/table/table.controller";
import { paginationQuery } from "@/server/pagination/pagination.schema";
import { TRPCError } from "@trpc/server";

export const tableRouter = createTRPCRouter({
  createTable: protectedProcedure
    .input(createTableSchema)
    .mutation(({ input }) => {
      return createTableController({ data: input });
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
  updateTable: protectedProcedure
    .input(updateTableSchema)
    .mutation(({ input }) => {
      if (!input.params.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item id is required",
        });
      }

      return updateTableController(input);
    }),
  deleteTable: protectedProcedure
    .input(paramsId)
    .mutation(({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item id is required",
        });
      }

      return deleteTableController(input);
    }),
});
