import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "../Layout";
import Unauthorize from "../libs/Unauthorize";
import { Menu } from "../../types/menu.type";
import NavbarComponent from "../libs/Navbar";
import { BookingIcon, FoodIcon, OrderIcon, PackageIcon, PaymentIcon } from "../libs/Icons";
import ImageBackground from "../libs/ImageBackground";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";
import { Spinner } from "@nextui-org/react";
import { Role } from "@prisma/client";
import type { LayoutProps } from "@/types/layout.type";

const Menu: Menu[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Users",
    href: "/dashboard/users",
    permissions: [Role.Owner, Role.Manajer]
  },
  {
    name: "Transaction",
    href: "#",
    dropdown: true,
    items: [
      {
        key: "booking",
        name: "Booking",
        href: "/dashboard/transaction/booking",
        icons: <BookingIcon fill="currentColor" size={30} />,
        description: "Manage and track incoming and completed bookings with ease using the booking menu",
      },
      {
        key: "payment",
        name: "Payment",
        href: "/dashboard/transaction/payment",
        icons: <PaymentIcon fill="currentColor" size={30} />,
        description: "Manage the types and ways of payment that can be made by customers",
        permissions: [Role.Owner, Role.Manajer]
      },
      {
        key: "order",
        name: "Order",
        href: "/dashboard/transaction/order",
        icons: <OrderIcon fill="currentColor" size={30} />,
        description: "Manage orders and view incoming or unfinished orders and order history",
      },
    ],
  },
  {
    name: "Menu",
    href: "#",
    dropdown: true,
    items: [
      {
        key: "item",
        name: "Item",
        href: "/dashboard/menu/item",
        icons: <FoodIcon fill="currentColor" size={30} />,
        description: "Manage existing menus and can also disable menus that appear to customers",
      },
      {
        key: "package",
        name: "Package",
        href: "/dashboard/menu/package",
        icons: <PackageIcon fill="currentColor" size={30} />,
        description: "Manage existing menu packages and can also disable menu packages that appear to customers",
      },
    ],
  }
];

export default function LayoutDashboard({
  title,
  children,
}: LayoutProps) {

  const { status } = useSession();
  const onTitle = `${title} - Dashboard`;

  if (status === "loading") {
    return (
      <>
        <Layout title="loading">
          <div className="flex justify-center">
            <Spinner color="secondary" />
          </div>
        </Layout>
      </>
    )
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Layout title="unauthorize">
          <Unauthorize />
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{onTitle}</title>
      </Head>
      <main className="min-h-screen">
        <NavbarComponent items={Menu} />
        <div className="container px-6 py-12 mx-auto md:px-4 lg:py-18 xl:px-14">{children}</div>
        <ImageBackground />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      session: await getSession(ctx),
    },
  };
}
