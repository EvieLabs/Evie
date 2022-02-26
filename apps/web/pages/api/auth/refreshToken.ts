import { MicrosoftAccount, MicrosoftAuth } from "minecraft-auth";
import type { NextApiRequest, NextApiResponse } from "next";
type refresh_token = {
  refreshToken?: string;
  accessToken?: string;
  error?: string;
  username?: string;
  uuid?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<refresh_token>
) {
  const refresh = req.query.refresh as string;
  const accessToken = req.query.access as string;
  if (!refresh) {
    res.status(400).json({
      error: "No refresh token provided",
    });
    return;
  } else {
    const appID = "79d63740-a433-4f6d-8c3d-19f997d868b8";
    const appSecret = process.env.AZURE_SECRET;
    MicrosoftAuth.setup(
      appID,
      appSecret,
      "http://localhost:9998/auth/microsoft"
    );
    const account = new MicrosoftAccount();
    try {
      account.accessToken = accessToken;
      account.refreshToken = refresh;
      await account.refresh();
      await account.getProfile();

      res.status(200).json({
        refreshToken: account.refreshToken,
        accessToken: account.accessToken,
        username: account.username,
        uuid: account.uuid,
      });
    } catch (e: any) {
      res.status(400).json({
        error: "Something went wrong",
      });
      return;
    }
  }
}
