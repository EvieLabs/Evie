import { embed } from "../tools";
import { axo } from "../axologs";
import * as evie from "../tools";
import { ContextMenuInteraction, GuildMember, Role } from "discord.js";
module.exports = {
  data: {
    name: "Revoke Player",
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
    if (!m.roles.cache.has("878074525223378974")) {
      return i.reply({
        content: "You can only revoke players who have been accepted!",
        ephemeral: true,
      });
    }
    const r: Role = i.guild!.roles.cache.find(
      (r) => r.id == "878074525223378974"
    ) as Role;
    const br: Role = i.guild!.roles.cache.find(
      (r) => r.id == "904148775801585676"
    ) as Role;
    const e = await evie.embed(i.guild!);

    e.setTitle("Revoked!");
    e.setDescription(
      `Oh no! ${m} You were revoked by ${i.user}, you can appeal later by making a ticket <#884223699778150400>`
    );

    await m?.roles
      .remove(r, `Revoked by ${i.user}`)
      .then(() => {
        m?.roles.add(br, `Revoked by ${i.user}`);
        i.reply({ embeds: [e], content: `${m} Oh!` });
      })
      .catch(() => {
        i.reply({ content: "Failed! Tell Tristan asap", ephemeral: true });
      });
  },
};
