export {};
import { SlashCommandBuilder } from "@discordjs/builders";
const ee = require("../botconfig/embed.json");
import { Interaction, MessageEmbed } from "discord.js";
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
import { MessageActionRow, MessageButton } from "discord.js";
var staged: String = "stage";

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

        // Make Confirm Button

        const confirm = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Confirm")
            .setStyle("PRIMARY")
            .setCustomId("confirmbm")
        );

        // Send Embed w/ Embed

        let exampleEmbed = new MessageEmbed()
          .setColor("#0099ff")
          .setTimestamp()
          .setDescription("Error!");

        exampleEmbed.setTitle(`Are you sure?`);
        exampleEmbed.setDescription(
          `To bake a muffin you **MUST** buy the ingredients that cost 500 $EVIE`
        );
        exampleEmbed.setFooter(
          `the button can only be clicked by the person who ran the command`
        );
        interaction.editReply("Fetched <:applesparkle:841615919428141066>");
        interaction.editReply({
          embeds: [exampleEmbed],
          components: [confirm],
        });

        const firstButton = interaction;

        async function expireIt(interaction) {
          if (staged == "stage") {
            const expired = new MessageActionRow().addComponents(
              new MessageButton()
                .setLabel("Expired!")
                .setStyle("PRIMARY")
                .setCustomId("expire")
                .setDisabled()
            );
            console.log(
              interaction.editReply({
                embeds: [exampleEmbed],
                components: [expired],
              })
            );
          }
        }

        // Listen for Button

        const filter = (i) =>
          i.customId === "confirmbm" && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 15000,
        });

        collector.on("collect", async (i) => {
          if (i.customId === "confirmbm") {
            bakeMuffin(i);
          }
        });

        collector.on("end", (collected) => expireIt(firstButton));
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

async function bakeMuffin(interaction) {
  staged = "staged";
  await interaction.update({
    content: `<a:loading:877782934696919040> Fetching Query`,
    embeds: [],
    components: [],
  });
  const os = "<:ovensheet:903162107313418272>";
  const dial = "<:ovendial:903161836185202758>";
  const scr1 = "<:ovenscr1:903161836155830302>";
  const scr2 = "<:ovenscr2:903161836164239380>";
  const scr3 = "<:ovenscr3:903161836143247400>";
  const c1 = "<:ovenc1:903162524139130960>";
  const cmid = "<:ovenc2:903162524118155346>";
  const c3 = "<:ovenc3:903162523954593815>";
  const empty = "<:ovencb:903162812912771082>";

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
      await bake(`muffin`, interaction)
        .then((data) =>
          exampleEmbed.setDescription(
            `${os}${dial}${scr1}${scr2}${scr3}${os}\n${os}${c1}${cmid}${cmid}${c3}${os}\n${os}${data}${os}\n${os}${empty}${empty}${empty}${empty}${os}\n${os}${os}${os}${os}${os}${os}`
          )
        )
        .catch((error) => console.log(error));

      exampleEmbed.setTitle(
        `Cooking Muffins in ${interaction.user.username}'s Basic Oven`
      );
      exampleEmbed.addField(`Estimated Time`, `2 Minutes`);

      // Fetched!

      interaction.editReply("Fetched <:applesparkle:841615919428141066>");

      // Send Embed

      await interaction.editReply({ embeds: [exampleEmbed] });
    }
  }
}

async function bake(food: string, interaction: any) {
  try {
    const empty = "<:ovencb:903162812912771082>";
    if ((food = "muffin")) {
      const muffin = "<:evmuffin:903163714495213658>";
      bakeIt(food, interaction);
      return `${muffin}${empty}${empty}${empty}`;
    }
  } catch (error) {
    console.log(error);
  }
}
async function bakeIt(food: string, interaction: any) {
  try {
    if ((food = "muffin")) {
      // Start Baking Timer
      await sleep(120000); // 2 min baking timer

      await cs.addMoney({
        user: interaction.user,
        amount: 10000,
        wheretoPutMoney: "wallet",
      });
      await cs.buy({
        user: interaction.user,
        item: 2,
      });

      let exampleEmbed = new MessageEmbed().setColor("#0099ff").setTimestamp();
      let c = "`";

      exampleEmbed.setTitle(`Baked!`);
      exampleEmbed.setDescription(
        `Hey ${interaction.user.username}! I pulled your muffins out the oven cause they were finished! You should sell them now with ${c}/sell <item id>${c} (Find the item id out with ${c}/inventory${c})`
      );
      exampleEmbed.setThumbnail(
        `https://cdn.discordapp.com/attachments/885135206435151872/903557876986052658/chocolate-chip-muffins-featured.jpg`
      );

      interaction.channel.send({
        content: `Hey! ${interaction.user}`,
        embeds: [exampleEmbed],
      });
    }
  } catch (error) {
    console.log(error);
  }
}
