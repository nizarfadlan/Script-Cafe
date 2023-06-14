import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import type { CreateTableInput, ParamsInput, UpdateTableInput } from "./table.schema";
import { TRPCError } from "@trpc/server";
import type { PaginationQueryInput } from "../pagination/pagination.schema";

export async function createTableController({
  data,
}: {
  data: CreateTableInput,
}) {
  try {
    const table = await prisma.table.create({
      data,
    });

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

export async function getAllIdNumber() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        numberTable: true,
      }
    });

    return tables;
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
    const { limit, cursor, skip, search } = paginationQuery;
    const tables = await prisma.table.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        numberTable: {
          contains: search,
          mode: "insensitive",
        },
      },
      take: limit + 1,
      skip,
      cursor: cursor ? {
        id: cursor,
      } : undefined,
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (tables.length > limit) {
      const nextItem = tables.pop();
      nextCursor = nextItem?.id;
    }

    return {
      tables,
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
  const table = await prisma.table.findUnique({
    where: {
      id,
    },
  });

  if (!table) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Table not found",
    });
  }

  return table;
}

export async function updateTableController({
  params,
  body,
}: UpdateTableInput) {
  try {
    const { id } = params;
    const table = await prisma.table.update({
      where: {
        id,
      },
      data: body,
    });

    if (!table) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Table not found",
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

export async function deleteTableController({
  id
}: ParamsInput) {
  try {
    const table = await prisma.table.delete({
      where: {
        id,
      },
    });

    if (!table) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Table not found",
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
