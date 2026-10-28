// Prints everything Auto Detect finds on each test case's page images, exactly: each field's
// type, name, tag, and position and size to two decimal places. For a change that shouldn't
// change what Auto Detect finds (a tidy-up, a refactor): take a snapshot before and after, and
// compare them. Two snapshots of the same code are always the same, so any difference is the
// change's. (The tests themselves allow a margin; this doesn't.)
//
//   node tests/snapshot.js <app url ending in #test> [image paths...] > before.txt
//   ... make the change ...
//   node tests/snapshot.js <app url ending in #test> [image paths...] > after.txt
//   diff before.txt after.txt
//
// Without image paths, it takes every image in tests/cases. Paths are relative to the folder
// the app is served from. The app must be served over http, as for ci.js. Uses the Chrome
// installed on the machine (PW_CHANNEL=chrome, the default); set PW_CHANNEL= to use
// Playwright's own Chromium instead.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');

(async () => {
  const url = process.argv[2];
  if (!url) { console.error('usage: node tests/snapshot.js <app url ending in #test> [image paths...]'); process.exit(2); }
  let images = process.argv.slice(3);
  if (!images.length){
    const cases = path.join(__dirname, 'cases');
    images = fs.readdirSync(cases, { withFileTypes: true }).filter(d => d.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))
      .flatMap(d => fs.readdirSync(path.join(cases, d.name)).filter(f => /\.(png|jpe?g)$/i.test(f)).sort().map(f => `tests/cases/${d.name}/${f}`));
  }
  const channel = process.env.PW_CHANNEL ?? 'chrome';
  const browser = await chromium.launch(channel ? { channel } : {});
  let failed = false;
  try {
    const page = await browser.newPage();
    page.on('pageerror', err => { console.error('page error:', err.message); failed = true; });
    // (the app with #test loads tests/auto-detect.js: answer with nothing, so the tests don't run)
    await page.route('**/tests/auto-detect.js', r => r.fulfill({ contentType: 'application/javascript', body: 'window.__snapshotReady = true;' }));
    await page.goto(url);
    await page.waitForFunction(() => window.__snapshotReady && window.eformMapperTest);
    const base = new URL('.', url).href;
    for (const img of images){
      // Each image on page 1 of the app, from no fields at all, as the tests do
      const lines = await page.evaluate(async (src) => {
        const T = window.eformMapperTest;
        const blob = await fetch(src).then(r => { if (!r.ok) throw new Error('Could not read ' + src); return r.blob(); });
        const data = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
        const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = data; });
        T.createPageDOM(1);
        T.state.pages[1] = { imgData: data, naturalW: im.width, naturalH: im.height, fileName: src };
        T.state.fields = [];
        T.setCurrentPage(1);
        await T.detectCurrentPage();
        return T.state.fields.map(f => [f.type, f.name, f.oscarTag || '', f.x.toFixed(2), f.y.toFixed(2), f.width.toFixed(2), f.height.toFixed(2)].join(' | '));
      }, base + img);
      console.log(`### ${img} (${lines.length})`);
      lines.forEach(l => console.log(l));
    }
  } catch (err) {
    console.error('Could not take the snapshot:', err.message || err);
    failed = true;
  } finally {
    await browser.close();
  }
  process.exit(failed ? 1 : 0);
})();
