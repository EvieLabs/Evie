import { Button, Option, Select, useInstance } from "#reacord/main";
import React, { useEffect, useState } from "react";
import EvieComponent from "./EvieComponent";

export default function FunComponent() {
  const [value, setValue] = useState<string>();
  const [component, setComponent] = useState<JSX.Element | undefined>();
  const instance = useInstance();

  useEffect(() => {
    console.log(instance.originalUser);
  }, []);

  return (
    <>
      {component}
      <Select
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
        label="confirm"
        style="primary"
        disabled={value == undefined}
        onClick={() => {
          if (value) {
            switch (value) {
              case "evie":
                setComponent(<EvieComponent />);
                break;
            }
          }
        }}
      />
    </>
  );
}
