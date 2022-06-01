import { container } from "@sapphire/framework";
import type { InternationalizationContext } from "@sapphire/plugin-i18next";
import type { ClientOptions } from "discord.js";

export const i18nOptions: ClientOptions["i18n"] = {
  fetchLanguage: async (context: InternationalizationContext) => {
    if (!context.interactionLocale) return "en-US";
    if (context.interactionLocale === "en") return "en-US"; // Removes the chance of picking en-AU instead of en-US

    let langCode = "en-US";

    container.i18n.languages.forEach((_, languageFolderName) => {
      if (languageFolderName.startsWith(`${context.interactionLocale}`)) {
        langCode = languageFolderName;
      }
    });

    return langCode;
  },
};
