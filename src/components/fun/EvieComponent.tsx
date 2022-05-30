import { EvieColors } from "#root/Enums";
import { Button, Embed } from "@evie/reacord";
import axios from "axios";
import type { User } from "discord.js";
import React, { useEffect, useState } from "react";

export default function EvieComponent(props: { user: User }) {
  const [image, setImage] = useState<string>();

  async function randomEvie() {
    const res = await axios.get(
      `https://raw.githubusercontent.com/twisttaan/AxolotlBotAPI/main/evie.txt`
    );
    const pics: string[] = (await res.data).trim().split("\n");
    setImage(pics[Math.floor(Math.random() * pics.length)]);
  }

  useEffect(() => {
    randomEvie();
  }, []);

  return (
    <>
      <Embed
        color={EvieColors.evieGrey}
        description={image ? undefined : "Loading..."}
        image={{ url: image ?? "" }}
      />
      <Button
        style="primary"
        user={props.user}
        label="Another One"
        onClick={() => {
          randomEvie();
        }}
      />
    </>
  );
}
