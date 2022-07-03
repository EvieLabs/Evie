module.exports = {
  apps: [
    {
      name: "bot",
      cwd: "services/bot",
      script: "dist/index.js",
    },
    {
      name: "api",
      cwd: "services/api",
      script: "dist/index.js",
    },
  ],
};
