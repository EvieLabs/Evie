import type { InternationalizationContext } from "@sapphire/plugin-i18next";
import type { ClientOptions } from "discord.js";

export const i18nOptions: ClientOptions["i18n"] = {
  fetchLanguage: async (context: InternationalizationContext) => {
    if (context.interactionLocale) {
      if (context.interactionLocale.startsWith("en")) return "en-US"; // Removes the chance of picking en-AU instead of en-US
      return context.interactionLocale;
    }
    if (context.guild?.preferredLocale) return context.guild.preferredLocale;
    return "en-US";
  },
};
