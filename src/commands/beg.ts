import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for some $EVIE"),
  async execute(interaction, client) {
    // Axolotl Fetching Mechanic

    await interaction.reply("<a:loading:877782934696919040> Fetching Query");

    let exampleEmbed = new MessageEmbed().setColor("#0099ff").setTimestamp();

    let result = await cs.beg({
      user: interaction.user,
      minAmount: 100,
      maxAmount: 400,
    });
    if (result.error) {
      const c = "`";
      const begMsg = [
        `Woof! stop begging! but do it again in ${result.time}`,
        `Woof! You homeless or something? But do it again in ${result.time}`,
        `Woof! Get a job and do something more productive, but you can beg again in ${result.time}`,
        `Woof! Could you be more lazy, seriously begging is for losers! Wait ${result.time}`,
        `Woof! Get yo fat ass off the beg command and get yo self a job you slob! I recommend ${c}/bake${c} Wait ${result.time}`,
      ];
      const index = Math.floor(Math.random() * (begMsg.length - 1) + 1);
      exampleEmbed.setDescription(begMsg[index]);
    } else {
      const c = "`";
      const begMsg = [
        `Wooooooo! Elon just invested <:eviecoin:900886713096888371> ${result.amount} into you!`,
        `omg tristan just ran ${c}/give ${interaction.user.username} $EVIE ${result.amount}${c}`,
        `Discord had no other options but to donate ${result.amount} $EVIE to you!`,
        `<:eviecoin:900886713096888371> ${result.amount} go brrrrrrrr`,
        `A chad just walked past you and threw ${result.amount} $EVIE at you to impress the crowd`,
        `i mean you can have ${result.amount} $EVIE cause that aint gonna hurt me brokey`,
        `Get good and have ${result.amount} $EVIE for legit no reason other then running ${c}/beg${c}`,
      ];
      const index = Math.floor(Math.random() * (begMsg.length - 1) + 1);
      exampleEmbed.setDescription(begMsg[index]);
    }

    exampleEmbed.setFooter(`Imagine begging lol`);

    // Fetched!

    interaction.editReply("Fetched <:applesparkle:841615919428141066>");

    // Send Embed

    await interaction.editReply({ embeds: [exampleEmbed] });
  },
};
