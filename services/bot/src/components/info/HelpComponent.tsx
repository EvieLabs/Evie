import { aboutButtons } from "#root/constants/index";
import { Emojis, EvieColors } from "#root/Enums";
import { removeIndents } from "#root/utils/builders/stringBuilder";
import { Embed, Link, Option, Select } from "@evie/reacord";
import type { Args, Command, CommandOptions } from "@sapphire/framework";
import type { User } from "discord.js";
import React, { useState } from "react";

type CommandPage = {
	categoryName: string;
	commands: Command[];
};

export default function HelpComponent(props: {
	user: User;
	infoEmbed: {
		title: string;
		description: string;
	};
	commands: {
		[key: string]: Command<Args, CommandOptions>[];
	};
}) {
	const { user, commands, infoEmbed } = props;

	const [page, setPage] = useState<CommandPage>(
		Object.keys(commands).map((category) => ({
			categoryName: category,
			commands: commands[category],
		}))[0],
	);

	return (
		<>
			<Embed title={infoEmbed.title} color={EvieColors.evieGrey} description={infoEmbed.description} />
			<Embed color={EvieColors.evieGrey} title={page.categoryName}>
				{page.commands
					.map((command) =>
						removeIndents(`
            • ${command.messageRun ? "ev!" : ""}\`${command.name}\` ${command.chatInputRun ? Emojis.slashCommand : ""}${
							command.contextMenuRun ? Emojis.contextMenu : ""
						} - ${command.description}
                `),
					)
					.join("")}
			</Embed>

			<Select
				user={user}
				value={Object.values(commands).indexOf(page.commands).toString()}
				onChangeValue={(value) => {
					setPage(
						Object.keys(commands).map((category) => ({
							categoryName: category,
							commands: commands[category],
						}))[parseInt(value)],
					);
				}}
			>
				{Object.keys(commands).map((category) => (
					<Option
						label={category}
						key={Object.values(commands).indexOf(commands[category]).toString()}
						value={Object.values(commands).indexOf(commands[category]).toString()}
					/>
				))}
			</Select>
			<Link label="Privacy Policy" url={aboutButtons.privacyPolicy} />
			<Link label="Terms of Service" url={aboutButtons.tos} />
			<Link label="Support/Community" url={aboutButtons.support} />
		</>
	);
}
