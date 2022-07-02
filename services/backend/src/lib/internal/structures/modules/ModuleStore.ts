import { Store } from "@sapphire/framework";
import { Module } from "./Module";

export class ModuleStore extends Store<Module> {
  public constructor() {
    super(Module, { name: "modules" });
  }
}
