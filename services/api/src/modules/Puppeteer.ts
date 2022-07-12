import NodeCache from "node-cache";
import puppeteer from "puppeteer";
import { getSecret } from "../utils/env";

export class Puppeteer {
  private static readonly cache = new NodeCache({
    stdTTL: 60 * 60,
  });

  private static readonly opts: puppeteer.LaunchOptions &
    puppeteer.BrowserLaunchArgumentOptions &
    puppeteer.BrowserConnectOptions = {
    headless: true,
    executablePath: getSecret("NODE_ENV", false) === "production" ? "/usr/bin/google-chrome" : undefined,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--no-sandbox"],
  };

  public static async RenderHTML(
    html: string,
    options: puppeteer.ScreenshotOptions & { width: number; height: number } = {
      width: 1920,
      height: 1080,
    }
  ): Promise<Buffer> {
    const cacheKey = html.toLowerCase();
    const cached = this.cache.get(cacheKey)!;

    if (cached) return cached;

    try {
      const image = await Puppeteer.RenderHTMLToPNG(html, options);
      this.cache.set(cacheKey, image);
      return image;
    } catch (e) {
      throw e;
    }
  }

  private static async RenderHTMLToPNG(
    html: string,
    options: puppeteer.ScreenshotOptions & { width: number; height: number } = {
      width: 1920,
      height: 1080,
    }
  ): Promise<Buffer> {
    try {
      const browser = await puppeteer.launch(this.opts);
      const page = await browser.newPage();
      await page.setViewport(options);

      await page.goto("about:blank");
      await page.setContent(html);
      await page.waitForTimeout(1000);
      return (await page.screenshot({
        ...options,
        fullPage: true,
        encoding: "binary",
      })) as Buffer;
    } catch (e) {
      throw e;
    }
  }
}
