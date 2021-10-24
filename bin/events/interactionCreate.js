"use strict";
module.exports = {
    name: "interactionCreate",
    execute(interaction) {
        const { axo } = require("../axologs");
        axo.i(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    },
};
