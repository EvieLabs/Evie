import type {
  ApplicationCommandChannelOptionData,
  ApplicationCommandChoicesData,
  ApplicationCommandNonOptionsData,
} from "discord.js";

const airport: (
  | ApplicationCommandNonOptionsData
  | ApplicationCommandChannelOptionData
  | ApplicationCommandChoicesData
)[] = [
  {
    name: "channel",
    description: "The channel to send Airport messages to",
    required: false,
    type: "CHANNEL",
    channelTypes: ["GUILD_TEXT"],
  },
  {
    name: "arrives",
    description: "Send a message when someone joins",
    required: false,
    type: "BOOLEAN",
  },
  {
    name: "arrive-message",
    description: "The description of the embed when someone joins",
    required: false,
    type: "STRING",
  },
  {
    name: "departs",
    description: "Send a message when someone leaves",
    required: false,
    type: "BOOLEAN",
  },
  {
    name: "depart-message",
    description: "The description of the embed when someone leaves",
    required: false,
    type: "STRING",
  },
  {
    name: "join-role",
    description: "The role to give when someone joins",
    required: false,
    type: "ROLE",
  },
  {
    name: "ping",
    description: "Ping the person in their join message",
    required: false,
    type: "BOOLEAN",
  },
];

const evie: (
  | ApplicationCommandNonOptionsData
  | ApplicationCommandChannelOptionData
  | ApplicationCommandChoicesData
)[] = [
  {
    name: "mod-role",
    description: "Role that gives permission to moderator commands.",
    required: false,
    type: "ROLE",
  },
  {
    name: "log-channel",
    description: "The channel to send non-moderation-case logs to.",
    required: false,
    type: "CHANNEL",
    channelTypes: ["GUILD_TEXT"],
  },
  {
    name: "case-channel",
    description: "The channel to send moderation-case logs to.",
    required: false,
    type: "CHANNEL",
    channelTypes: ["GUILD_TEXT"],
  },
];

export const configOptions = {
  airport,
  evie,
};
