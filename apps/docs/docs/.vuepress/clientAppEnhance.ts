import {
  DiscordButton,
  DiscordButtons,
  DiscordEmbed,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordInteraction,
  DiscordMarkdown,
  DiscordMention,
  DiscordMessage,
  DiscordMessages,
  DiscordReaction,
  DiscordReactions,
  install as DiscordMessageComponents,
} from "@discord-message-components/vue";
import "@discord-message-components/vue/dist/style.css";
import { defineClientAppEnhance } from "@vuepress/client";

export default defineClientAppEnhance(({ app }) => {
  app.use(DiscordMessageComponents, {
    avatars: {
      evie: "https://docs.eviebot.rocks/images/EvieAvatar.png",
      tristan:
        "https://cdn.discordapp.com/avatars/97470053615673344/a_687f01f835717fdcd41a2596908fe877.gif",
    },
    profiles: {
      evie: {
        author: "Evie",
        avatar: "evie",
        bot: true,
      },
      tristan: {
        author: "tristan",
        avatar: "tristan",
        bot: true,
      },
    },
  });

  app.component("DiscordButton", DiscordButton);
  app.component("DiscordButtons", DiscordButtons);
  app.component("DiscordEmbed", DiscordEmbed);
  app.component("DiscordEmbedField", DiscordEmbedField);
  app.component("DiscordEmbedFields", DiscordEmbedFields);
  app.component("DiscordInteraction", DiscordInteraction);
  app.component("DiscordMarkdown", DiscordMarkdown);
  app.component("DiscordMention", DiscordMention);
  app.component("DiscordMessage", DiscordMessage);
  app.component("DiscordMessages", DiscordMessages);
  app.component("DiscordReaction", DiscordReaction);
  app.component("DiscordReactions", DiscordReactions);
});
