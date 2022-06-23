module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "services/backend",
      script: "dist/index.js",
    },
    {
      name: "park",
      cwd: "services/park",
      script: "dist/index.js",
    },
  ],
};
