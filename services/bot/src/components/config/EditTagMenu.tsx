import { ChangeSlugModal } from "#root/constants/modals";
import { EvieColors } from "#root/Enums";
import { boostsEvie } from "#root/utils/misc/permChecks";
import { ReplyStatusEmbed } from "@evie/internal";
import { Button, Embed } from "@evie/reacord";
import type { EvieTag } from "@prisma/client";
import { container } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { captureException } from "@sentry/node";
import { MessageComponentInteraction, ModalSubmitInteraction, Snowflake, SnowflakeUtil, User } from "discord.js";
import React, { useEffect, useState } from "react";

export default function EditTagMenu(props: { user: User; _tag: EvieTag }) {
	const [tag, setTag] = useState(props._tag);

	useEffect(() => {
		(async () => {
			await container.client.prisma.evieTag.update({
				where: { id: tag.id },
				data: {
					link: tag.link,
					name: tag.name,
					content: tag.content,
					online: tag.online,
				},
			});
		})();
	}, [tag]);

	return (
		<>
			<Embed
				color={EvieColors.evieGrey}
				title={`Edit \`${tag.name}\``}
				description={`**Content**: ${tag.content}
        **Accessible online**: ${tag.online && tag.slug ? `Yes [view](https://tag.evie.pw/${tag.slug})` : "No"}
        `}
			/>
			<Button
				style="primary"
				user={props.user}
				label="Online Settings"
				onClick={async (i) => {
					if (!(await boostsEvie(i.interaction.user)))
						return ReplyStatusEmbed(false, await resolveKey(i.interaction, "permissions:boost"), i.interaction);
					const generatedState = SnowflakeUtil.generate();
					await i.interaction.showModal(
						ChangeSlugModal(generatedState, {
							slug: props._tag.slug ?? undefined,
							redirect: props._tag.link ?? undefined,
						}),
					);
					waitForModal(i.interaction, generatedState);
				}}
			/>
			{tag.slug ? (
				<Button
					style="primary"
					user={props.user}
					label={tag.online ? "Hide Online" : "Show Online"}
					onClick={() => {
						setTag({
							...tag,
							online: !tag.online,
						});
					}}
				/>
			) : null}
		</>
	);
	async function waitForModal(interaction: MessageComponentInteraction, state: Snowflake) {
		const submit = (await interaction
			.awaitModalSubmit({
				filter: (i) => i.customId === `change_slug_${state}`,
				time: 100000,
			})
			.catch(() => {
				interaction.followUp({
					content: "Edit modal timed out.",
					ephemeral: true,
				});
			})) as ModalSubmitInteraction;

		if (!submit) return;
		if (!submit.fields) return;
		try {
			const slug = submit.fields.getTextInputValue("slug");
			const redirect = submit.fields.getTextInputValue("redirect");

			if (!slug) return void ReplyStatusEmbed(false, "No slug provided.", submit);

			if (slug.match(/^[a-zA-Z0-9-]{1,32}$/) === null)
				return void ReplyStatusEmbed(false, "Slug must be alphanumeric and no more than 32 characters long.", submit);

			const newTag = await container.client.prisma.evieTag.update({
				where: { id: tag.id },
				data: {
					slug: slug,
					link: redirect,
				},
			});

			return void interaction.client.reacord.ephemeralReply(
				submit,
				<EditTagMenu _tag={newTag} user={interaction.user} />,
			);
		} catch (e) {
			ReplyStatusEmbed(false, "Something went wrong.", submit);
			return void captureException(e);
		}
	}
}
