import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withSentry } from "@sentry/nextjs";
import { MicrosoftAccount, MicrosoftAuth } from "minecraft-auth";

type PlayerCosmetics = {
  activeCosmetics?: any;
  dev?: boolean;
  eviePlus?: boolean;
  media?: boolean;
  message?: string;
};

const prisma = new PrismaClient();

async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization == null) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  if (req.query.cid == null) {
    return res.status(401).json({
      message: "No cape ID provided",
    });
  }
  const cid = req.query.cid as string;
  const userToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers.authorization?.split(" ")[2];

  const appID = "79d63740-a433-4f6d-8c3d-19f997d868b8";
  const appSecret = process.env.AZURE_SECRET;
  MicrosoftAuth.setup(appID, appSecret, "http://localhost:9998/auth/microsoft");

  const account = new MicrosoftAccount();

  try {
    account.refreshToken = refreshToken;
    account.accessToken = userToken;
    await account.refresh();
    console.log("valid:", await account.checkValidToken());
    await account.getProfile();
  } catch (e: any) {
    console.log(e);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }

  const uuid = account.uuid;
  const username = account.username;

  if (req.method === "POST") {
    handlePOST(username, uuid, cid, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// GET /api/cosmetics/equipCape?cid=:capeID
async function handlePOST(
  username: string,
  uuid: string,
  cid: string,
  res: NextApiResponse<PlayerCosmetics>
) {
  const ownedCosmetics = await prisma.cosmetic.findMany({
    where: {
      Players: {
        some: {
          uuid: uuid,
        },
      },
    },
    include: {
      Players: true,
    },
  });

  const ownedCapes = ownedCosmetics.filter((cosmetic) => {
    return cosmetic.type === "cape";
  });

  const ownedCape = ownedCapes.find((cape) => {
    return cape.id === cid;
  });

  if (ownedCape == null) {
    return res.status(400).json({
      message: "You don't own this cape",
    });
  } else {
    // model Cosmetic {
    //     id      String   @id @unique
    //     type    String
    //     texture String   @db.LongText
    //     Players Player[]
    // }

    // model Player {
    //     uuid            String     @id @unique
    //     activeCosmetics Json
    //     ownedCosmetics  Cosmetic[]
    //     dev             Boolean
    //     eviePlus        Boolean
    //     media           Boolean
    // }
    await prisma.player.update({
      where: {
        uuid: uuid,
      },
      data: {
        activeCosmetics: {
          cape: {
            id: cid,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Cape equipped",
    });
  }
}

export default withSentry(handle);
