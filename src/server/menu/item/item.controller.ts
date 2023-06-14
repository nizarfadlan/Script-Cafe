import { TRPCError } from "@trpc/server";
import type { CreateItemInput, ParamsInput, UpdateAvailableItemInput, UpdateItemInput } from "./item.schema";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import type { PaginationQueryInput } from "@/server/pagination/pagination.schema";

export async function createItemController({
  data,
}: {
  data: CreateItemInput
}) {
  try {
    const item = await prisma.menuItem.create({
      data,
    });

    return item;
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

export async function getAllIdName() {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
      }
    });

    return items;
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
    const items = await prisma.menuItem.findMany({
      take: limit + 1,
      skip,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        id: "asc",
      },
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
        available: status === "all" ? undefined : (status === "available" ? true : (status === "unavailable" ? false : undefined)),
        deletedAt: status === "deleted" ? { not: null } : (status === "available" ? null : (status === "unavailable" ? null : undefined)),
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return {
      items,
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
  const item = await prisma.menuItem.findUnique({
    where: {
      id,
    },
  });

  if (!item) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Item not found",
    });
  }

  return item;
}

export async function updateItemController({
  params,
  body,
}: UpdateItemInput) {
  try {
    const { id } = params;
    const item = await prisma.menuItem.update({
      where: {
        id,
      },
      data: body,
    });

    if (!item) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Item not found",
      })
    }

    return item;
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

export async function updateAvailableItemController({
  params,
  body,
}: UpdateAvailableItemInput) {
  try {
    const { id } = params;
    const item = await prisma.menuItem.update({
      where: {
        id,
      },
      data: {
        available: body.available,
        deletedAt: body.deletedAt ? null : undefined,
      },
    });

    if (!item) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Item not found",
      })
    }

    return item;
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

export async function deleteItemController({
  id,
}: ParamsInput) {
  try {
    const item = await prisma.menuItem.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      }
    });

    if (!item) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Item not found",
      })
    }

    return item;
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
