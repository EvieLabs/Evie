/* eslint-disable @typescript-eslint/ban-ts-comment */
import { container } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import type { User } from "discord.js";
import React, { ReactNode, useEffect } from "react";
import { isInstanceOf } from "../../../helpers/is-instance-of";
import { ReacordElement } from "../../internal/element.js";
import type { ComponentInteraction } from "../../internal/interaction";
import type { ActionRow, ActionRowItem, MessageOptions } from "../../internal/message";
import { Node } from "../../internal/node.js";
import type { ComponentEvent } from "../component-event";
import ComponentStore from "../ComponentStore";
import { OptionNode } from "./option-node";

/**
 * @category Select
 */
export type SelectProps = {
	children?: ReactNode;
	/** Sets the currently selected value */
	value?: string;

	/** Sets the currently selected values, for use with `multiple` */
	values?: string[];

	/** The text shown when no value is selected */
	placeholder?: string;

	/** Set to true to allow multiple selected values */
	multiple?: boolean;

	/**
	 * With `multiple`, the minimum number of values that can be selected.
	 * When `multiple` is false or not defined, this is always 1.
	 *
	 * This only limits the number of values that can be received by the user.
	 * This does not limit the number of values that can be displayed by you.
	 */
	minValues?: number;

	/**
	 * With `multiple`, the maximum number of values that can be selected.
	 * When `multiple` is false or not defined, this is always 1.
	 *
	 * This only limits the number of values that can be received by the user.
	 * This does not limit the number of values that can be displayed by you.
	 */
	maxValues?: number;

	/** When true, the select will be slightly faded, and cannot be interacted with. */
	disabled?: boolean;

	/**
	 * Called when the user inputs a selection.
	 * Receives the entire select change event,
	 * which can be used to create new replies, etc.
	 */
	onChange?: (event: SelectChangeEvent) => void;

	/**
	 * Convenience shorthand for `onChange`, which receives the first selected value.
	 */
	onChangeValue?: (value: string, event: SelectChangeEvent) => void;

	/**
	 * Convenience shorthand for `onChange`, which receives all selected values.
	 */
	onChangeMultiple?: (values: string[], event: SelectChangeEvent) => void;

	/**
	 * The target of the button.
	 */
	user?: User;
};

/**
 * @category Select
 */
export type SelectChangeEvent = ComponentEvent & {
	values: string[];
};

/**
 * See [the select menu guide](/guides/select-menu) for a usage example.
 * @category Select
 */
export function Select(props: SelectProps) {
	const customId = `reacord-${
		Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
	}`;
	ComponentStore.addComponent(customId);
	useEffect(() => {
		container.logger.debug(
			`Created a select with props: ${JSON.stringify({
				user: props.user?.id,
				value: props.value,
				values: props.values,
			})}`,
		);
	}, []);
	return (
		<ReacordElement props={props} createNode={() => new SelectNode(props, customId)}>
			{props.children}
		</ReacordElement>
	);
}

class SelectNode extends Node<SelectProps> {
	override modifyMessageOptions(message: MessageOptions): void {
		if (!this.customId) throw new Error("No customId");

		const actionRow: ActionRow = [];
		message.actionRows.push(actionRow);

		const options = [...this.children]
			// @ts-ignore Need to investigate this more as it works fine :thisisfine:
			.filter(isInstanceOf(OptionNode))
			.map((node) => node.options);

		const { multiple, value, values, minValues = 0, maxValues = 25, ...props } = this.props;

		const item: ActionRowItem = {
			...props,
			type: "select",
			customId: this.customId,
			options,
			values: [],
		};

		if (multiple) {
			item.minValues = minValues;
			item.maxValues = maxValues;
			if (values) item.values = values;
		}

		if (!multiple && value != undefined) {
			item.values = [value];
		}

		actionRow.push(item);
	}

	override handleComponentInteraction(interaction: ComponentInteraction): boolean {
		const isSelectInteraction =
			interaction.type === "select" && interaction.customId === this.customId && !this.props.disabled;

		if (!isSelectInteraction) return false;

		if (this.props.user && interaction.event.user.id !== this.props.user.id) {
			container.logger.debug(
				`[Reacord] The non original user ${interaction.event.user.username}(${interaction.event.user.id}) clicked the select. Meant for ${this.props.user.username}(${this.props.user.id})`,
			);

			(async () => {
				interaction.raw.replied
					? interaction.followUp({
							content: await resolveKey(interaction.raw, "permissions:selectNotYours"),
							embeds: [],
							actionRows: [],
							ephemeral: true,
					  })
					: interaction.reply({
							content: await resolveKey(interaction.raw, "permissions:selectNotYours"),
							embeds: [],
							actionRows: [],
							ephemeral: true,
					  });
			})();
			return false;
		}

		this.props.onChange?.(interaction.event);
		this.props.onChangeMultiple?.(interaction.event.values, interaction.event);
		if (interaction.event.values[0]) {
			this.props.onChangeValue?.(interaction.event.values[0], interaction.event);
		}
		return true;
	}
}
