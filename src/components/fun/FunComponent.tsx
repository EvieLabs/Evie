import { Button, Option, Select } from "#reacord/main";
import type { User } from "discord.js";
import React, { useState } from "react";
import EvieComponent from "./EvieComponent";

export default function FunComponent(props: { user: User }) {
  const [value, setValue] = useState<string>();
  const [component, setComponent] = useState<JSX.Element | undefined>();
  return (
    <>
      {component}
      <Select
        user={props.user}
        placeholder="choose a dog type"
        value={value}
        onChangeValue={setValue}
      >
        <Option
          description="Send a random picture of Evie"
          label="Evie"
          emoji="<:Evie:940139203222716426>"
          value="evie"
        />
      </Select>
      <Button
        user={props.user}
        label="confirm"
        style="primary"
        disabled={value == undefined}
        onClick={() => {
          if (value) {
            switch (value) {
              case "evie":
                setComponent(<EvieComponent user={props.user} />);
                break;
            }
          }
        }}
      />
    </>
  );
}
