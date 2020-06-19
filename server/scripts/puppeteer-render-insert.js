const puppeteer = require('puppeteer');
const url = process.argv[2];
const outputPath = process.argv[3];
console.log(url);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'load'});
  await page.waitForSelector('#page-4');
  await page.pdf({
    path: outputPath,
    preferCSSPageSize: true,
    format: 'Letter'    
  });

  await browser.close();
})();
