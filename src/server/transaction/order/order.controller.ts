import { Prisma } from "@prisma/client";
import type { CreateOrderInput, ItemsOrPackage, ParamsInput, UpdateOrderInput, UpdateStatusInput } from "./order.schema";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/server/db";
import type { PaginationQueryInput } from "@/server/pagination/pagination.schema";

async function filterItemAndGetDiscountTotal(items: ItemsOrPackage) {
  const itemsFilter = items.filter((item) => item.id.startsWith("MI")).map((item) => ({
    itemId: item.id,
    quantity: item.quantity,
  }));
  const packagesFilter = items.filter((item) => item.id.startsWith("PM")).map((packageMenu) => ({
    packageId: packageMenu.id,
    quantity: packageMenu.quantity,
  }));

  const {discount, total} = await countDiscountAndTotal({ data: items });

  return {
    items: itemsFilter,
    packages: packagesFilter,
    discount,
    total,
  }
}

export async function createOrderController({
  data,
}: {
  data: CreateOrderInput;
}) {
  try {
    const { items, packages, discount, total } = await filterItemAndGetDiscountTotal(data.items);

    const order = await prisma.transaction.create({
      data: {
        total: total - discount,
        items: {
          createMany: {
            data: items,
          },
        },
        packages: {
          createMany: {
            data: packages,
          },
        },
        tableId: data.tableId,
        paymentTypeId: data.paymentTypeId,
      },
      include: {
        items: true,
        packages: true,
      },
    });

    return order;
  }  catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message,
      });
    }

    throw err;
  }
}

export async function countDiscountAndTotal({
  data,
}: {
  data: ItemsOrPackage;
}) {
  let discount = 0;
  let total = 0;

  const items = data.filter((item) => item.id.startsWith("MI"));
  const packages = data.filter((item) => item.id.startsWith("PM"));

  if (items.length > 0) {
    for(const item of items) {
      const itemData = await prisma.menuItem.findUnique({
        where: {
          id: item.id,
        },
        select: {
          price: true,
          discountPercent: true,
        },
      });

      if (itemData) {
        total += itemData.price * item.quantity;
        discount += (itemData.discountPercent ? ((itemData.discountPercent/100) * itemData.price) : 0) * item.quantity;
      }
    }
  }

  if (packages.length > 0) {
    for(const item of packages) {
      const itemData = await prisma.package.findUnique({
        where: {
          id: item.id,
        },
        select: {
          price: true,
          discountPercent: true,
        },
      });

      if (itemData) {
        total += itemData.price * item.quantity;
        discount += (itemData.discountPercent ? ((itemData.discountPercent/100) * itemData.price) : 0) * item.quantity;
      }
    }
  }

  return {
    discount,
    total,
  };
}

export async function getAll({
  paginationQuery,
}: {
  paginationQuery: PaginationQueryInput,
}) {
  try {
    const { limit, cursor, skip, search, status } = paginationQuery;
    const items = await prisma.transaction.findMany({
      take: limit + 1,
      skip,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        table: {
          numberTable: {
            contains: search,
          },
        },
        paymentType: {
          name: {
            contains: search,
          },
        },
        paid: (status === "paid" || status === "processing"
              ? true
              : (
                status === "unpaid"
                ? false
                : undefined
                )
              ),
        finished: (status === "finish"
                  ? true
                  : (
                    status === "processing"
                    ? false
                    : undefined
                    )
                  ),
      },
      include: {
        items: true,
        packages: true,
        table: true,
        paymentType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return {
      order: items,
      nextCursor,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error.message,
      });
    }

    throw error;
  }
}

export async function getOne({
  id,
  all
}: ParamsInput & { all: boolean }) {
  const order = await prisma.transaction.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
      packages: true,
      table: all,
      paymentType: all,
    },
  });

  if (!order) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Order not found",
    })
  }

  return order;
}

export async function updateStatusController({
  params,
  body,
}: UpdateStatusInput) {
  try {
    const order = await prisma.transaction.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!order) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Order not found",
      })
    }

    await prisma.transaction.update({
      where: {
        id: params.id,
      },
      data: {
        paid: body === "unpaid" ? true : order.paid,
        finished: (
          body === "paid" && order.paid
          ? true
          : (
            body === "unpaid"
            ? false
            : (
              body === "finish"
              ? false
              : order.finished
            )
          )
        ),
      },
    });

    return order;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error.message,
      });
    }

    throw error;
  }
}

export async function updateOrderController({
  params,
  body,
}: UpdateOrderInput) {
  try {
    const { id } = params;
    const { tableId, items: itemsInput, paymentTypeId } = body;

    const { items, packages, discount, total } = await filterItemAndGetDiscountTotal(itemsInput);

    const order = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        total: total - discount,
        items: {
          deleteMany: {},
          createMany: {
            data: items,
          },
        },
        packages: {
          deleteMany: {},
          createMany: {
            data: packages,
          },
        },
        tableId: tableId,
        paymentTypeId: paymentTypeId,
      },
      include: {
        items: true,
        packages: true,
      },
    });

    return order;
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
