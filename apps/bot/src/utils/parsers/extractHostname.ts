export default function extractHostname(url: string): string {
  let hostname: string;
  // find & remove protocol (http, ftp, etc.) and get hostname
  if (url.includes("//")) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  // find & remove port number
  hostname = hostname.split(":")[0];
  // find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
}
