import { describe, expect, it } from "vitest";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { pdfText } from "../pdf-text";

describe("PDF text inspection", () => {
  it("preserves WinAnsi punctuation and all supported locale accents", async () => {
    const expected = "• Ação: atenção — café, español, français, cœur; € 12,90… ‘sim’ “oui” ™";
    const document = await PDFDocument.create();
    const font = await document.embedFont(StandardFonts.Helvetica);
    document.addPage().drawText(expected, { font, size: 8 });
    expect(await pdfText(await document.save())).toBe(expected);
  });
});
