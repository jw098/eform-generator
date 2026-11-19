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
// To see why a check does what it does, add --log: everything the app logs to the console while
// it reads each image is printed after that image's fields, each line starting "> ". Put a
// console.log in the app for the values you want (and take it out after).
//
//   node tests/snapshot.js <app url ending in #test> --log [image paths...]
//
// Without image paths, it takes every image in tests/cases, and each page of every session
// there (a case given as a session: its pages are in its .json). Paths are relative to the folder
// the app is served from. The app must be served over http, as for ci.js. Uses the Chrome
// installed on the machine (PW_CHANNEL=chrome, the default); set PW_CHANNEL= to use
// Playwright's own Chromium instead.
//
// The pages are read by several browsers at once, each taking the next page to read (--jobs N;
// the default: one per two processors, up to 4, as each keeps two busy, the page's and OCR's).
// The output is in the same order whatever the jobs.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os');

(async () => {
  const url = process.argv[2];
  if (!url) { console.error('usage: node tests/snapshot.js <app url ending in #test> [--log] [--jobs N] [image paths...]'); process.exit(2); }
  const args = process.argv.slice(3), log = args.includes('--log');
  const ji = args.indexOf('--jobs'), jobsAsked = ji >= 0 ? Number(args[ji + 1]) : Math.max(1, Math.min(4, Math.floor(os.cpus().length/2)));
  let images = args.filter((a, i) => a !== '--log' && a !== '--jobs' && !(ji >= 0 && i === ji + 1));
  // (each page to read: { label, src } for an image file, { label, data } for a session's page)
  let pages = images.map(img => ({ label: img, src: img }));
  if (!images.length){
    const cases = path.join(__dirname, 'cases');
    pages = fs.readdirSync(cases, { withFileTypes: true }).filter(d => d.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))
      .flatMap(d => fs.readdirSync(path.join(cases, d.name)).sort().flatMap(f => {
        const rel = `tests/cases/${d.name}/${f}`;
        if (/\.(png|jpe?g)$/i.test(f)) return [{ label: rel, src: rel }];
        if (!/\.json$/i.test(f)) return [];
        const session = JSON.parse(fs.readFileSync(path.join(cases, d.name, f), 'utf8'));
        return Object.keys(session.pages || {}).map(Number).sort((a, b) => a - b)
          .map(n => ({ label: `${rel} page ${n}`, data: session.pages[n].imgData }));
      }));
  }
  const jobs = Math.max(1, Math.min(pages.length, Number.isInteger(jobsAsked) && jobsAsked >= 1 ? jobsAsked : 1));
  const channel = process.env.PW_CHANNEL ?? 'chrome';
  const base = new URL('.', url).href;
  const outputs = new Array(pages.length);              // (each page's lines, printed in order at the end)
  let next = 0, failed = false;
  // One browser reading pages, the next one not yet taken each time, until none are left
  async function worker(){
    const browser = await chromium.launch(channel ? { channel } : {});
    try {
      const page = await browser.newPage();
      const logged = [];
      if (log) page.on('console', m => logged.push(m.text()));
      page.on('pageerror', err => { console.error('page error:', err.message); failed = true; });
      // (the app with #test loads tests/auto-detect.js: answer with nothing, so the tests don't run)
      await page.route('**/tests/auto-detect.js', r => r.fulfill({ contentType: 'application/javascript', body: 'window.__snapshotReady = true;' }));
      await page.goto(url);
      await page.waitForFunction(() => window.__snapshotReady && window.eformMapperTest);
      while (next < pages.length){
        const i = next++, pg = pages[i];
        logged.length = 0;
        // Each image on page 1 of the app, from no fields at all, as the tests do
        const lines = await page.evaluate(async ({ src, given, label }) => {
          const T = window.eformMapperTest;
          const data = given || await (async () => {
            const blob = await fetch(src).then(r => { if (!r.ok) throw new Error('Could not read ' + src); return r.blob(); });
            return new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
          })();
          const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = data; });
          T.createPageDOM(1);
          T.state.pages[1] = { imgData: data, naturalW: im.width, naturalH: im.height, fileName: label };
          T.state.fields = [];
          T.setCurrentPage(1);
          await T.detectCurrentPage();
          return T.state.fields.filter(f => f.type !== 'fontbuttons').map(f => [f.type, f.name, f.oscarTag || '', f.x.toFixed(2), f.y.toFixed(2), f.width.toFixed(2), f.height.toFixed(2)].join(' | '));
        }, { src: pg.src && base + pg.src, given: pg.data || null, label: pg.src ? base + pg.src : pg.label });
        outputs[i] = [`### ${pg.label} (${lines.length})`, ...lines, ...logged.map(l => '> ' + l)];
      }
    } finally {
      await browser.close();
    }
  }
  try {
    await Promise.all([...Array(jobs)].map(worker));
    outputs.forEach(o => o.forEach(l => console.log(l)));
  } catch (err) {
    console.error('Could not take the snapshot:', err.message || err);
    failed = true;
  }
  process.exit(failed ? 1 : 0);
})();
