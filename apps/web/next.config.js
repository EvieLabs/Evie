/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      /*
       * TeamEvie Link Shortcuts
       */

      {
        source: "/discord",
        destination: "https://discord.gg/VKaNS86wEN",
        permanent: true,
      },
      {
        source: "/bot",
        destination: "https://eviebot.rocks",
        permanent: false, // Migrating eviebot.rocks soon to this repo
      },
      {
        source: "/team",
        destination: "https://github.com/EvieClient",
        permanent: false,
      },
      {
        source: "/qwdl", // Quick Windows Download Link
        destination: "https://evie.pw/api/downloads/latest?platform=win",
        permanent: false,
      },
      {
        source: "/qwml", // Quick Mac Download Link
        destination: "https://evie.pw/api/downloads/latest?platform=mac",
        permanent: false,
      },
      {
        source: "/twitter",
        destination: "https://twitter.com/EvieClient",
        permanent: false,
      },

      /*
       * Personal Link Shortcuts
       */

      {
        source: "/tristan",
        destination: "https://github.com/twisttaan",
        permanent: false, // Once https://tristancamejo.com/ is finished, this will be permanent
      },
      {
        source: "/urcutewallpapers",
        destination:
          "https://gist.github.com/twisttaan/4b4163185bf6f803bba8f5677202b0dd",
        permanent: false,
      },
      {
        source: "/tsmp",
        destination: "https://tristansmp.com",
        permanent: true, // Once https://tristancamejo.com/ is finished, this will be permanent
      },
    ];
  },
};

module.exports = nextConfig;
