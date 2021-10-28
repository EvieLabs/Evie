export {};
import { SlashCommandBuilder } from "@discordjs/builders";
const ee = require("../botconfig/embed.json");
import { MessageEmbed } from "discord.js";
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
    const os = "<:ovensheet:903162107313418272>";
    const dial = "<:ovendial:903161836185202758>";
    const scr1 = "<:ovenscr1:903161836155830302>";
    const scr2 = "<:ovenscr2:903161836164239380>";
    const scr3 = "<:ovenscr3:903161836143247400>";
    const c1 = "<:ovenc1:903162524139130960>";
    const cmid = "<:ovenc2:903162524118155346>";
    const c3 = "<:ovenc3:903162523954593815>";
    const empty = "<:ovencb:903162812912771082>";
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "muffin":
        await interaction.reply(
          "<a:loading:877782934696919040> Fetching Query"
        );

        let exampleEmbed = new MessageEmbed()
          .setColor("#0099ff")
          .setTimestamp()
          .setDescription("Error!");

        let result = await cs.getUserItems({
          user: interaction.user,
        });

        let inv = result.inventory;
        async function noHas() {
          exampleEmbed.setTitle("Hey you don't have a `Baisc Oven`");
          exampleEmbed.setDescription("You can buy one in the `/shop`");
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
            const muffin = "<:evmuffin:903163714495213658>";

            exampleEmbed.setDescription(
              `${os}${dial}${scr1}${scr2}${scr3}${os}\n${os}${c1}${cmid}${c3}${os}\n${os}${"COMMAND IN BETA"}${os}\n${os}${empty}${empty}${empty}${empty}${os}\n${empty}${empty}${empty}${empty}${empty}${empty}`
            );
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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function bake(food: string) {
  try {
    if ((food = "muffin")) {
      // Start Baking Timer
      await sleep(1000);
    }
  } catch (error) {
    console.log(error);
  }
}
