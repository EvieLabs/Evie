import { EvieColors } from "#root/Enums";
import { Button, Embed } from "@evie/reacord";
import type { User } from "discord.js";
import React, { useState } from "react";

export default function PaginateComponent(props: {
	user: User;
	pages: {
		title?: string;
		description: string;
		color?: number;
	}[];
}) {
	const { user, pages } = props;

	if (!pages[0]) return null;

	const [page, setPage] = useState<typeof pages[number]>(pages[0]);

	return (
		<>
			<Embed
				color={page.color ?? EvieColors.evieGrey}
				title={page.title}
				description={page.description}
				footer={{
					text: `Page ${pages.indexOf(page) + 1}/${pages.length}`,
				}}
			/>
			{pages.length > 4 && (
				<>
					<Button
						style="primary"
						disabled={pages.indexOf(page) === 0}
						user={user}
						label="←"
						onClick={() => {
							const prevPage = pages[pages.indexOf(page) - 1];
							if (prevPage) {
								setPage(prevPage);
							}
						}}
					/>
					<Button
						style="primary"
						disabled={pages.indexOf(page) === pages.length - 1}
						user={user}
						label="→"
						onClick={() => {
							const nextPage = pages[pages.indexOf(page) + 1];
							if (nextPage) {
								setPage(nextPage);
							}
						}}
					/>
				</>
			)}
		</>
	);
}
