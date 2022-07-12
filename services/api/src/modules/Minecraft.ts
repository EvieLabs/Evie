import { Puppeteer } from "./Puppeteer";
import { minecraftStyling } from "../constants/styles";

export class Minecraft {
  public static async renderMotd(lines: string[]) {
    try {
      const image = await Puppeteer.RenderHTML([minecraftStyling, lines.join("<br />")].join("\n"), {
        width: 640,
        height: 80,
        omitBackground: true,
      });
      return image;
    } catch (e) {
      throw e;
    }
  }
}
