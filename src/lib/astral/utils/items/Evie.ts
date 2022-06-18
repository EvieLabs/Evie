import { ItemTool } from "./ItemTool";

export class Evie extends ItemTool {
  public override hitMonster() {
    return "bark";
  }
}
