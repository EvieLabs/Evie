import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { withSentry } from "@sentry/nextjs";

type PlayerCosmetics = {
  activeCosmetics?: any;
  dev?: boolean;
  eviePlus?: boolean;
  media?: boolean;
  message?: string;
};

const prisma = new PrismaClient();

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const username = req.query.name as string;

  if (req.method === "GET") {
    handleGET(username, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// GET /api/getPlayerCosmetics?name=<username>
async function handleGET(
  username: string,
  res: NextApiResponse<PlayerCosmetics>
) {
  const lookup: AxiosResponse = await axios.get(
    `https://api.mojang.com/users/profiles/minecraft/${username}`
  );

  if (lookup.status === 200) {
    const uuid = lookup.data.id;
    const player = await prisma.player.findFirst({
      where: {
        uuid: String(uuid),
      },
    });

    if (player) {
      res.status(200).json({
        activeCosmetics: player.activeCosmetics,
        dev: player.dev,
        eviePlus: player.eviePlus,
        media: player.media,
      });
    } else {
      res.status(404).json({
        message: "Player not found",
      });
    }
  } else {
    res.status(404).json({
      message: "Player not found",
    });
  }
}

export default withSentry(handle);
