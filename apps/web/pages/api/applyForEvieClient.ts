import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Response = {
  refCode?: string;
  position?: number;
  error: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  axios
    .post("https://onwaitlist.co/api/in/7016bc75a6cb", {
      email: req.query.email as string,
      question1: req.query.question1 as string,
      referral_code: req.query.ref as string,
    })
    .then(function (response) {
      const position = response.data.match(
        /<span class="mb-5">you are <br><span class="position">(.*?)<\/span> <br> on the waitlist<\/span>/
      )[1];
      const refCode = response.data.match(
        /<input onclick="copyReferral\(\)".*?value="(.*?)"/
      )[1];

      res.status(200).json({
        position,
        refCode,
        error: false,
      });
    })
    .catch(function (error) {
      console.log(error);
      res.status(200).json({
        error: true,
      });
    });
}
