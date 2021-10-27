module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem();
  },
};
