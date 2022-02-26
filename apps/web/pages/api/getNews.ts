import type { NextApiRequest, NextApiResponse } from "next";

type Post = {
  id: number;
  title: string;
  imageURL: string;
  description: string;
  date: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[]>
) {
  res.status(200).json([
    {
      id: 1,
      title: "Thanks for helping!",
      imageURL: "https://evie.pw/Banner.png",
      description:
        "Hey there! Thanks for helping me out with EvieClient! Feel free to report bugs here https://github.com/EvieClient/EvieClient-Releases/issues/new/choose",
      date: "2020-06-13T11:13:12+01:00",
    },
  ]);
}
