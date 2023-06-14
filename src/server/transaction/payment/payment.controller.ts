import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/server/db";
import type { CreatePaymentInput, ParamsInput, UpdatePaymentInput } from "./payment.schema";
import type { PaginationQueryInput } from "@/server/pagination/pagination.schema";

export async function createPaymentController({
  data,
}: {
  data: CreatePaymentInput,
}) {
  try {
    const payment = await prisma.paymentType.create({
      data,
    });

    return payment;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message,
      });
    }

    throw err;
  }
}

export async function getAllIdNumber() {
  try {
    const payment = await prisma.paymentType.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: true,
        accountNumber: true,
      },
      where: {
        active: true,
      }
    });

    return payment;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message,
      });
    }

    throw err;
  }
}

export async function getAll({
  paginationQuery,
}: {
  paginationQuery: PaginationQueryInput,
}) {
  try {
    const { limit, cursor, skip, search, status } = paginationQuery;
    const payments = await prisma.paymentType.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
        active: status === "all" ? undefined : status === "active" ? true : false,
      },
      take: limit + 1,
      skip,
      cursor: cursor ? {
        id: cursor,
      } : undefined,
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (payments.length > limit) {
      const nextItem = payments.pop();
      nextCursor = nextItem?.id;
    }

    return {
      payments,
      nextCursor,
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message,
      });
    }

    throw err;
  }
}

export async function getOne({
  id,
}: ParamsInput) {
  const payment = await prisma.paymentType.findUnique({
    where: {
      id,
    },
  });

  if (!payment) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Payment not found",
    });
  }

  return payment;
}

export async function updatePaymentController({
  params,
  body,
}: UpdatePaymentInput) {
  try {
    const { id } = params;
    const payment = await prisma.paymentType.update({
      where: {
        id,
      },
      data: body,
    });

    if (!payment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Payment not found",
      })
    }

    return payment;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message,
      });
    }

    throw err;
  }
}

export async function deletePaymentController({
  id
}: ParamsInput) {
  try {
    const table = await prisma.paymentType.delete({
      where: {
        id,
      },
    });

    if (!table) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Payment not found",
      })
    }

    return table;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message,
      });
    }

    throw err;
  }
}
