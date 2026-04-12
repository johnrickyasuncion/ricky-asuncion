const puppeteer = require('puppeteer-core');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

const pages = [
    { url: 'https://ricky-asuncion.vercel.app/', name: 'portfolio-jewelry-live', label: 'Tester.io Jewelry' },
    { url: 'https://ricky-asuncion.vercel.app/TesterTech.html', name: 'portfolio-smartwatch-live', label: 'Smart Watch Pro' },
];

async function run() {
    const browser = await puppeteer.launch({
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
        defaultViewport: { width: 1920, height: 1080 },
    });

    for (const page of pages) {
        console.log(`  Capturing: ${page.label} (${page.url})`);
        try {
            const tab = await browser.newPage();
            await tab.setViewport({ width: 1920, height: 1080 });
            await tab.goto(page.url, { waitUntil: 'networkidle2', timeout: 30000 });
            await new Promise(r => setTimeout(r, 3000));
            await tab.evaluate(() => window.scrollBy(0, 300));
            await new Promise(r => setTimeout(r, 800));
            await tab.evaluate(() => window.scrollTo(0, 0));
            await new Promise(r => setTimeout(r, 500));
            await tab.screenshot({
                path: path.join(SCREENSHOT_DIR, `${page.name}.jpg`),
                type: 'jpeg', quality: 90,
                clip: { x: 0, y: 0, width: 1920, height: 1080 },
            });
            console.log(`    -> ${page.name}.jpg`);
            await tab.close();
        } catch (err) {
            console.error(`    FAILED: ${err.message}`);
        }
    }

    await browser.close();
    console.log('Done!');
}

run().catch(err => { console.error(err); process.exit(1); });
