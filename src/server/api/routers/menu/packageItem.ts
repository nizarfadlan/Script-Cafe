import { createPackageSchema, paramsId, updatePackageSchema } from "@/server/menu/packageItem/packageItem.schema";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { createPackageController, deletePackageController, getAll, getOne, restorePackageController, updatePackageController } from "@/server/menu/packageItem/packageItem.controller";
import { paginationQuery } from "@/server/pagination/pagination.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Package } from "@prisma/client";

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
  getAllWithId: protectedProcedure
    .input(z.array(paramsId))
    .query(async({ input }) => {
      const data: Package[] = [];
      for (const packageItem of input) {
        if (!packageItem.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Item id is required",
          });
        }

        const packageData = await getOne(packageItem);
        data.push(packageData);
      }

      return data;
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
