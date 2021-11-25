import { ButtonInteraction, GuildMember, Permissions, Role } from "discord.js";
import { axo } from "../axologs";
import * as evie from "../tools";

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(i: ButtonInteraction) {
    if (i.isButton()) {
      const rid = i.customId.substring(2);
      try {
        if (i.customId.substring(0, 2) == "RR") {
          const r: Role = i.guild!.roles.cache.find((r) => r.id == rid) as Role;

          const m: GuildMember = i.guild!.members.cache.get(i.user.id)!;

          if (i.guild?.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            if (r.editable) {
              if (m.roles.cache.has(r.id)) {
                m.roles.remove(r);
                const e = await evie.embed(i.guild!);
                e.setDescription(`You no longer have ${r}`);
                i.reply({ embeds: [e], ephemeral: true });
              } else {
                m.roles.add(r);
                const e = await evie.embed(i.guild!);
                e.setDescription(`You now have ${r}`);
                i.reply({ embeds: [e], ephemeral: true });
              }
            } else {
              const e = await evie.embed(i.guild);
              e.setDescription(
                "Error: Please make sure my Role is above the role you want to give out."
              );
              await i.reply({ embeds: [e] });
            }
          } else {
            const e = await evie.embed(i.guild!);
            e.setDescription(
              "Error: I don't have the Manage Roles permission."
            );
            await i.reply({ embeds: [e] });
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  },
};
