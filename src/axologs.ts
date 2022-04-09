export const axo = {
  startupMsg(startupMsg: any) {
    console.log("\x1b[34m[Startup] \x1b[0m", startupMsg);
  },

  log(msg: any) {
    console.log("\x1b[36m[Evie] \x1b[0m", msg);
  },

  err(err: any) {
    console.log("\x1b[31m[ERROR] \x1b[0m", err);
  },

  i(i: any) {
    console.log("\x1b[36m[Interaction] \x1b[0m", i);
  },
};
