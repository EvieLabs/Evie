export interface OnlineServerResponse {
  online: true;
  ip: string;
  port: number;
  debug: MinecraftServerStatusDebug;
  motd: MessageOfTheDay;
  players: Players;
  version: string;
  protocol: number;
  hostname: string;
  icon: string;
  software?: string;
  map: string;
  gamemode: string;
  serverid: string;
  plugins: Mods;
  mods: Mods;
  info: ServerInfo;
}

export interface OfflineServerResponse {
  online: false;
  ip: string;
  port: number;
  debug: MinecraftServerStatusDebug;
  hostname: string;
}

interface ServerInfo {
  raw: string[];
  clean: string[];
  html: string[];
}

interface MessageOfTheDay {
  raw: string[];
  clean: string[];
  html: string[];
}

interface Players {
  online: number;
  max: number;
  list: string[];
  uuid: {
    [key: string]: string;
  };
}

interface Mods {
  names: string[];
  raw: string[];
}

interface MinecraftServerStatusDebug {
  ping: boolean;
  query: boolean;
  srv: boolean;
  querymismatch: boolean;
  ipinsrv: boolean;
  cnameinsrv: boolean;
  animatedmotd: boolean;
  cachetime: number;
}
