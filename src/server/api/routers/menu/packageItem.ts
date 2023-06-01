import { createPackageSchema, paramsId, updatePackageSchema } from "@/server/menu/packageItem/packageItem.schema";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { createPackageController, deletePackageController, getAll, getOne, restorePackageController, updatePackageController } from "@/server/menu/packageItem/packageItem.controller";
import { paginationQuery } from "@/server/pagination/pagination.schema";
import { TRPCError } from "@trpc/server";

export const packageRouter = createTRPCRouter({
  createPackage: protectedProcedure
    .input(createPackageSchema)
    .mutation(({ input }) => {
      return createPackageController({ data: input });
    }),
  getAll: protectedProcedure
    .input(paginationQuery)
    .query(({ input }) => {
      return getAll({ paginationQuery: input });
    }),
  getOne: protectedProcedure
    .input(paramsId)
    .query(({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Package item id is required",
        });
      }

      return getOne(input);
    }),
  updatePackage: protectedProcedure
    .input(updatePackageSchema)
    .mutation(({ input }) => {
      if (!input.params.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Package item id is required",
        });
      }

      return updatePackageController(input);
    }),
  deletePackage: protectedProcedure
    .input(paramsId)
    .mutation(({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Package item id is required",
        });
      }

      return deletePackageController(input);
    }),
  restorePackage: protectedProcedure
    .input(paramsId)
    .mutation(({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Package item id is required",
        });
      }

      return restorePackageController(input);
    }),
});
