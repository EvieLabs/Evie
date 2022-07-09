import { container } from "@sapphire/pieces";
import {
  CanManageGuildConfigRequest,
  GetGuildRequest,
  GetGuildResponse,
} from "../lib/grpc";

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

export async function fetchGuild(guildId: string) {
  const req = new GetGuildRequest().setGuildId(guildId);

  const res = await new Promise<GetGuildResponse.AsObject>((resolve, reject) =>
    container.guildStore.getGuild(req, (err, res) =>
      err ? reject(err) : resolve(res.toObject())
    )
  ).catch((err) => {
    throw err;
  });

  return res;
}
