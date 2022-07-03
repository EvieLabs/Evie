module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "services/bot",
      script: "dist/index.js",
    },
    {
      name: "park",
      cwd: "services/api",
      script: "dist/index.js",
    },
  ],
};
