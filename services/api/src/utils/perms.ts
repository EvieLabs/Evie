import { container } from "@sapphire/pieces";
import { CanManageGuildConfigRequest } from "../lib/grpc";

export async function canManageGuild(userId: string, guildId: string) {
  const req = new CanManageGuildConfigRequest()
    .setUserId(userId)
    .setGuildId(guildId);

  const res = await new Promise<boolean>((resolve) =>
    container.guildStore.canManageGuildConfig(req, (err, res) =>
      err ? resolve(false) : resolve(res.toObject().canManage)
    )
  );

  return res;
}
