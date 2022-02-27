export const axo = {
  startupMsg: function (startupMsg: any) {
    console.log("\x1b[34m[Startup] \x1b[0m", startupMsg);
    return;
  },

  log: function (msg: any) {
    console.log("\x1b[36m[Evie] \x1b[0m", msg);
    return;
  },

  err: function (err: any) {
    console.log("\x1b[31m[ERROR] \x1b[0m", err);
    return;
  },

  i: function (i: any) {
    console.log("\x1b[36m[Interaction] \x1b[0m", i);
    return;
  },
};
