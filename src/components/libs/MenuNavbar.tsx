import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, NavbarItem, NavbarMenuItem } from "@nextui-org/react";
import type { Menu } from "@/types/menu.type";
import { usePathname } from "next/navigation";
import NextLink from "./NextLink";
import { useRouter } from "next/router";
import { ChevronDownIcon, IconsDefault } from "./Icons";
import React from "react";
import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";

export function MenuNavbar({
  items
}: {
  items: Menu[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();

  return (
    <>
      {items.map((menu, index) => (
        <React.Fragment key={index}>
          {
          (
            menu.permissions &&
            menu.permissions.includes(data?.user.role as Role)
          ) ||
          !menu.permissions
            ? (
              <>
                {menu.dropdown && menu.items !== undefined ?
                  <>
                    <Dropdown showArrow backdropVariant="opaque" closeOnSelect key={menu.href}>
                      <NavbarItem>
                        <DropdownTrigger>
                          <Button
                            endIcon={<ChevronDownIcon fill="currentColor" size={16} />}
                            variant="light"
                          >
                            {menu.name}
                          </Button>
                        </DropdownTrigger>
                      </NavbarItem>
                      <DropdownMenu
                        className="w-[340px]"
                        itemStyles={{
                          base: "gap-4",
                          wrapper: "py-3",
                        }}
                        aria-label={`Dropdown ${menu.name}`}
                        onAction={(item) => {
                          menu.items?.map(async(itemData) => {
                            if (itemData.key == item) {
                              await router.push(itemData.href);
                            }
                          });
                        }}
                      >
                        {menu.items.filter(
                            (item) =>
                              (item.permissions &&
                                item.permissions.includes(data?.user?.role as Role)) ||
                              !item.permissions
                          ).map((item) => (
                          <DropdownItem
                            key={item.key}
                            description={item.description}
                            startContent={
                              item.icons ? (
                                item.icons
                              ) : (
                                <IconsDefault fill="currentColor" size={35} />
                              )
                            }
                          >
                            {item.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </>
                :
                <NextLink href={menu.href} key={menu.href}>
                    <NavbarItem className="px-4" as={Link} color={pathname === menu.href ? "secondary" : "foreground"} isActive={pathname == menu.href}>
                      {menu.name}
                    </NavbarItem>
                  </NextLink>
                }
              </>
            ) : null}
        </React.Fragment>
      ))}
    </>
  );
}

export function MenuCollapseNavbar({
  items
}: {
  items: Menu[];
}) {
  const pathname = usePathname();
  const { data } = useSession();

  return (
    <>
      {items.map((menu, index) => (
        <React.Fragment key={`${index}-${menu.href}-${menu.name}`}>
          {
          (
            menu.permissions &&
            menu.permissions.includes(data?.user.role as Role)
          ) ||
          !menu.permissions
            ? (
              <>
                {menu.href !== "#" ?
                  <NavbarMenuItem>
                    <NextLink href={menu.href}>
                      <Link
                        size="lg"
                        color={
                          pathname === menu.href ? "secondary" : "foreground"
                        }
                      >
                        {menu.name}
                      </Link>
                    </NextLink>
                  </NavbarMenuItem>
                :
                  null
                }
                {menu.dropdown && menu.items !== undefined ?
                  <>
                    {menu.items.map((item, index) => (
                      <React.Fragment key={`${index}-${item.key}-${item.name}`}>
                        {
                        (
                          item.permissions &&
                          item.permissions.includes(data?.user.role as Role)
                        ) ||
                        !item.permissions
                          ? (
                          <>
                            <NavbarMenuItem>
                              <NextLink href={item.href}>
                                <Link
                                  size="lg"
                                  color={
                                    pathname === menu.href ? "secondary" : "foreground"
                                  }
                                >
                                  {item.name}
                                </Link>
                              </NextLink>
                            </NavbarMenuItem>
                          </>
                        ) : null}
                      </React.Fragment>
                    ))}
                  </>
                  :
                  null
                }
              </>
            ) : null}
        </React.Fragment>
      ))}
    </>
  );
}
