// backend/scripts/testBrowserLaunch.js
import puppeteer from 'puppeteer-core';

async function testLaunch() {
  console.log('Testing launch of installed Chrome via puppeteer-core...');
  const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 15000 });
  const title = await page.title();
  console.log('Page Title:', title);

  const heading = await page.$eval('h1, h2, h3', el => el.innerText).catch(() => 'No heading found');
  console.log('First heading found:', heading);

  await browser.close();
  console.log('Browser test successfully completed!');
}

testLaunch().catch(err => {
  console.error('Browser launch error:', err);
  process.exit(1);
});
