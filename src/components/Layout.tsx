import Head from "next/head";
import NavbarComponent from "./libs/Navbar";
import Config from "@/config/appConfig";
import ImageBackground from "./libs/ImageBackground";
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
  menu = Menu,
}: LayoutProps) {
  const onTitle = `${title} - ${Config.APP_NAME}`;

  return (
    <>
      <Head>
        <title>{onTitle}</title>
      </Head>
      <main className="min-h-screen">
        <NavbarComponent items={menu} />
        <div className="container px-6 py-12 mx-auto md:px-4 lg:py-18 xl:px-14">{children}</div>
        <ImageBackground />
      </main>
    </>
  )
}
