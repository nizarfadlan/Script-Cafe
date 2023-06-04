import { type AppType, type AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Poppins } from "next/font/google";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import dynamic from "next/dynamic";
import Head from "next/head";

const poppins = Poppins({
  subsets: ["latin"],
  // weight: "100 900",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: "normal",
});

const Toaster = dynamic(
  () => import("react-hot-toast").then((c) => c.Toaster),
  {
    ssr: false,
  }
);

NProgress.configure({ showSpinner: false })
NProgress.configure({ easing: 'ease', speed: 500 })
NProgress.configure({ trickleSpeed: 800 })

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session | null }>) => {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <NextThemesProvider
          defaultTheme="system"
          attribute="class"
        >
          <Toaster />
          <Head>
            <meta
              key="viewport"
              content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
              name="viewport"
            />
          </Head>
          <Component className={poppins.className} {...pageProps} />
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
