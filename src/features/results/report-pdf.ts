import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { ComprehensiveReport } from "./contracts";

/** Paginated PDF with embedded standard fonts and no remote assets. */
export async function reportPdf(report: ComprehensiveReport, slug: string): Promise<Uint8Array> {
  const document = await PDFDocument.create();
  document.setTitle(`Meqyro — ${slug}`);
  document.setAuthor("Meqyro");
  const font = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  let page = document.addPage([595.28, 841.89]);
  let y = 790;
  const width = 491;

  function paragraph(value: string, heading = false) {
    const face = heading ? bold : font;
    const size = heading ? 16 : 11;
    // Standard PDF fonts cover the four supported locales; replace unsupported
    // decorative glyphs rather than failing the entire download.
    const text = Array.from(value.normalize("NFC"), (character) => {
      if (/\s/u.test(character)) return " ";
      try {
        face.encodeText(character);
        return character;
      } catch {
        return "?";
      }
    }).join("");
    const lines: string[] = [];
    let line = "";
    for (const word of text.split(/\s+/u)) {
      const candidate = line ? `${line} ${word}` : word;
      if (face.widthOfTextAtSize(candidate, size) <= width) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      line = "";
      // Only split a word when the word itself exceeds the available width.
      for (const character of word) {
        if (face.widthOfTextAtSize(line + character, size) > width) {
          lines.push(line);
          line = "";
        }
        line += character;
      }
    }
    if (line) lines.push(line);
    for (const content of lines) {
      if (y < 55) {
        page = document.addPage([595.28, 841.89]);
        y = 790;
      }
      page.drawText(content, { x: 52, y, size, font: face, color: rgb(0.14, 0.2, 0.18) });
      y -= heading ? 23 : 17;
    }
    y -= 12;
  }

  paragraph(`MEQYRO · ${slug}`, true);
  paragraph(report.bandLabel, true);
  paragraph(report.executiveSummary);
  for (const section of report.sections) {
    paragraph(section.title, true);
    paragraph(section.summary);
    section.paragraphs.forEach((text) => paragraph(text));
    section.keyTakeaways.forEach((text) => paragraph(`• ${text}`));
    section.actionItems.forEach((text) => paragraph(`• ${text}`));
  }
  paragraph(report.comparativeBenchmark.description);
  return document.save();
}
