// Renderiza HTML -> PDF A4 con Chromium (Playwright). Uso: node render.js in.html out.pdf
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [src, dst] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(src), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const foot = `<div style="width:100%;font-family:Inter,sans-serif;font-size:7px;color:#7A8296;padding:0 16mm;display:flex;justify-content:space-between;">
    <span>Top Learning · E1601.2 · Semana 12 · Guía maestra de la clase del 15-nov-2026</span>
    <span><b style="color:#0B1F4D"><span class="pageNumber"></span></b> / <span class="totalPages"></span></span></div>`;
  await page.pdf({ path: dst, format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<div></div>', footerTemplate: foot,
    outline: true, tagged: true });
  await browser.close();
})();
