const puppeteer = require('puppeteer-core');
const path = require('path');

function findChrome() {
    const paths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ];
    const fs = require('fs');
    for (const p of paths) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

(async () => {
    const execPath = findChrome();
    if (!execPath) {
        console.error('No Chrome or Edge found. Please install Chrome.');
        process.exit(1);
    }
    console.log('Using browser:', execPath);
    const browser = await puppeteer.launch({ headless: 'new', executablePath: execPath });
    const page = await browser.newPage();

    const filePath = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');

    // ── Full page screenshot (desktop 1440px) ──
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000)); // let animations settle

    await page.screenshot({
        path: 'screenshots/full-page-desktop.png',
        fullPage: true
    });
    console.log('✓ Full page desktop (1440px)');

    // ── Hero section only ──
    await page.screenshot({
        path: 'screenshots/hero-desktop.png',
        clip: { x: 0, y: 0, width: 1440, height: 900 }
    });
    console.log('✓ Hero section desktop');

    // ── Tablet view (768px) ──
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    await page.screenshot({
        path: 'screenshots/full-page-tablet.png',
        fullPage: true
    });
    console.log('✓ Full page tablet (768px)');

    // ── Mobile view (375px) ──
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    await page.screenshot({
        path: 'screenshots/full-page-mobile.png',
        fullPage: true
    });
    console.log('✓ Full page mobile (375px)');

    await page.screenshot({
        path: 'screenshots/hero-mobile.png',
        clip: { x: 0, y: 0, width: 375, height: 812 }
    });
    console.log('✓ Hero section mobile');

    await browser.close();
    console.log('\nAll screenshots saved to /screenshots');
})();
