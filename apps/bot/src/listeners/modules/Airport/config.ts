import { s } from "@sapphire/shapeshift";

export const AirportConfigSchema = s.object({
	channel: s.union(s.string, s.nullish),
	arrives: s.union(s.boolean, s.nullish),
	arriveMessage: s.union(s.string, s.nullish),
	departs: s.union(s.boolean, s.nullish),
	departMessage: s.union(s.string, s.nullish),
	joinRole: s.union(s.string, s.nullish),
	giveJoinRole: s.union(s.boolean, s.nullish),
	ping: s.union(s.boolean, s.nullish),
});
