import type { Item } from "./items/Item";

export class ItemManager {
  public static readonly ItemRegistry: Map<string, Item> = new Map();

  private static registerItem(id: string, item: Item) {
    this.ItemRegistry.set(id, item);
  }
}
