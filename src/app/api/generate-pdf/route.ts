import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let browser;

  try {
    const { html } = await request.json();

    if (!html) {
      return Response.json({ error: "HTML is required" }, { status: 400 });
    }

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    await page.setContent(html, {
      waitUntil: "load",
    });

    // Wait for webfonts (e.g. the injected Google Fonts stylesheet) before
    // rendering. The timeout race guarantees a font outage can delay but
    // never fail the export — worst case falls back to system fonts.
    try {
      await Promise.race([
        page.evaluate(() => document.fonts.ready.then(() => true)),
        new Promise((resolve) => setTimeout(resolve, 8000)),
      ]);
    } catch {
      // Font loading must never break PDF generation.
    }

    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    return new Response(
      new Blob([pdf as unknown as BlobPart], {
        type: "application/pdf",
      }),
      {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="CV.pdf"',
        },
      },
    );
  } catch (error) {
    console.error("PDF ERROR:", error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown PDF error",
      },
      {
        status: 500,
      },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
