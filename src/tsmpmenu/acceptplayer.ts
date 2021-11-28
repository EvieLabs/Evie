import { embed } from "../tools";
import { axo } from "../axologs";
import * as evie from "../tools";
import { ContextMenuInteraction, GuildMember, Role } from "discord.js";
module.exports = {
  data: {
    name: "Accept Player",
    type: 2,
  },
  async execute(i: ContextMenuInteraction) {
    if (!i.inGuild()) {
      return;
    }
    const mem: GuildMember = i.member! as GuildMember;
    if (!mem.roles.cache.has("819442569128706068")) {
      return i.reply({
        content: "You are not a staff member!",
        ephemeral: true,
      });
    }
    const m = i.options.getMember("user") as GuildMember;
    const r: Role = i.guild!.roles.cache.find(
      (r) => r.id == "878074525223378974"
    ) as Role;
    const e = await evie.embed(i.guild!);
    const ji =
      "https://discord.com/channels/819106797028769844/819446614568599582/884646964074020905";
    e.setTitle("Accepted!");
    e.setDescription(
      `Good News! ${m} You were accepted by ${i.user}, you can read the join info [here](${ji}) if you don't know the server info yet.
       Anyways you must go onto the **Minecraft server** and type \`/discord link\` and dm the code to <@864676306662195200> so I can link your Minecraft Account with your Discord here`
    );
    e.addField(
      "Known Issue(s)",
      `* Running \`/discord link\` on Lunar Client makes you get the invite for the official Lunar Client Discord,
       just run the command on vanilla and come back if Lunar is your preferred way to play.`
    );
    e.addField(
      "Proximity Voice Chat",
      "To use Proximity Voice Chat in Game you must download the [optional modpack](https://discord.com/channels/819106797028769844/819676385727217664/889387219939381320) that brings with it, we do use simple voice chat mod except we use a specific version and the mod pack is usually easier for most and includes other important mods like performance buffs."
    );
    await m?.roles
      .add(r)
      .then(() => {
        i.reply({ embeds: [e] });
      })
      .catch(() => {
        i.reply({ content: "Failed! Tell Tristan asap", ephemeral: true });
      });
  },
};
