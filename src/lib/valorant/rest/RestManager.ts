import fetch from "@evie/fetch";
import type { GetHenrikAPI } from "../types/types";

const HenrikAPIRoot = "https://api.henrikdev.xyz";

export async function fetchData<type>(url: string) {
  return await fetch.get<GetHenrikAPI<type>>(`${HenrikAPIRoot}${url}`);
}
