import type { InternationalizationContext } from "@sapphire/plugin-i18next";
import type { ClientOptions } from "discord.js";

export const i18nOptions: ClientOptions["i18n"] = {
  fetchLanguage: async (context: InternationalizationContext) => {
    if (!context.interactionLocale) return "en-US";
    if (context.interactionLocale === "en") return "en-US"; // Removes the chance of picking en-AU instead of en-US
    if (context.interactionLocale) return context.interactionLocale;
    if (context.guild?.preferredLocale) return context.guild.preferredLocale;
    return "en-US";
  },
};
