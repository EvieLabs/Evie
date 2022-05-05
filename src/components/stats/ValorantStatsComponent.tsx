import { Button, Option, Select } from "#reacord/main";
import { HenrikAPIRoot } from "#root/constants/index";
import { Emojis } from "#root/utils/lang";
import type { AccountData, GetHenrikAPI } from "#types/api/HenrikValorant";
import axios from "axios";
import type { User } from "discord.js";
import React, { useEffect, useState } from "react";
import ValorantCompStats from "./ValorantCompStats";
import ValorantUserInfo from "./ValorantUserInfo";

export default function ValorantStatsComponent(props: {
  user: User;
  username: string;
  tag: string;
}) {
  const [value, setValue] = useState<string>();
  const [component, setComponent] = useState<JSX.Element | undefined>();

  const [account, setAccount] = useState<GetHenrikAPI<AccountData> | null>();

  useEffect(() => {
    axios
      .get<GetHenrikAPI<AccountData>>(
        `${HenrikAPIRoot}/valorant/v1/account/${props.username}/${props.tag}`
      )
      .then((res) => {
        setAccount(res.data);
      })
      .catch(() => {
        setAccount({
          status: 404,
        });
      });
  }, []);

  return (
    <>
      {component}
      {account ? (
        <>
          {account?.status === 404 ? (
            <>Not Found</>
          ) : (
            <>
              {component ? undefined : (
                <Select
                  user={props.user}
                  placeholder="Select stats..."
                  value={value}
                  onChangeValue={setValue}
                >
                  <Option
                    description={`Check out ${props.username}'s info on VALORANT.`}
                    label="Player Info"
                    emoji={Emojis.valorantLogo}
                    value="info"
                  />
                  <Option
                    description={`Check out ${props.username}'s competitive stats on VALORANT.`}
                    label="Competitive Stats"
                    emoji={Emojis.valorantRadiant}
                    value="comp"
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
                  if (!account?.data) return;

                  switch (value) {
                    case "info":
                      setComponent(
                        <ValorantUserInfo
                          user={props.user}
                          accountData={account?.data}
                        />
                      );
                      break;
                    case "comp":
                      setComponent(
                        <ValorantCompStats
                          user={props.user}
                          accountData={account?.data}
                        />
                      );
                      break;
                  }
                }}
              />
            </>
          )}
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
}
