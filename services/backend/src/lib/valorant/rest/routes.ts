import ShapedCompStats from "../shapers/ShapedCompStats";
import ShapedMatchHistory from "../shapers/ShapedMatchHistory";
import type {
  AccountData,
  MatchHistoryDataV3,
  MMRDataV2,
} from "../types/types";
import { fetchData } from "./RestManager";

export async function fetchCompStats(props: {
  region: string;
  name: string;
  tag: string;
}) {
  try {
    const res = await fetchData<MMRDataV2>(
      `/valorant/v2/mmr/${props.region}/${props.name}/${props.tag}`
    );

    if (!res.data) throw new Error("No data found");

    return new ShapedCompStats(res.data);
  } catch (e) {
    throw e;
  }
}

export async function fetchMatchHistory(props: {
  region: string;
  name: string;
  tag: string;
  puuid: string;
}) {
  try {
    const res = await fetchData<MatchHistoryDataV3[]>(
      `/valorant/v3/matches/${props.region}/${props.name}/${props.tag}`
    );

    if (!res.data) throw new Error("No data found");

    return new ShapedMatchHistory(res.data, props.puuid);
  } catch (e) {
    throw e;
  }
}

export async function fetchAccountData(props: { name: string; tag: string }) {
  try {
    const res = await fetchData<AccountData>(
      `/valorant/v1/account/${props.name}/${props.tag}`
    );

    if (!res.data) throw new Error("No data found");

    return res.data;
  } catch (e) {
    throw e;
  }
}
