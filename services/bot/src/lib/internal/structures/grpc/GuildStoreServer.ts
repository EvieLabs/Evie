import {
  CanManageGuildConfigRequest,
  CanManageGuildConfigResponse,
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
};
