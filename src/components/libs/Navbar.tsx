import { Navbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuToggle, useDisclosure } from "@nextui-org/react";
import DarkMode from "./DarkMode";
import AvatarUser from "./AvatarUser";
import { type Menu } from "../../types/menu.type";
import { MenuCollapseNavbar, MenuNavbar } from "./MenuNavbar";
import Config from "@/config/appConfig";
import { useState } from "react";
import ModalLogin from "../ModalLogin";

export default function NavbarComponent({
  items,
}: {
  items: Menu[],
}) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

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
          <DarkMode />
          <AvatarUser handlerModal={onOpen} />
        </NavbarContent>
        <NavbarMenu>
          <MenuCollapseNavbar items={items} />
        </NavbarMenu>
      </Navbar>
      <ModalLogin isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  )
}
