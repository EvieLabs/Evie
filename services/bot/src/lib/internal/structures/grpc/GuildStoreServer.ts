import {
  CanManageGuildConfigRequest,
  CanManageGuildConfigResponse,
  GetGuildRequest,
  GetGuildResponse,
  IGuildStoreServer,
} from "@evie/grpc";
import type { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import type { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { EvieSharder } from "../../extensions/EvieSharder";

export const GuildStoreServer: IGuildStoreServer = {
  canManageGuildConfig: async (
    call: ServerUnaryCall<CanManageGuildConfigRequest, Empty>,
    callback: sendUnaryData<CanManageGuildConfigResponse>
  ): Promise<void> => {
    const res = new CanManageGuildConfigResponse();

    res.setCanManage(false);

    try {
      const { guildId, userId } = call.request.toObject();

      const mutualShard = EvieSharder.getInstance().shardForGuildId(guildId);

      const can = await mutualShard.eval(
        async (c, { guildId, userId }) => {
          const guild = await c.guilds.fetch(guildId);
          const member = await guild.members.fetch(userId);

          return c.gate.canManageGuildConf(member);
        },
        {
          guildId,
          userId,
        }
      );

      res.setCanManage(can);

      callback(null, res);
    } catch (error) {
      console.error(error);
      callback(null, res);
    }
  },
  getGuild: async (
    call: ServerUnaryCall<GetGuildRequest, Empty>,
    callback: sendUnaryData<GetGuildResponse>
  ): Promise<void> => {
    const res = new GetGuildResponse();

    try {
      const { guildId } = call.request.toObject();

      const mutualShard = EvieSharder.getInstance().shardForGuildId(guildId);

      const data = await mutualShard.eval(
        async (c, { guildId }) => {
          const guild = await c.guilds.fetch(guildId);
          return guild;
        },
        {
          guildId,
        }
      );

      res.setGuildId(data.id);
      res.setName(data.name);
      res.setIcon(data.icon || "");
      res.setOwnerId(data.ownerId);
      res.setDescription(data.description || "");

      callback(null, res);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  },
};
