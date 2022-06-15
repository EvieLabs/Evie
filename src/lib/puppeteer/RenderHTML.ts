import puppeteer from "puppeteer";
import { getSecret } from "../config/envUtils";

export async function RenderHTML(html: string): Promise<Buffer> {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        getSecret("NODE_ENV", false) === "production"
          ? "/usr/bin/google-chrome"
          : undefined,
      ignoreDefaultArgs: ["--disable-extensions"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto("about:blank");
    await page.setContent(html);
    await page.waitForTimeout(1000);
    return (await page.screenshot({
      fullPage: true,
      encoding: "binary",
    })) as Buffer;
  } catch (e) {
    throw e;
  }
}
