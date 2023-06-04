import { Navbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuToggle, useDisclosure, Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem } from "@nextui-org/react";
import DarkMode from "./DarkMode";
import { type Menu } from "@/types/menu.type";
import { MenuCollapseNavbar, MenuNavbar } from "./MenuNavbar";
import Config from "@/config/appConfig";
import { useState } from "react";
import ModalLogin from "../ModalLogin";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function NavbarComponent({
  items,
}: {
  items: Menu[],
}) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { data: session, status } = useSession();
  const router = useRouter();

  const actionAvatar = async(key: string | React.Key) => {
    if (key === "signout") {
      await signOut({
        callbackUrl: "/",
      });
    } else if (key === "dashboard") {
      await router.push("/dashboard");
    } else if (key === "profile") {
      await router.push("/dashboard/profile");
    }
  }

  return (
    <>

      <Navbar
        position="floating"
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="xl"
        isBlurred
      >
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="hidden my-auto font-bold sm:block text-inherit">{Config.APP_NAME}</p>
        </NavbarBrand>
        <NavbarContent
          className="hidden gap-0 sm:flex"
        >
          <MenuNavbar items={items} />
        </NavbarContent>
        <NavbarContent
          justify="end"
        >
          <NavbarItem>
            <DarkMode />
          </NavbarItem>
          {status === "authenticated" && session ? (
            <Dropdown placement="bottom-end" backdropVariant="blur">
              <NavbarItem>
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    color="secondary"
                    size="md"
                    classNames={{
                      base: "w-10 h-10 text-base"
                    }}
                    src="/avatar.png"
                  />
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label="User menu actions"
                color="secondary"
                onAction={async(key: string | React.Key) => {
                  await actionAvatar(key)
                }}
              >
                <DropdownItem key="profile" className="gap-2 h-14">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{session.user.email}</p>
                </DropdownItem>
                <DropdownItem key="dashboard" showDivider>
                  Dashboard
                </DropdownItem>
                <DropdownItem key="signout" showDivider color="danger">
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <NavbarItem>
            <Button color="secondary" onPress={onOpen} aria-label="modal-login" className="min-w-max">
              Sign In
            </Button>
            <ModalLogin isOpen={isOpen} onOpenChange={onOpenChange} />
          </NavbarItem>
          )}
        </NavbarContent>
        <NavbarMenu>
          <MenuCollapseNavbar items={items} />
        </NavbarMenu>
      </Navbar>
    </>
  )
}
