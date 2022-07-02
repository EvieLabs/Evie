import { fetch, FetchResultTypes } from "@sapphire/fetch";
import type { GetHenrikAPI } from "../types/types";

const HenrikAPIRoot = "https://api.henrikdev.xyz";

export async function fetchData<type>(url: string) {
  return await fetch<GetHenrikAPI<type>>(
    `${HenrikAPIRoot}${url}`,
    FetchResultTypes.JSON
  );
}
