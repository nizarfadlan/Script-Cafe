import { Prisma } from "@prisma/client";
import type { ParamsInput, CreateUserInput, UpdateActiveInput, UpdateUserInput, UpdatePasswordInput } from "./user.schema";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { prisma } from "../db";
import { PASSWORD_HASH_SALT } from "@/constants";
import { type PaginationQueryInput } from "../pagination/pagination.schema";

export async function createUserController({
  data,
}: {
  data: CreateUserInput
}) {
  try {
    const { email, password, passwordConfirm } = data;

    if (password !== passwordConfirm) throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Passwords do not match",
    });

    await isEmailCheckUnique(email);

    data.password = bcrypt.hashSync(password, PASSWORD_HASH_SALT);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        isActive: data.isActive,
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }
    }
    throw error;
  }
}

export async function getAll({
  paginationQuery,
}: {
  paginationQuery: PaginationQueryInput,
}) {
  try {
    const { limit, cursor, skip, search, status } = paginationQuery;
    const items = await prisma.user.findMany({
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
        isActive: status === "all" ? undefined : (status === "active" ? true : (status === "inactive" ? false : undefined)),
        deletedAt: status === "deleted" ? { not: null } : (status === "active" ? null : (status === "inactive" ? null : undefined)),
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return {
      users: items,
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
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  return user;
}

export async function updateActiveUser({
  params,
  body,
}: UpdateActiveInput) {
  const { id } = params;
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: body.isActive,
      deletedAt: body.deletedAt ? null : undefined,
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  return user;
}

export async function updateUser({
  params,
  body,
}: UpdateUserInput) {
  const { id } = params;
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: body,
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  return user;
}

export async function updatePassword({
  params,
  body,
}: UpdatePasswordInput) {
  const { id } = params;
  const dataUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!dataUser) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  const oldPasswordValid = await bcrypt.compare(body.oldPassword, dataUser.password);

  if (oldPasswordValid) {
    const passwordEncrypt = await bcrypt.hash(body.newPassword, PASSWORD_HASH_SALT);
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: passwordEncrypt
      },
    });

    return user;
  } else {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Wrong old password"
    })
  }
}

export async function deleteOne({
  id,
}: ParamsInput) {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    }
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  return user;
}

async function isEmailCheckUnique(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: { email: true },
  });

  if (user) throw new TRPCError({
    code: "CONFLICT",
    message: "Email already exists",
  })

  return true;
}
