/**
 * Run this once, standalone, to find the REAL ids/names of the
 * username, password, captcha, refresh, and login-button elements.
 *
 * Usage: node inspect-login-fields.js
 *
 * It opens the page headed (headless:false) so you can also visually
 * confirm which element is which, then dumps every <input> and
 * button-like element's id/name/type to the console.
 */
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 300 });
    const page = await browser.newPage();

    await page.goto('https://gtplsaathi.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    const inputs = await page.$$eval('input, img, button', (els) =>
        els.map((el) => ({
            tag: el.tagName,
            id: el.id || null,
            name: el.getAttribute('name'),
            type: el.getAttribute('type'),
            src: el.getAttribute('src'),
            className: el.className || null,
        }))
    );

    console.log(JSON.stringify(inputs, null, 2));

    console.log('\nBrowser will stay open for 60s so you can inspect manually (F12).');
    await page.waitForTimeout(60000);

    await browser.close();
})();