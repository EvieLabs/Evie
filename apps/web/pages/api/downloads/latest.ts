import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export interface GitHubReleaseAsset {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  uploader: Uploader;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
}
export interface Uploader {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const platform = req.query.platform;
  axios
    .get(
      "https://api.github.com/repos/EvieClient/EvieClient-Releases/releases/latest"
    )
    .then(function (response) {
      const data = response.data;
      const downloadURL = data.assets
        .filter((asset: GitHubReleaseAsset) =>
          asset.name.endsWith(platform == "mac" ? ".dmg" : ".exe")
        )
        .map((asset: GitHubReleaseAsset) => asset.browser_download_url)[0];

      res.status(200).redirect(downloadURL);
    })
    .catch(function (error) {
      res.status(200).json({
        error: true,
        message: "Looks like something went wrong here. :-)",
        reason:
          "We're placing bets that theres no compiled versions ready to serve. Let the staff on https://evie.pw/discord know if you think this is a bug.",
      });
    });
}
