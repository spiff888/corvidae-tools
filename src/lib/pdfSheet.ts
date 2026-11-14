// A tiny page-layout helper on top of pdf-lib for the "sheet" PDFs (patch sheets, summaries).
// Import it only with a dynamic import() so pdf-lib is fetched when someone actually clicks Download.
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';

const PAGE_W = 612; // US Letter
const PAGE_H = 792;
const MARGIN = 48;
const BOTTOM = MARGIN + 18; // leave room for the footer line
const INK = rgb(0, 0, 0);
const GREY = rgb(0.38, 0.38, 0.38);
const RULE = rgb(0.75, 0.75, 0.75);
const SHADE = rgb(0.93, 0.93, 0.93);

export interface Column {
  header: string;
  /** relative width; widths are scaled to fill the page */
  weight: number;
  align?: 'left' | 'right';
}

export async function createSheet(opts: { title: string; footer: string }) {
  const doc = await PDFDocument.create();
  doc.setTitle(opts.title.slice(0, 120));
  doc.setProducer('corvidae.tools');
  doc.setCreator('corvidae.tools');
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const supported = new Set(font.getCharacterSet());
  const contentW = PAGE_W - MARGIN * 2;

  const pages: PDFPage[] = [];
  let page: PDFPage;
  let y = 0;

  // The built-in PDF fonts only cover Latin text. Anything else becomes "?" instead of making the whole export fail.
  function clean(s: string): string {
    const flat = s
      .replace(/≥/g, '>=')
      .replace(/≤/g, '<=')
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/[\u0000-\u001f\u007f]/g, '');
    let out = '';
    for (const ch of flat) out += supported.has(ch.codePointAt(0) as number) ? ch : '?';
    return out;
  }

  function newPage() {
    page = doc.addPage([PAGE_W, PAGE_H]);
    pages.push(page);
    y = PAGE_H - MARGIN;
  }
  newPage();

  function wrap(text: string, f: PDFFont, size: number, width: number): string[] {
    const lines: string[] = [];
    for (const para of clean(text).split(/\n/)) {
      let line = '';
      for (const word of para.split(' ')) {
        let w = word;
        // a single very long word is broken by character
        while (f.widthOfTextAtSize(w, size) > width && w.length > 1) {
          let cut = w.length - 1;
          while (cut > 1 && f.widthOfTextAtSize(w.slice(0, cut), size) > width) cut--;
          if (line) {
            lines.push(line);
            line = '';
          }
          lines.push(w.slice(0, cut));
          w = w.slice(cut);
        }
        const attempt = line ? `${line} ${w}` : w;
        if (f.widthOfTextAtSize(attempt, size) <= width) line = attempt;
        else {
          if (line) lines.push(line);
          line = w;
        }
      }
      lines.push(line);
    }
    return lines;
  }

  function ensure(height: number) {
    if (y - height < BOTTOM) newPage();
  }

  const api = {
    clean,
    space(h = 8) {
      y -= h;
    },
    /** start a new page unless this much room is left, so a heading is not stranded at the bottom */
    need(h: number) {
      ensure(h);
    },
    title(text: string) {
      ensure(30);
      page.drawText(clean(text), { x: MARGIN, y: y - 20, size: 20, font: bold, color: INK });
      y -= 30;
    },
    heading(text: string) {
      ensure(40);
      y -= 8;
      page.drawText(clean(text), { x: MARGIN, y: y - 12, size: 12.5, font: bold, color: INK });
      y -= 16;
      page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.8, color: INK });
      y -= 8;
    },
    paragraph(text: string, o: { size?: number; bold?: boolean; grey?: boolean } = {}) {
      const size = o.size ?? 10;
      const f = o.bold ? bold : font;
      for (const line of wrap(text, f, size, contentW)) {
        ensure(size * 1.35);
        page.drawText(line, { x: MARGIN, y: y - size, size, font: f, color: o.grey ? GREY : INK });
        y -= size * 1.35;
      }
      y -= 3;
    },
    /** label / value pairs, two columns */
    pairs(rows: [string, string][], o: { size?: number; labelWidth?: number } = {}) {
      const size = o.size ?? 10;
      const lw = o.labelWidth ?? 190;
      for (const [label, value] of rows) {
        const ls = wrap(label, font, size, lw - 8);
        const vs = wrap(value, bold, size, contentW - lw);
        const n = Math.max(ls.length, vs.length);
        ensure(n * size * 1.35 + 2);
        ls.forEach((l, i) => page.drawText(l, { x: MARGIN, y: y - size - i * size * 1.35, size, font, color: GREY }));
        vs.forEach((v, i) => page.drawText(v, { x: MARGIN + lw, y: y - size - i * size * 1.35, size, font: bold, color: INK }));
        y -= n * size * 1.35 + 2;
      }
      y -= 4;
    },
    table(cols: Column[], rows: string[][], o: { size?: number; maxLines?: number } = {}) {
      const size = o.size ?? 9;
      const maxLines = o.maxLines ?? 6;
      const pad = 3;
      const lh = size * 1.3;
      const total = cols.reduce((s, c) => s + c.weight, 0);
      const widths = cols.map((c) => (c.weight / total) * contentW);
      const xs: number[] = [];
      widths.reduce((x, w) => (xs.push(x), x + w), MARGIN);

      function header() {
        ensure(lh + pad * 2 + lh * 2);
        page.drawRectangle({ x: MARGIN, y: y - lh - pad * 2, width: contentW, height: lh + pad * 2, color: SHADE });
        cols.forEach((c, i) => {
          const t = wrap(c.header, bold, size, widths[i] - pad * 2)[0] ?? '';
          const tx = c.align === 'right' ? xs[i] + widths[i] - pad - bold.widthOfTextAtSize(t, size) : xs[i] + pad;
          page.drawText(t, { x: tx, y: y - pad - size, size, font: bold, color: INK });
        });
        y -= lh + pad * 2;
      }
      header();
      for (const row of rows) {
        const cells = cols.map((_, i) => {
          const lines = wrap(row[i] ?? '', font, size, widths[i] - pad * 2);
          if (lines.length > maxLines) {
            lines.length = maxLines;
            lines[maxLines - 1] = lines[maxLines - 1].replace(/.{0,3}$/, '...');
          }
          return lines;
        });
        const h = Math.max(...cells.map((c) => c.length)) * lh + pad * 2;
        if (y - h < BOTTOM) {
          newPage();
          header();
        }
        cells.forEach((lines, i) =>
          lines.forEach((l, k) => {
            const tx = cols[i].align === 'right' ? xs[i] + widths[i] - pad - font.widthOfTextAtSize(l, size) : xs[i] + pad;
            page.drawText(l, { x: tx, y: y - pad - size - k * lh, size, font, color: INK });
          })
        );
        y -= h;
        page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.4, color: RULE });
      }
      y -= 8;
    },
    async finish(): Promise<Uint8Array> {
      const n = pages.length;
      pages.forEach((p, i) => {
        const foot = wrap(opts.footer, font, 8, contentW - 80)[0] ?? '';
        p.drawText(foot, { x: MARGIN, y: MARGIN - 6, size: 8, font, color: GREY });
        const num = `Page ${i + 1} of ${n}`;
        p.drawText(num, { x: PAGE_W - MARGIN - font.widthOfTextAtSize(num, 8), y: MARGIN - 6, size: 8, font, color: GREY });
      });
      return doc.save();
    }
  };
  return api;
}
