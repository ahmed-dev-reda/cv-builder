import { fontMap } from "@/data/data";

// --- PDF font resolution ---
//
// The editor stores the font as either a stable key ("merriweather") or an
// opaque next/font class name ("__className_abc123"). Neither is directly
// usable in the PDF renderer:
//
// - Keys are not CSS families, and opaque class names only resolve inside
//   the Next.js app (their @font-face files live under /_next, unreachable
//   from the isolated Puppeteer page).
//
// resolvePdfFont() maps either form to a real CSS stack plus a Google Fonts
// stylesheet URL, so the renderer can load the actual font files.

export interface PdfFontSpec {
  /** Stable font key (e.g. "merriweather"). */
  key: string;
  /** next/font class for on-screen preview (empty when inapplicable). */
  className: string;
  /** Real CSS font-family stack for the PDF document. */
  stack: string;
  /** Google Fonts css2 URL, or null for system fonts. */
  googleUrl: string | null;
}

export interface PdfDocumentInput {
  /** Collected document stylesheets. */
  css: string;
  /** Serialized CV element HTML (outerHTML of the preview node). */
  bodyHtml: string;
  /** Resolved font spec for the selected font. */
  font: PdfFontSpec;
}

/** Builds the standalone HTML document sent to /api/generate-pdf. */
export function buildPdfDocument({ css, bodyHtml, font }: PdfDocumentInput): string {
  const fontLinks = font.googleUrl
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">\n          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n          <link href="${font.googleUrl}" rel="stylesheet">`
    : "";
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          ${fontLinks}
          <style>
            ${css}

            @page {
              size: A4;
              margin: 0;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: white;
            }

            * {
              box-sizing: border-box;
            }

            .cv-font,
            .cv-font * {
              font-family: ${font.stack} !important;
            }
          </style>
        </head>

        <body>
          <div
            class="cv-font"
            style="font-family: ${font.stack};"
          >
            ${bodyHtml}
          </div>
        </body>
      </html>
    `;
}

interface GoogleFontMeta {
  family: string;
  weights: string;
  fallbacks: string;
}

const SANS_FALLBACKS = "Arial, Helvetica, sans-serif";
const SERIF_FALLBACKS = "Georgia, 'Times New Roman', serif";

const GOOGLE_FONTS: Record<string, GoogleFontMeta> = {
  inter: { family: "Inter", weights: "400;500;600;700", fallbacks: SANS_FALLBACKS },
  roboto: { family: "Roboto", weights: "400;500;700", fallbacks: SANS_FALLBACKS },
  "open-sans": { family: "Open Sans", weights: "400;500;600;700", fallbacks: SANS_FALLBACKS },
  lato: { family: "Lato", weights: "400;700;900", fallbacks: SANS_FALLBACKS },
  montserrat: { family: "Montserrat", weights: "400;500;600;700", fallbacks: SANS_FALLBACKS },
  poppins: { family: "Poppins", weights: "400;500;600;700", fallbacks: SANS_FALLBACKS },
  merriweather: { family: "Merriweather", weights: "400;700;900", fallbacks: SERIF_FALLBACKS },
  "playfair-display": { family: "Playfair Display", weights: "400;500;600;700", fallbacks: SERIF_FALLBACKS },
  oswald: { family: "Oswald", weights: "400;500;600;700", fallbacks: SANS_FALLBACKS },
  nunito: { family: "Nunito", weights: "400;500;600;700", fallbacks: SANS_FALLBACKS },
};

function googleUrlFor(family: string, weights: string): string {
  return `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weights}&display=swap`;
}

export function resolvePdfFont(stored: string): PdfFontSpec {
  const keys = Object.keys(fontMap);
  const key = keys.includes(stored)
    ? stored
    : keys.find((k) => fontMap[k].className === stored) ?? "inter";

  if (key === "times-new-roman") {
    return {
      key,
      className: fontMap[key]?.className ?? "",
      stack: '"Times New Roman", Times, serif',
      googleUrl: null,
    };
  }

  const meta = GOOGLE_FONTS[key] ?? GOOGLE_FONTS.inter;
  return {
    key,
    className: fontMap[key]?.className ?? fontMap.inter.className,
    stack: `'${meta.family}', ${meta.fallbacks}`,
    googleUrl: googleUrlFor(meta.family, meta.weights),
  };
}
