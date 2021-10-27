export {};
import { SlashCommandBuilder } from "@discordjs/builders";
const ee = require("../botconfig/embed.json");
const { MessageEmbed } = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bake")
    .setDescription("Bake stuff to make $EVIE")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("muffin")
        .setDescription("Bake a muffin!")
        .addStringOption((option) =>
          option
            .setName("oventype")
            .setDescription("What Oven type should we use?")
            .setRequired(true)
            .addChoice("Basic Oven", "basic")
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "muffin":
        await interaction.reply(
          "<a:loading:877782934696919040> Fetching Query"
        );

        let exampleEmbed = new MessageEmbed()
          .setColor("#0099ff")
          .setTimestamp()
          .setDescription("empty");

        let result = await cs.getUserItems({
          user: interaction.user,
        });

        let inv = result.inventory;
        async function noHas() {
          console.log("HE NO HAS THE STUFF");
          console.log(result.inventory);

          // Fetched!

          interaction.editReply("Fetched <:applesparkle:841615919428141066>");

          // Send Embed

          await interaction.editReply({ embeds: [exampleEmbed] });
        }

        if (JSON.stringify(result.inventory) === `[]`) {
          return noHas();
        }
        for (let key in inv) {
          if (inv[key].name == `Basic Oven`) {
            return has();
          } else {
            return noHas();
          }

          async function has() {
            console.log("HE HAS THE STUFF");
            console.log(result.inventory);

            // Fetched!

            interaction.editReply("Fetched <:applesparkle:841615919428141066>");

            // Send Embed

            await interaction.editReply({ embeds: [exampleEmbed] });
          }
        }
      //case "hi":
      //   await interaction.reply(`hi whats up`);
      //   break;
    }
  },
};
