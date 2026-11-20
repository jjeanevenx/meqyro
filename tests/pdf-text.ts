import { PDFArray, PDFDocument, PDFRawStream, decodePDFRawStream } from "pdf-lib";

// WinAnsi's 0x80-0x9f range is not Latin-1. This Node 22 build's
// TextDecoder("windows-1252") returns control characters for these bytes.
// Keep extraction deterministic using the WHATWG Windows-1252 index:
// https://encoding.spec.whatwg.org/index-windows-1252.txt
const winAnsiControls = [
  0x20ac, 0x0081, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6, 0x2030, 0x0160, 0x2039,
  0x0152, 0x008d, 0x017d, 0x008f, 0x0090, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014,
  0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, 0x009d, 0x017e, 0x0178,
] as const;

function decodeWinAnsi(data: Uint8Array): string {
  return Array.from(data, (byte) =>
    String.fromCodePoint(byte >= 0x80 && byte <= 0x9f ? winAnsiControls[byte - 0x80] : byte),
  ).join("");
}
/** Read standard-font text operators to compare report content independently of PDF metadata. */
export async function pdfText(bytes: Uint8Array): Promise<string> {
  const document = await PDFDocument.load(bytes);
  const lines: string[] = [];
  for (const page of document.getPages()) {
    const contents = page.node.Contents();
    const streams = contents instanceof PDFArray ? contents.asArray() : contents ? [contents] : [];
    for (const entry of streams) {
      const stream = document.context.lookup(entry);
      if (!(stream instanceof PDFRawStream)) throw new Error("Expected a PDF content stream");
      const operators = new TextDecoder().decode(decodePDFRawStream(stream).decode());
      for (const match of operators.matchAll(/<([0-9a-f]+)>\s*Tj/gi)) {
        const data = Uint8Array.from(Buffer.from(match[1], "hex"));
        lines.push(decodeWinAnsi(data));
      }
    }
  }
  return lines.join(" ").replace(/\s+/gu, " ").trim();
}
