module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem();
    // cs.addItem({
    //   inventory: {
    //     name: "Muffin", // item name
    //     price: 10000, // item price
    //   },
    // });
  },
};
