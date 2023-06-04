import React from "react";
import Document, { type DocumentContext, type DocumentInitialProps, Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps;
  }


  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="robots" content="index, follow" />
          <meta name="description" content="Script Cafe is a cafe that provides decent facilities that are useful for programmers" />
          <meta name="application-name" content="Script Cafe" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Script Cafe" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#A66344" />
          <meta name="msapplication-TileImage" content="/logo/logo-152x152.png"/>
          <meta name="msapplication-tap-highlight" content="no" />
          <link itemProp="thumbnailUrl" href="/logo/logo-256x256.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <meta name="theme-color" content="#B972E4" />
          <meta name="keywords" content="Script Cafe, Cafe, Programmer" />
          <link rel="author" content="Nizar" href="https://nizarfadlan.dev" />
          <link rel="canonical" href="https://scriptcafe.nizarfadlan.dev" />
          <link rel="icon" type="image/png" sizes="32x32" href="/logo/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/logo/favicon-16x16.png" />

          <meta property="og:type" content="website" />
          <meta property="og:title" content="Script Cafe" />
          <meta property="og:site_name" content="Script Cafe" />
          <meta property="og:description" content="Script Cafe is a cafe that provides decent facilities that are useful for programmers" />
          <meta property="og:url" content="https://scriptcafe.nizarfadlan.dev" />
          <meta property="og:image" content="/logo/logo-256x256.png" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Script Cafe" />
          <meta name="twitter:descripton" content="Script Cafe is a cafe that provides decent facilities that are useful for programmers" />
          <meta name="twitter:url" content="https://scriptcafe.nizarfadlan.dev" />
          <meta name="twitter:image" content="/logo/logo-256x256.png" />
          <meta name="twitter:creator" content="@ScriptCafe" />

          <link rel="apple-touch-icon" href="/logo/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-status-bar" content="#B972E4" />
        </Head>
        <body className="min-h-screen antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;
