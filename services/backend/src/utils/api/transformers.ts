import { flattenGuild } from "#root/utils/api/ApiTransformers";
import type {
  OauthFlattenedGuild,
  PartialOauthFlattenedGuild,
  TransformedLoginData,
} from "#root/utils/api/types";
import type { EvieClient } from "@evie/internal";
import { container } from "@sapphire/framework";
import type { LoginData } from "@sapphire/plugin-api";
import type { RESTAPIPartialCurrentUserGuild } from "discord-api-types/v9";
import { Permissions, type Guild, type GuildMember } from "discord.js";
import { checkPerm } from "../misc/permChecks";

export async function transformOauthGuildsAndUser({
  user,
  guilds,
}: LoginData): Promise<TransformedLoginData> {
  if (!user || !guilds) return { user, guilds };

  const { client } = container;
  const userId = user.id;

  const transformedGuilds = await Promise.all(
    guilds.map((guild) => transformGuild(client, userId, guild))
  );
  return { user, transformedGuilds };
}

export async function canManage(
  guild: Guild,
  member: GuildMember
): Promise<boolean> {
  if (guild.ownerId === member.id) return true;

  return (
    (await checkPerm(member, Permissions.FLAGS.BAN_MEMBERS)) ||
    (await member.client.db.HasModRole(member))
  );
}

export async function getManageable(
  id: string,
  oauthGuild: RESTAPIPartialCurrentUserGuild,
  guild: Guild | undefined
): Promise<boolean> {
  if (oauthGuild.owner) return true;
  if (typeof guild === "undefined")
    return new Permissions(BigInt(oauthGuild.permissions)).has(
      Permissions.FLAGS.MANAGE_GUILD
    );

  const member = await guild.members.fetch(id).catch(() => null);
  if (!member) return false;

  return canManage(guild, member);
}

export async function transformGuild(
  client: EvieClient,
  userId: string,
  data: RESTAPIPartialCurrentUserGuild
): Promise<OauthFlattenedGuild> {
  const guild = client.guilds.cache.get(data.id);
  const serialized: PartialOauthFlattenedGuild =
    typeof guild === "undefined"
      ? {
          afkChannelId: null,
          afkTimeout: 0,
          applicationId: null,
          approximateMemberCount: null,
          approximatePresenceCount: null,
          available: true,
          banner: null,
          channels: [],
          defaultMessageNotifications: "ONLY_MENTIONS",
          description: null,
          widgetEnabled: false,
          explicitContentFilter: "DISABLED",
          icon: data.icon,
          id: data.id,
          joinedTimestamp: null,
          mfaLevel: "NONE",
          name: data.name,
          ownerId: data.owner ? userId : null,
          partnered: false,
          preferredLocale: "en-US",
          premiumSubscriptionCount: null,
          premiumTier: "NONE",
          roles: [],
          splash: null,
          systemChannelId: null,
          vanityURLCode: null,
          verificationLevel: "NONE",
          verified: false,
          iconURL: `https://cdn.discordapp.com/icons/${data.id}/${data.icon}.webp`,
        }
      : flattenGuild(guild);

  return {
    ...serialized,
    permissions: data.permissions,
    manageable: await getManageable(userId, data, guild),
    evieIsIn: typeof guild !== "undefined",
  };
}
