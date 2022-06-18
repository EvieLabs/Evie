import type { Monster } from "../monsters/Monster";
import { Item } from "./Item";

export class ItemTool extends Item {
  public hitMonster?(target: Monster): unknown;
}
