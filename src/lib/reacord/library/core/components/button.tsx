import { nanoid } from "nanoid";
import React from "react";
import { ReacordElement } from "../../internal/element.js";
import type { ComponentInteraction } from "../../internal/interaction";
import type { MessageOptions } from "../../internal/message";
import { getNextActionRow } from "../../internal/message";
import { Node } from "../../internal/node.js";
import type { ComponentEvent } from "../component-event";
import { useInstance } from "../instance-context.js";
import type { ButtonSharedProps } from "./button-shared-props";

/**
 * @category Button
 */
export type ButtonProps = ButtonSharedProps & {
  /**
   * The style determines the color of the button and signals intent.
   * @see https://discord.com/developers/docs/interactions/message-components#button-object-button-styles
   */
  style?: "primary" | "secondary" | "success" | "danger";

  /**
   * Happens when a user clicks the button.
   */
  onClick: (event: ButtonClickEvent) => void;
};

/**
 * @category Button
 */
export type ButtonClickEvent = ComponentEvent;

/**
 * @category Button
 */
export function Button(props: ButtonProps) {
  const instance = useInstance();
  return (
    <ReacordElement
      props={props}
      createNode={() => new ButtonNode(props, instance)}
    />
  );
}

class ButtonNode extends Node<ButtonProps> {
  private customId = nanoid();

  override modifyMessageOptions(options: MessageOptions): void {
    getNextActionRow(options).push({
      type: "button",
      customId: this.customId,
      style: this.props.style ?? "secondary",
      disabled: this.props.disabled,
      emoji: this.props.emoji,
      label: this.props.label,
    });
  }

  override handleComponentInteraction(interaction: ComponentInteraction) {
    if (
      this.instance.originalUser &&
      interaction.event.user.id !== this.instance.originalUser.id
    ) {
      interaction.reply({
        content: "You can't click this button.",
        embeds: [],
        actionRows: [],
      });
      return false;
    }

    if (
      interaction.type === "button" &&
      interaction.customId === this.customId
    ) {
      this.props.onClick(interaction.event);
      return true;
    }
    return false;
  }
}
