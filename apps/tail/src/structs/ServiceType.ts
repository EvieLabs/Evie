import type { BotService } from "./BotService";
import type { MiscService } from "./MiscService";

export type Service = BotService | MiscService;

export enum ServiceType {
	Bot = "bot",
	Misc = "misc",
}
