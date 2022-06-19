import puppeteer from "puppeteer";
import { getSecret } from "../config/envUtils";

// TODO: Replace with a separate docker container
export async function RenderHTML(
  html: string,
  options: puppeteer.ScreenshotOptions & { width: number; height: number } = {
    width: 1920,
    height: 1080,
  }
): Promise<Buffer> {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        getSecret("NODE_ENV", false) === "production"
          ? "/usr/bin/google-chrome"
          : undefined,
      ignoreDefaultArgs: ["--disable-extensions"],
      args: ["--no-sandbox"],
    });
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
