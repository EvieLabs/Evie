// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  id: string;
  time: string;
  releaseTime: string;
  type: string;
  libraries: {
    name: string;
  }[];
  mainClass: string;
  minecraftArguments: string;
  assets: string;
  minimumLauncherVersion: number;
  inheritsFrom: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    id: "Evie",
    time: "2021-06-13T11:13:12+01:00",
    releaseTime: "2021-06-13T11:13:12+01:00",
    type: "release",
    libraries: [
      {
        name: "optifine:OptiFine:1.8.9_HD_U_M5",
      },
      {
        name: "com.evieclient:EvieClient:1.0.0",
      },
      {
        name: "optifine:launchwrapper-of:2.2",
      },
    ],
    mainClass: "net.minecraft.launchwrapper.Launch",
    minecraftArguments:
      "--username ${auth_player_name} --version ${version_name} --gameDir ${game_directory} --assetsDir ${assets_root} --assetIndex ${assets_index_name} --uuid ${auth_uuid} --accessToken ${auth_access_token} --userProperties ${user_properties} --userType ${user_type} --tweakClass optifine.OptiFineForgeTweaker --tweakClass com.evieclient.mixins.EvieTweaker",
    assets: "1.8",
    minimumLauncherVersion: 14,
    inheritsFrom: "1.8.9",
  });
}
