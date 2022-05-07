import { Button, Option, Select } from "#reacord/main";
import { Emojis } from "#root/utils/lang";
import type { AccountData } from "#types/api/HenrikValorant";
import type { User } from "discord.js";
import React, { useState } from "react";
import ValorantCompStats from "./ValorantCompStats";
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
                  description={`Check out ${account.name}'s info on VALORANT.`}
                  label="Player Info"
                  emoji={Emojis.valorantLogo}
                  value="info"
                />
                <Option
                  description={`Check out ${account.name}'s competitive stats on VALORANT.`}
                  label="Competitive Stats"
                  emoji={Emojis.valorantRadiant}
                  value="comp"
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
