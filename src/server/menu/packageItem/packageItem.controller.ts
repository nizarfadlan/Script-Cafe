import { prisma } from "@/server/db";
import type { CreatePackageInput, ParamsInput, UpdatePackageInput } from "./packageItem.schema";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import type { PaginationQueryInput } from "@/server/pagination/pagination.schema";

export async function createPackageController({
  data,
}: {
  data: CreatePackageInput
}) {
  try {
    const packageItemsData = data.items.map(item => ({
      itemId: item.id,
      quantity: item.quantity
    }));

    const packageItem = await prisma.package.create({
      data: {
        name: data.name,
        price: data.price,
        items: {
          createMany: {
            data: packageItemsData,
          }
        },
      },
      include: {
        items: true
      }
    });

    return packageItem;
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
    const packageItems = await prisma.package.findMany({
      take: limit,
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
        deletedAt: status === "deleted"
          ? { not: null }
          : (
            status === "all"
              ? undefined
              : null
            ),
      },
      include: {
        items: {
          include: {
            item: true
          }
        }
      }
    });

    let filterPackageItems = packageItems;
    if (status === "available") {
      filterPackageItems = filterPackageItems.filter((packageItem) => {
        const allAvailable = packageItem.items.every(item => item.item.available);
        return allAvailable;
      })
    } else if (status === "unavailable") {
      filterPackageItems = filterPackageItems.filter((packageItem) => {
        const allAvailable = packageItem.items.every(item => item.item.available);
        return !allAvailable
      })
    }

    let nextCursor: typeof cursor | undefined = undefined;
    if (filterPackageItems.length > limit) {
      const nextItem = filterPackageItems.pop();
      nextCursor = nextItem?.id;
    }

    return {
      packageItems: filterPackageItems,
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
  const packageItem = await prisma.package.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          item: true
        }
      }
    }
  });

  if (!packageItem) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Package not found",
    });
  }

  return packageItem;
}

export async function updatePackageController({
  params,
  body,
}: UpdatePackageInput) {
  try {
    const { id } = params;
    const { name, price, items, discountPercent } = body;

    const packageItemsData = items.map(item => ({
      itemId: item.id,
      quantity: item.quantity
    }));

    const packageItem = await prisma.package.update({
      where: {
        id,
      },
      data: {
        name,
        price,
        items: {
          deleteMany: {},
          createMany: {
            data: packageItemsData,
          }
        },
        discountPercent,
      },
      include: {
        items: true
      }
    });

    return packageItem;
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

export async function deletePackageController({
  id,
}: ParamsInput) {
  try {
    const packageItem = await prisma.package.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      }
    });

    if (!packageItem) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Package not found",
      })
    }

    return packageItem;
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

export async function restorePackageController({
  id,
}: ParamsInput) {
  try {
    const packageItem = await prisma.package.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      }
    });

    if (!packageItem) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Package not found",
      })
    }

    return packageItem;
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
