import { EvieEmbed } from "#classes/EvieEmbed";
import type { ContextMenuInteraction, GuildMember } from "discord.js";

module.exports = {
  data: {
    name: "User Info",
    type: 2,
  },
  async execute(i: ContextMenuInteraction) {
    if (!i.inGuild()) {
      return;
    }
    const m = i.options.getMember("user") as GuildMember;
    const e = await EvieEmbed(i.guild!);
    e.setTitle(`Member Info for ${m.user.tag}`);
    e.setThumbnail(m.user.displayAvatarURL());
    e.addField("User", `${m.user.tag} (${m.user.id})`);
    e.addField("Nickname", m.nickname || "None");
    e.addField(
      `Joined ${m.guild.name}`,
      m.joinedAt ? m.joinedAt.toLocaleString() : "Unknown"
    );
    e.addField(
      `Created Account`,
      m.user.createdAt ? m.user.createdAt.toLocaleString() : "Unknown"
    );
    e.addField("Bot", m.user.bot ? "Yes" : "No");
    e.addField("Roles", m.roles.cache.map((r) => r).join(", "));
    e.addField(
      "Permissions",
      capitalizeEachWord(
        m.permissions.toArray().join(", ").replace(/\_/g, " ").toLowerCase()
      )
    );
    i.reply({ embeds: [e] });
  },
};

function capitalizeEachWord(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
