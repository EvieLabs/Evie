import { client } from ".";

export async function prodMode() {
  if (client.user?.id == `900875807969406987`) {
    return false;
  }
  return true;
}
