import { MicrosoftAccount, MicrosoftAuth } from "minecraft-auth";
import type { NextApiRequest, NextApiResponse } from "next";
type oauth_token = {
  token_type?: string;
  expires_in?: number;
  scope?: string;
  access_token?: string;
  refresh_token?: string;
  user_id?: string;
  foci?: string;
  error?: string;
  username?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<oauth_token>
) {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).json({
      error: "No code provided",
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
      await account.authFlow(code);
      await account.getProfile();
    } catch (e: any) {
      if (e.message === "User don't have minecraft on his account!") {
        res.status(400).json({
          error: "User doesn't have minecraft on their account!",
        });
        return;
      }
    }

    res.status(200).json({
      token_type: "bearer",
      expires_in: 86400,
      scope: "XboxLive.signin",
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
      user_id: account.uuid,
      foci: "1",
      username: account.username,
    });
  }
}
