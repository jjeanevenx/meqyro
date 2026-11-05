import { PDFArray, PDFDocument, PDFRawStream, decodePDFRawStream } from "pdf-lib";

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
        lines.push(new TextDecoder("windows-1252").decode(data));
      }
    }
  }
  return lines.join(" ").replace(/\s+/gu, " ").trim();
}
