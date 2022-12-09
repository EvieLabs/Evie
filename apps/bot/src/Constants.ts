import { s } from "@sapphire/shapeshift";

export const MessageSchema = s.object({
	content: s.string.optional,
	embeds: s.array(
		s.object({
			title: s.union(s.string, s.nullish),
			type: s.union(s.string, s.nullish),
			description: s.union(s.string, s.nullish),
			url: s.union(s.string, s.nullish),
			timestamp: s.union(s.string, s.nullish),
			color: s.union(s.number, s.nullish),
			footer: s.union(
				s.object({
					text: s.union(s.string, s.nullish),
					icon_url: s.union(s.string, s.nullish),
				}),
				s.nullish,
			),
			image: s.union(
				s.object({
					url: s.union(s.string, s.nullish),
				}),
				s.nullish,
			),
			thumbnail: s.union(
				s.object({
					url: s.union(s.string, s.nullish),
				}),
				s.nullish,
			),
			video: s.union(
				s.object({
					url: s.union(s.string, s.nullish),
				}),
				s.nullish,
			),
			author: s.union(
				s.object({
					name: s.string,
					url: s.union(s.string, s.nullish),
					icon_url: s.union(s.string, s.nullish),
				}),
				s.nullish,
			),
			fields: s.union(
				s.array(
					s.object({
						name: s.string,
						value: s.string,
						inline: s.union(s.boolean, s.nullish),
					}),
				),
				s.nullish,
			),
		}),
	).optional,
});

export const ModuleSchema = s.object({
	name: s.string,
	config: s.any,
});

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

export const LinkRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
