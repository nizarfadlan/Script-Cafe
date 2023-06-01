import Head from "next/head";
import NavbarComponent from "./libs/Navbar";
import ModalLogin from "./ModalLogin";
import { useSession } from "next-auth/react";
import Config from "@/config/appConfig";
import ImageBackground from "./libs/ImageBackground";
import { useDisclosure } from "@nextui-org/react";
import type { LayoutProps } from "@/types/layout.type";

const Menu = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Menu",
    href: "/menu",
  },
  {
    name: "About",
    href: "/about",
  }
];

export default function Layout({
  title,
  children,
}: LayoutProps) {
  const { status } = useSession();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const onTitle = `${title} - ${Config.APP_NAME}`;

  return (
    <>
      <Head>
        <title>{onTitle}</title>
      </Head>
      <main className="min-h-screen">
        <NavbarComponent items={Menu} handlerModal={onOpen} />
        { status === "authenticated" ?
          null
        :
          <ModalLogin isOpen={isOpen} onOpenChange={onOpenChange} />
        }
        <div className="container px-6 py-12 mx-auto md:px-4 lg:py-18 xl:px-14">{children}</div>
        <ImageBackground />
      </main>
    </>
  )
}
