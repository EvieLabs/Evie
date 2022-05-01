import { container } from "@sapphire/framework";
import type { User } from "discord.js";
import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import lang from "../../../../../utils/lang";
import { ReacordElement } from "../../internal/element.js";
import type { ComponentInteraction } from "../../internal/interaction";
import type { MessageOptions } from "../../internal/message";
import { getNextActionRow } from "../../internal/message";
import { Node } from "../../internal/node.js";
import type { ComponentEvent } from "../component-event";
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

  /**
   * The target of the button.
   */
  user?: User;
};

/**
 * @category Button
 */
export type ButtonClickEvent = ComponentEvent;

/**
 * @category Button
 */
export function Button(props: ButtonProps) {
  useEffect(() => {
    container.logger.debug(
      `Created a button with props: ${JSON.stringify({
        user: `${props.user?.username}(${props.user?.id})`,
        style: props.style,
        disabled: props.disabled,
        emoji: props.emoji,
        label: props.label,
      })}`
    );
  }, []);
  return (
    <ReacordElement props={props} createNode={() => new ButtonNode(props)} />
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
      interaction.type === "button" &&
      interaction.customId === this.customId
    ) {
      if (this.props.user && interaction.event.user.id !== this.props.user.id) {
        container.logger.debug(
          `[Reacord] The non original user ${interaction.event.user.username}(${interaction.event.user.id}) clicked the button. Meant for ${this.props.user.username}(${this.props.user.id})`
        );

        interaction.raw.replied
          ? interaction.followUp({
              content: lang.messageComponentNotForYou,
              embeds: [],
              actionRows: [],
              ephemeral: true,
            })
          : interaction.reply({
              content: lang.messageComponentNotForYou,
              embeds: [],
              actionRows: [],
              ephemeral: true,
            });

        return false;
      }
      this.props.onClick(interaction.event);
      return true;
    }
    return false;
  }
}
