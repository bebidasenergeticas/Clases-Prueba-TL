const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+__dirname+'/guia.html');await p.waitForTimeout(500);
await p.pdf({path:__dirname+'/out.pdf',format:'A4',printBackground:true,preferCSSPageSize:true,displayHeaderFooter:true,
headerTemplate:'<div style="font-size:7px;color:#8A94AA;width:100%;padding:0 17mm;font-family:Inter,sans-serif;display:flex;justify-content:space-between"><span>Construye tu primer asistente de IA para atención al cliente</span><span>Top Learning · E1598</span></div>',
footerTemplate:'<div style="font-size:7px;color:#8A94AA;width:100%;padding:0 17mm;font-family:Inter,sans-serif;display:flex;justify-content:space-between"><span>Material de apoyo del profesor · 17 nov 2026</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>'});
await b.close();})();
