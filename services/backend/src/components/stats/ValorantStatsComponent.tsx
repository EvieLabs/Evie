import { Emojis } from "#root/Enums";
import { Button, Option, Select } from "@evie/reacord";
import type { AccountData } from "@evie/valorant";
import type { User } from "discord.js";
import React, { useState } from "react";
import ValorantCompStats from "./ValorantCompStats";
import ValorantGameStats from "./ValorantGameStats";
import ValorantUserInfo from "./ValorantUserInfo";

export default function ValorantStatsComponent(props: {
  user: User;
  account: AccountData;
}) {
  const [value, setValue] = useState<string>();
  const [component, setComponent] = useState<JSX.Element | undefined>();

  const { account, user } = props;

  return (
    <>
      {component}
      {account ? (
        <>
          <>
            {component ? undefined : (
              <Select
                user={user}
                placeholder="Select stats..."
                value={value}
                onChangeValue={setValue}
              >
                <Option
                  description={`${account.name}'s region, level, banner and more.`}
                  label="Player Info"
                  emoji={Emojis.valorantFade}
                  value="info"
                />
                <Option
                  description={`${account.name}'s rank rating, peak rank, and more.`}
                  label="Competitive Stats"
                  emoji={Emojis.valorantLogo}
                  value="comp"
                />
                <Option
                  description={`${account.name}'s Winrate, KDA, Most used agent and more.`}
                  label="Game Stats"
                  emoji={Emojis.valorantRadiant}
                  value="game"
                />
              </Select>
            )}

            <Button
              user={user}
              label={component ? "Go back" : "Confirm"}
              style={component ? "secondary" : "primary"}
              disabled={value == undefined}
              onClick={() => {
                if (component) return setComponent(undefined);
                if (!value) return;

                switch (value) {
                  case "info":
                    setComponent(
                      <ValorantUserInfo
                        user={props.user}
                        accountData={account}
                      />
                    );
                    break;
                  case "comp":
                    setComponent(
                      <ValorantCompStats
                        user={props.user}
                        accountData={account}
                      />
                    );
                    break;
                  case "game":
                    setComponent(
                      <ValorantGameStats
                        user={props.user}
                        accountData={account}
                      />
                    );
                    break;
                }
              }}
            />
          </>
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
}
