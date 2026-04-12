/**
 * JRH Engineering — JavaScript Performance Audit Script (Fix 16)
 *
 * USAGE: Paste this entire script into your browser console on any page
 * to audit third-party script domains and sort them by count.
 *
 * It also reports:
 *  - Total script count (inline vs external)
 *  - Domains sorted by number of scripts loaded
 *  - Images missing loading="lazy" below the fold
 */

(function performanceAudit() {
  console.log("%c=== JRH Engineering — JS Performance Audit ===", "color:#0B2545;font-size:16px;font-weight:bold");

  // 1. Count all <script> elements
  const scripts = document.querySelectorAll("script");
  let inlineCount = 0;
  let externalCount = 0;
  const domainMap = {};

  scripts.forEach(function (s) {
    if (!s.src) {
      inlineCount++;
      return;
    }
    externalCount++;
    try {
      const url = new URL(s.src);
      const domain = url.hostname;
      domainMap[domain] = (domainMap[domain] || 0) + 1;
    } catch (e) {
      domainMap["[parse error]"] = (domainMap["[parse error]"] || 0) + 1;
    }
  });

  console.log(`\nTotal <script> tags: ${scripts.length}`);
  console.log(`  Inline: ${inlineCount}`);
  console.log(`  External: ${externalCount}`);

  // 2. Sort domains by count (descending)
  const sorted = Object.entries(domainMap).sort(function (a, b) { return b[1] - a[1]; });

  console.log("\n%c--- External Script Domains (sorted by count) ---", "color:#13497B;font-weight:bold");
  console.table(
    sorted.map(function (entry) {
      return { Domain: entry[0], Scripts: entry[1] };
    })
  );

  // 3. Check for Wix-specific heavy hitters
  const wixDomains = sorted.filter(function (entry) {
    return entry[0].includes("wix") || entry[0].includes("parastorage") || entry[0].includes("edgeio");
  });

  if (wixDomains.length > 0) {
    console.log("\n%c--- Wix Platform Scripts Detected ---", "color:#D4A843;font-weight:bold");
    wixDomains.forEach(function (entry) {
      console.log(`  ${entry[0]}: ${entry[1]} scripts`);
    });
    console.log("\nTIP: Review installed Wix apps at wix.com > Dashboard > Apps.");
    console.log("Common heavy contributors:");
    console.log("  - Wix Chat widget");
    console.log("  - Wix Bookings / Wix Stores (if not used)");
    console.log("  - Wix Analytics (duplicate with Google Analytics)");
    console.log("  - Wix Members area (if not needed)");
    console.log("  - Third-party form/popup apps");
  }

  // 4. Image audit: lazy vs eager
  const images = document.querySelectorAll("img");
  let missingLazy = 0;
  const foldY = window.innerHeight;

  images.forEach(function (img) {
    const rect = img.getBoundingClientRect();
    const belowFold = rect.top > foldY;
    if (belowFold && img.loading !== "lazy") {
      missingLazy++;
    }
  });

  console.log(`\n%c--- Image Loading Audit ---`, "color:#13497B;font-weight:bold");
  console.log(`Total images: ${images.length}`);
  console.log(`Below-fold images missing loading="lazy": ${missingLazy}`);
  console.log('TIP: Hero/above-fold images should use loading="eager" (or omit the attribute).');
  console.log('     All below-fold images should use loading="lazy".');

  console.log("\n%c=== Audit Complete ===", "color:#28A745;font-weight:bold");
})();
