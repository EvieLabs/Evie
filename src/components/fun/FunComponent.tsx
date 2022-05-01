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
      {component ? undefined : (
        <Select
          user={props.user}
          placeholder="Select activity..."
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
      )}
      <Button
        user={props.user}
        label={component ? "Go back" : "Confirm"}
        style={component ? "secondary" : "primary"}
        disabled={value == undefined}
        onClick={() => {
          if (component) return setComponent(undefined);
          if (!value) return;

          switch (value) {
            case "evie":
              setComponent(<EvieComponent user={props.user} />);
              break;
          }
        }}
      />
    </>
  );
}
