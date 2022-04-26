/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReacordInstance } from "../main.js";
import { Container } from "./container.js";
import type { ComponentInteraction } from "./interaction";
import type { MessageOptions } from "./message";

export abstract class Node<Props> {
  readonly children = new Container<Node<unknown>>();

  constructor(public props: Props, public instance: ReacordInstance) {}

  // @ts-expect-error no-unused-vars
  modifyMessageOptions(options: MessageOptions) {}

  // @ts-expect-error no-unused-vars
  handleComponentInteraction(interaction: ComponentInteraction): boolean {
    return false;
  }
}
