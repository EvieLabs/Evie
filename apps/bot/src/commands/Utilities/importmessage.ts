import { MessageSchema } from "#root/Constants";
import { ImportMessageModal } from "#root/constants/modals";
import { miscDB } from "#root/utils/database/misc";
import { botAdmins, registeredGuilds } from "@evie/config";
import { EvieEmbed, ReplyStatusEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, RegisterBehavior } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import * as Sentry from "@sentry/node";
import { ApplicationCommandType } from "discord-api-types/v9";
import {
	ButtonInteraction,
	CommandInteraction,
	ContextMenuInteraction,
	Message,
	MessageActionRow,
	MessageAttachment,
	MessageButton,
	MessageComponentInteraction,
	MessageEditOptions,
	MessageOptions,
	Permissions,
	Snowflake,
	SnowflakeUtil,
	TextChannel,
	ThreadChannel,
} from "discord.js";
@ApplyOptions<Command.Options>({
	description: "Sends Discord Message JSON as a message",
	requiredUserPermissions: ["MANAGE_MESSAGES"],
})
export class ImportMessage extends Command {
	public override async chatInputRun(interaction: CommandInteraction): Promise<void> {
		if (!interaction.inCachedGuild()) return;

		const channel = interaction.options.getChannel("channel");

		if (!(channel instanceof TextChannel || channel instanceof ThreadChannel))
			throw await resolveKey(interaction, "commands/util/importmessage:invalidChannelType");

		if (!channel.permissionsFor(interaction.member).has(Permissions.FLAGS.SEND_MESSAGES))
			throw await resolveKey(interaction, "commands/util/importmessage:userNoPerms");

		if (!interaction.guild.me?.permissionsIn(channel).has(Permissions.FLAGS.SEND_MESSAGES))
			throw await resolveKey(interaction, "commands/util/importmessage:botNoPerms");

		const generatedState = SnowflakeUtil.generate();

		await interaction.showModal(ImportMessageModal(generatedState));
		await this.waitForModal(interaction, channel, generatedState);
	}

	public override async contextMenuRun(interaction: ContextMenuInteraction) {
		if (!interaction.inCachedGuild()) return;
		await interaction.deferReply({ ephemeral: true });

		const message = interaction.options.getMessage("message", true);

		if (
			message.author.id !== interaction.client.user?.id ||
			!(await miscDB.getImportedMessages(interaction.guild)).includes(message.id)
		)
			throw await resolveKey(interaction, "commands/util/importmessage:notImportedMessage");

		if (!message.channel.permissionsFor(interaction.member).has(Permissions.FLAGS.SEND_MESSAGES))
			throw await resolveKey(interaction, "commands/util/importmessage:userNoPerms");

		if (!interaction.guild.me?.permissionsIn(message.channel).has(Permissions.FLAGS.SEND_MESSAGES))
			throw await resolveKey(interaction, "commands/util/importmessage:botNoPerms");

		const generatedState = SnowflakeUtil.generate();

		await interaction.editReply({
			embeds: [new EvieEmbed().setDescription("(message editor is disabled, click continue to edit the raw json)")],
			components: [
				new MessageActionRow().addComponents(
					new MessageButton()
						.setLabel("Continue")
						.setStyle("PRIMARY")
						.setCustomId(`continue_msg_import_${generatedState}`),
				),
			],
			files: [new MessageAttachment(Buffer.from(JSON.stringify(message.toJSON())), "message.json")],
		});

		return void (await this.waitForButton(interaction, generatedState, message));
	}

	private waitForButton(interaction: ContextMenuInteraction, stateflake: Snowflake, existingMessage?: Message) {
		if (!interaction.channel) return;
		if (!existingMessage) return;

		const filter = (i: MessageComponentInteraction) =>
			i.customId === `continue_msg_import_${stateflake}` && i.type === "MESSAGE_COMPONENT";

		const collector = interaction.channel.createMessageComponentCollector({
			filter,
			time: 300000,
		});
		collector.on("collect", async (i: ButtonInteraction) => {
			const generatedState = SnowflakeUtil.generate();

			await i.showModal(
				ImportMessageModal(
					generatedState,
					JSON.stringify(
						{
							content: existingMessage.content,
							embeds: existingMessage.embeds,
							components: botAdmins.includes(interaction.user.id) ? existingMessage.components : undefined,
						},
						null,
						2,
					),
				),
			);

			void this.waitForModal(i, existingMessage.channel as TextChannel, generatedState, existingMessage);
		});
		collector.on("end", () => {
			throw `Import Timed Out`;
		});
	}

	private async waitForModal(
		interaction: CommandInteraction | ButtonInteraction,
		channel: TextChannel | ThreadChannel,
		stateflake: Snowflake,
		existingMessage?: Message,
	) {
		const submit = await interaction
			.awaitModalSubmit({
				filter: (i) => i.customId === `import_msgjson_${stateflake}`,
				time: 100000,
			})
			.catch(() => {
				throw `Import Timed Out`;
			});

		const jsonData = submit.fields.getTextInputValue("json_data");

		try {
			const json = botAdmins.includes(interaction.user.id)
				? (JSON.parse(jsonData) as unknown as MessageOptions)
				: MessageSchema.parse(JSON.parse(jsonData));

			if (!json.content && !json.embeds)
				throw await resolveKey(interaction, "commands/util/importmessage:noContentOrEmbed");

			const message = existingMessage
				? await existingMessage.edit(json as MessageEditOptions)
				: await channel.send(json);
			if (!existingMessage) await miscDB.addImportedMessage(message);

			return await ReplyStatusEmbed(
				true,
				await resolveKey(interaction, "commands/util/importmessage:imported", {
					messageUrl: message.url,
				}),
				submit,
			);
		} catch (e) {
			Sentry.captureException(e);
			throw e;
		}
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerContextMenuCommand(
			(builder) =>
				builder //
					.setName("Edit Message")
					.setType(ApplicationCommandType.Message),
			{
				guildIds: registeredGuilds,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: ["954547076920930354"],
			},
		);

		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: "channel",
						description: "Channel to send the message to",
						type: "CHANNEL",
						required: true,
					},
				],
			},
			{
				guildIds: registeredGuilds,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: ["954547077650735114"],
			},
		);
	}
}
