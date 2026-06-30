// Screenshot a component of the static site in KR + EN (desktop) and KR (mobile).
// Usage: node shoot.mjs <url> <outDir> [selector=.site-footer]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [url, outDir = '/tmp/shots', selector = '.site-footer'] = process.argv.slice(2);
if (!url) { console.error('usage: node shoot.mjs <url> <outDir> [selector]'); process.exit(1); }
mkdirSync(outDir, { recursive: true });

// derive a friendly file prefix from the selector
const name = (selector.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'shot')
  .replace(/^(site-)?/, '').replace(/-+/g, '-') || 'shot';

const errs = [];
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

async function open(ctx, file) {
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errs.push(`${file}: ${m.text()}`); });
  page.on('pageerror', e => errs.push(`${file}: ${e.message}`));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector(selector, { timeout: 10000 });
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await el.screenshot({ path: `${outDir}/${file}` });
  return page;
}

// Desktop — Korean
const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const page = await open(desktop, `${name}_ko.png`);

// Desktop — English (toggle if a language button exists)
const langBtn = page.locator('#langBtn, .lang').first();
if (await langBtn.count()) {
  await langBtn.click();
  await page.waitForTimeout(400);
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: `${outDir}/${name}_en.png` });
}

// Mobile — Korean
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
await open(mobile, `${name}_mobile.png`);

await browser.close();
console.log(`✓ wrote ${name}_ko.png / ${name}_en.png / ${name}_mobile.png to ${outDir}`);
console.log('CONSOLE_ERRORS:' + (errs.length ? '\n' + errs.join('\n') : ' none'));
