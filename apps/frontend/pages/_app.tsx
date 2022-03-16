import type { AppProps } from "next/app";
import Head from "next/head";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/main.css";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta property="og:title" content="Evie" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eviebot.rocks/" />
        <meta
          property="og:image"
          content="https://eviebot.rocks/assets/Banner.png"
        />
        <meta
          property="og:description"
          content="It's time to use Evie in your Discord server! Evie is a feature-rich, easy to use Discord bot built to deliver the best experience of a bot on Discord!"
        />
        <meta name="theme-color" content="#7289DA" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Evie" />
        <meta name="application-name" content="Evie" />
        <meta name="msapplication-TileColor" content="#9f00a7" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Banner />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
