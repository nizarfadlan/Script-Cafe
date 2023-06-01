import type { Role } from "@prisma/client";

export type ChildMenu = {
  key: string,
  name: string,
  href: string,
  icons?: string,
  description?: string,
  permissions?: Role[] | undefined,
}

export type Menu = {
  name: string,
  href: string,
  dropdown?: boolean,
  items?: ChildMenu[],
  permissions?: Role[] | undefined,
}
