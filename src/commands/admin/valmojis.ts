import { Command } from "@sapphire/framework";
import axios from "axios";
import type { Message } from "discord.js";

export class ResetApp extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "valmojis",
      preconditions: ["OwnerOnly"],
    });
  }

  private readonly tiers = [
    {
      tier: 3,
      tierName: "IRON 1",
      division: "ECompetitiveDivision::IRON",
      divisionName: "IRON",
      color: "4f514fff",
      backgroundColor: "828282ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/3/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/3/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/3/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/3/ranktriangleupicon.png",
    },
    {
      tier: 4,
      tierName: "IRON 2",
      division: "ECompetitiveDivision::IRON",
      divisionName: "IRON",
      color: "4f514fff",
      backgroundColor: "828282ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/4/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/4/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/4/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/4/ranktriangleupicon.png",
    },
    {
      tier: 5,
      tierName: "IRON 3",
      division: "ECompetitiveDivision::IRON",
      divisionName: "IRON",
      color: "4f514fff",
      backgroundColor: "828282ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/5/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/5/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/5/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/5/ranktriangleupicon.png",
    },
    {
      tier: 6,
      tierName: "BRONZE 1",
      division: "ECompetitiveDivision::BRONZE",
      divisionName: "BRONZE",
      color: "a5855dff",
      backgroundColor: "7c5522ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/6/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/6/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/6/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/6/ranktriangleupicon.png",
    },
    {
      tier: 7,
      tierName: "BRONZE 2",
      division: "ECompetitiveDivision::BRONZE",
      divisionName: "BRONZE",
      color: "a5855dff",
      backgroundColor: "7c5522ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/7/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/7/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/7/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/7/ranktriangleupicon.png",
    },
    {
      tier: 8,
      tierName: "BRONZE 3",
      division: "ECompetitiveDivision::BRONZE",
      divisionName: "BRONZE",
      color: "a5855dff",
      backgroundColor: "7c5522ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/8/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/8/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/8/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/8/ranktriangleupicon.png",
    },
    {
      tier: 9,
      tierName: "SILVER 1",
      division: "ECompetitiveDivision::SILVER",
      divisionName: "SILVER",
      color: "bbc2c2ff",
      backgroundColor: "d1d1d1ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/9/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/9/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/9/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/9/ranktriangleupicon.png",
    },
    {
      tier: 10,
      tierName: "SILVER 2",
      division: "ECompetitiveDivision::SILVER",
      divisionName: "SILVER",
      color: "bbc2c2ff",
      backgroundColor: "d1d1d1ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/10/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/10/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/10/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/10/ranktriangleupicon.png",
    },
    {
      tier: 11,
      tierName: "SILVER 3",
      division: "ECompetitiveDivision::SILVER",
      divisionName: "SILVER",
      color: "bbc2c2ff",
      backgroundColor: "d1d1d1ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/11/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/11/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/11/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/11/ranktriangleupicon.png",
    },
    {
      tier: 12,
      tierName: "GOLD 1",
      division: "ECompetitiveDivision::GOLD",
      divisionName: "GOLD",
      color: "eccf56ff",
      backgroundColor: "eec56aff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/12/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/12/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/12/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/12/ranktriangleupicon.png",
    },
    {
      tier: 13,
      tierName: "GOLD 2",
      division: "ECompetitiveDivision::GOLD",
      divisionName: "GOLD",
      color: "eccf56ff",
      backgroundColor: "eec56aff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/13/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/13/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/13/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/13/ranktriangleupicon.png",
    },
    {
      tier: 14,
      tierName: "GOLD 3",
      division: "ECompetitiveDivision::GOLD",
      divisionName: "GOLD",
      color: "eccf56ff",
      backgroundColor: "eec56aff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/14/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/14/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/14/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/14/ranktriangleupicon.png",
    },
    {
      tier: 15,
      tierName: "PLATINUM 1",
      division: "ECompetitiveDivision::PLATINUM",
      divisionName: "PLATINUM",
      color: "59a9b6ff",
      backgroundColor: "00c7c0ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/15/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/15/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/15/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/15/ranktriangleupicon.png",
    },
    {
      tier: 16,
      tierName: "PLATINUM 2",
      division: "ECompetitiveDivision::PLATINUM",
      divisionName: "PLATINUM",
      color: "59a9b6ff",
      backgroundColor: "00c7c0ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/16/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/16/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/16/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/16/ranktriangleupicon.png",
    },
    {
      tier: 17,
      tierName: "PLATINUM 3",
      division: "ECompetitiveDivision::PLATINUM",
      divisionName: "PLATINUM",
      color: "59a9b6ff",
      backgroundColor: "00c7c0ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/17/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/17/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/17/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/17/ranktriangleupicon.png",
    },
    {
      tier: 18,
      tierName: "DIAMOND 1",
      division: "ECompetitiveDivision::DIAMOND",
      divisionName: "DIAMOND",
      color: "b489c4ff",
      backgroundColor: "763bafff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/18/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/18/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/18/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/18/ranktriangleupicon.png",
    },
    {
      tier: 19,
      tierName: "DIAMOND 2",
      division: "ECompetitiveDivision::DIAMOND",
      divisionName: "DIAMOND",
      color: "b489c4ff",
      backgroundColor: "763bafff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/19/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/19/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/19/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/19/ranktriangleupicon.png",
    },
    {
      tier: 20,
      tierName: "DIAMOND 3",
      division: "ECompetitiveDivision::DIAMOND",
      divisionName: "DIAMOND",
      color: "b489c4ff",
      backgroundColor: "763bafff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/20/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/20/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/20/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/20/ranktriangleupicon.png",
    },
    {
      tier: 21,
      tierName: "IMMORTAL 1",
      division: "ECompetitiveDivision::IMMORTAL",
      divisionName: "IMMORTAL",
      color: "bb3d65ff",
      backgroundColor: "ff5551ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/21/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/21/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/21/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/21/ranktriangleupicon.png",
    },
    {
      tier: 22,
      tierName: "IMMORTAL 2",
      division: "ECompetitiveDivision::IMMORTAL",
      divisionName: "IMMORTAL",
      color: "bb3d65ff",
      backgroundColor: "ff5551ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/22/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/22/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/22/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/22/ranktriangleupicon.png",
    },
    {
      tier: 23,
      tierName: "IMMORTAL 3",
      division: "ECompetitiveDivision::IMMORTAL",
      divisionName: "IMMORTAL",
      color: "bb3d65ff",
      backgroundColor: "ff5551ff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/23/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/23/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/23/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/23/ranktriangleupicon.png",
    },
    {
      tier: 24,
      tierName: "RADIANT",
      division: "ECompetitiveDivision::RADIANT",
      divisionName: "RADIANT",
      color: "ffffaaff",
      backgroundColor: "ffedaaff",
      smallIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/24/smallicon.png",
      largeIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/24/largeicon.png",
      rankTriangleDownIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/24/ranktriangledownicon.png",
      rankTriangleUpIcon:
        "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/24/ranktriangleupicon.png",
    },
  ];

  public override async messageRun(message: Message) {
    let done = 0;

    await new Promise<void>(async (resolve) => {
      if (!message.guild) {
        message.reply("This command can only be used in a guild.");
        resolve();
        return;
      }
      for (const tier of this.tiers) {
        const image = await axios.get(tier.largeIcon, {
          responseType: "arraybuffer",
        });
        const buffer = Buffer.from(image.data);
        const formattedTierName = tier.tierName
          .toLowerCase()
          .replace(/\s/g, "_");
        await message.guild.emojis.create(buffer, formattedTierName);
        done++;
        if (done === this.tiers.length) resolve();
      }
    });

    await message.reply("Done!");
  }
}
