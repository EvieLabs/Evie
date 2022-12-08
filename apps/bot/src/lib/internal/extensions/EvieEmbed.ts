import type { APIMessage } from "discord-api-types/v9";
import {
	ButtonInteraction,
	CommandInteraction,
	ContextMenuInteraction,
	Message,
	MessageComponentInteraction,
	MessageEmbed,
	MessageMentionOptions,
	ModalSubmitInteraction,
} from "discord.js";
import { EvieColors } from "#root/Enums";
import { removeIndents } from "#root/utils/builders/stringBuilder";

export enum StatusEmoji {
	SUCCESS = "<a:success:952340083418230874>",
	FAIL = "<a:fail:952340157858709594>",
}

export class EvieEmbed extends MessageEmbed {
	public override setDescription(description: string): this {
		this.description = removeIndents(description);
		return this;
	}

	public constructor() {
		super({
			color: EvieColors.evieGrey,
			timestamp: Date.now().toString(),
		});
	}
}

export class StatusEmbed extends MessageEmbed {
	constructor(public success: boolean, public statusMessage: string) {
		super({
			color: success ? EvieColors.evieGrey : 0xff0000,
			timestamp: Date.now().toString(),
			description: `${success ? StatusEmoji.SUCCESS : StatusEmoji.FAIL} ${statusMessage}`,
		});
	}
}

export async function ReplyStatusEmbed(
	success: boolean,
	description: string,
	i:
		| CommandInteraction
		| ModalSubmitInteraction
		| ContextMenuInteraction
		| ButtonInteraction
		| Message
		| MessageComponentInteraction,
	allowedMentions?: MessageMentionOptions,
): Promise<Message | Message | APIMessage | void> {
	const embed = new StatusEmbed(success, description);

	if (i instanceof Message) return i.reply({ embeds: [embed], allowedMentions: allowedMentions });

	return i.replied
		? i.followUp({
				embeds: [embed],
				ephemeral: true,
				allowedMentions: allowedMentions,
		  })
		: i.reply({
				embeds: [embed],
				ephemeral: true,
				allowedMentions: allowedMentions,
		  });
}

export async function EditReplyStatusEmbed(
	success: boolean,
	description: string,
	i:
		| CommandInteraction
		| ModalSubmitInteraction
		| ContextMenuInteraction
		| ButtonInteraction
		| Message
		| MessageComponentInteraction,
	allowedMentions?: MessageMentionOptions,
): Promise<Message | Message | APIMessage | void> {
	const embed = new StatusEmbed(success, description);

	if (i instanceof Message) return i.edit({ embeds: [embed], allowedMentions: allowedMentions });

	return i.editReply({
		embeds: [embed],
		allowedMentions: allowedMentions,
	});
}
