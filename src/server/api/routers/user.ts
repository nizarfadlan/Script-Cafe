import { createUserSchema, paramsId, updateActiveSchema, updatePasswordSchema, updateUserSchema } from "@/server/user/user.schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createUserController, deleteOne, getAll, getOne, updateActiveUser, updatePassword, updateUser } from "@/server/user/user.controller";
import { paginationQuery } from "@/server/pagination/pagination.schema";

export const userRouter = createTRPCRouter({
  createUser: protectedProcedure
    .input(createUserSchema)
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== Role.Owner && ctx.session.user.role !== Role.Manajer) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create user",
        })
      }

      if (ctx.session.user.role === Role.Manajer && input.role === Role.Owner) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create user with owner role",
        })
      }

      return createUserController({ data: input });
    }),
  getAll: protectedProcedure
    .input(paginationQuery)
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== Role.Owner && ctx.session.user.role !== Role.Manajer) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create user",
        })
      }

      return getAll({ paginationQuery: input });
    }),
  getOne: protectedProcedure
    .input(paramsId)
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== Role.Owner && ctx.session.user.role !== Role.Manajer) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create user",
        });
      }

      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id is required",
        });
      }

      return getOne(input);
    }),
  updateActiveUser: protectedProcedure
    .input(updateActiveSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== Role.Owner && ctx.session.user.role !== Role.Manajer) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update user",
        })
      }

      if (!input.params.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id is required",
        })
      }

      const dataUserChange = await getOne({ id: input.params.id });

      if (ctx.session.user.role === Role.Manajer && dataUserChange.role === Role.Owner) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update user with owner role",
        })
      }

      return updateActiveUser(input);
    }),
  updateUser: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== Role.Owner && ctx.session.user.role !== Role.Manajer) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update user",
        })
      }

      if (!input.params.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id is required",
        })
      }

      const dataUserChange = await getOne({ id: input.params.id });

      if (ctx.session.user.role === Role.Manajer && dataUserChange.role === Role.Owner) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update user with owner role",
        })
      }

      return updateUser(input);
    }),
  updatePassword: protectedProcedure
    .input(updatePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== Role.Owner && ctx.session.user.role !== Role.Manajer) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update user",
        })
      }

      if (!input.params.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id is required",
        })
      }

      const dataUserChange = await getOne({ id: input.params.id });

      if (ctx.session.user.role === Role.Manajer && dataUserChange.role === Role.Owner) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update user with owner role",
        })
      }

      return updatePassword(input);
    }),
  deleteOne: protectedProcedure
    .input(paramsId)
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== Role.Owner && ctx.session.user.role !== Role.Manajer) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create user",
        })
      }

      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id is required",
        })
      }

      return deleteOne(input);
    }),
});
