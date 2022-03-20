import type { DefaultThemeOptions, ViteBundlerOptions } from "vuepress-vite";
import { defineUserConfig } from "vuepress-vite";
import sidebar from "./sidebar";

const config = defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
  bundler: "@vuepress/vite",
  lang: "en-US",
  title: "Evie",
  description:
    "Evie is a feature-rich, easy to use Discord bot built to deliver the best experience of a bot on Discord!",
  head: [
    ["meta", { charset: "utf-8" }],
    [
      "meta",
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    ],
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#7289DA" }],
    ["meta", { name: "twitter:card", content: "summary" }],
    ["meta", { property: "og:title", content: "Evie Docs" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Evie is a feature-rich, easy to use Discord bot built to deliver the best experience of a bot on Discord!",
      },
    ],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:url", content: "https://docs.eviebot.rocks/" }],
    ["meta", { property: "og:locale", content: "en_US" }],
  ],
  themeConfig: {
    contributors: false,
    repo: "TeamEvie/Evie",
    docsDir: "apps/docs/docs",
    sidebar,
    sidebarDepth: 3,
    editLinks: true,
    lastUpdated: true,
    navbar: [
      {
        text: "Support Server",
        link: "https://evie.pw/discord",
      },
      {
        text: "Invite Evie",
        link: "https://evie.pw/invite",
      },
    ],
    themePlugins: {
      mediumZoom: false,
    },
  },
  plugins: [],
});

export default config;
