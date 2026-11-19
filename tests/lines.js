// Tests the line test alone (`isLine`): runs Auto Detect's first pass (no OCR) on each case page
// listed in tests/cases/lines.js, and on its variations, and checks each band it found against
// the list: a line that bounds a field must be taken for a line, and words, underlines, white
// letters in a bar and barcodes must not. Prints what went wrong and exits with 1 if anything
// did.
//
//   node tests/lines.js <app url ending in #test> [--variations] [--page "<case folder> p<n>"]
//
// Each band the app finds is matched to the suspect on the list nearest it, by how far their
// edges are apart, among those it overlaps along at least half the shorter of the two with its
// middle within half their heights and a canvas pixel and a half of the suspect's; a
// variation's bands are scaled back to the page first. A suspect
// a line must have a band taken for a line; a suspect not a line must have none. A band matching
// no suspect is counted (the band finder found something new), not tested. The app must be
// served over http, as for ci.js. Uses the Chrome installed on the machine (PW_CHANNEL=chrome,
// the default); set PW_CHANNEL= to use Playwright's own Chromium instead.
//
// The cases are split into --jobs N shards (the default: one per processor, up to 4), each run in
// a browser of its own at the same time; the results are printed in the cases' order.
const { chromium } = require('playwright');
const os = require('os');

// One shard's runs: each of its case pages and their copies, with the bands found on them
async function runShard(url, channel, variations, onlyPage, index, of){
  const browser = await chromium.launch(channel ? { channel } : {});
  try {
    const page = await browser.newPage();
    page.on('pageerror', err => console.error('page error:', err.message));
    await page.addInitScript(() => { window.eformMapperTestNoRun = true; });
    await page.goto(url);
    await page.waitForFunction(() => window.eformMapperTest && window.eformMapperTest.harness, null, { timeout: 60000 });
    return await page.evaluate(async ({ variations, onlyPage, index, of }) => {
      const H = window.eformMapperTest.harness;
      await H.loadScript('tests/cases/index.js'); await H.loadScript('tests/cases/lines.js');
      const lists = window.LINE_SUSPECTS, out = [], owner = H.shardOf(window.TEST_CASE_LIST, of);
      for (const [ei, entry] of window.TEST_CASE_LIST.entries()){
        if (owner[ei] !== index) continue;
        const c = await H.loadCase(entry, H.fromServer());
        for (const pg of await H.eformPages(c.html, c.images)){
          const name = `${entry.folder} p${pg.n}`;
          if (!lists[name] || (onlyPage && name !== onlyPage)) continue;
          const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = pg.imgData; });
          const copies = [{ name: 'page', url: pg.imgData, scale: 1, pdf: H.pdfPage(c, pg.n) }];
          if (variations && entry.variations) for (const V of H.VARIATIONS){ const m = V.make(img); copies.push({ name: V.name, url: m.url, scale: m.scale, pdf: null }); }
          for (const cp of copies){
            window.eformMapperLineLog = [];
            await H.detectOn(1, cp.url, pg.file, { readWords: false }, false, cp.pdf);
            const log = window.eformMapperLineLog; window.eformMapperLineLog = null;
            // (a fillable PDF's page, detected from its form fields, has no line pass)
            if (!log.length) continue;
            const k = cp.scale, { scale } = log[log.length - 1];
            out.push({ order: ei, page: name, copy: cp.name, px: 1/(scale*k), suspects: lists[name],
                       bands: log[log.length - 1].bands.map(b => ({ ...b, x: b.x/k, y: b.y/k, width: b.width/k, height: b.height/k })) });
          }
        }
      }
      return out;
    }, { variations, onlyPage, index, of });
  } finally {
    await browser.close();
  }
}

(async () => {
  const args = process.argv.slice(2), url = args[0], variations = args.includes('--variations');
  const pi = args.indexOf('--page'), onlyPage = pi >= 0 ? args[pi + 1] : null;
  const ji = args.indexOf('--jobs'), jobsAsked = ji >= 0 ? Number(args[ji + 1]) : Math.min(4, os.cpus().length);
  const jobs = Number.isInteger(jobsAsked) && jobsAsked >= 1 ? jobsAsked : 1;
  if (!url) { console.error('usage: node tests/lines.js <app url ending in #test> [--variations] [--page "<case folder> p<n>"] [--jobs N]'); process.exit(2); }
  const channel = process.env.PW_CHANNEL ?? 'chrome';
  let failed = true;
  try {
    // (each shard's runs, back in the cases' order: a case's runs are all in one shard, in order)
    const runs = (await Promise.all([...Array(jobs).keys()].map(k => runShard(url, channel, variations, onlyPage, k, jobs))))
      .flat().sort((a, b) => a.order - b.order);

    let bad = 0, checked = 0, unmatched = 0;
    for (const r of runs){
      // Each band to the suspect nearest it
      const got = r.suspects.map(() => []);
      for (const b of r.bands){
        let best = -1, bestOff = Infinity;
        r.suspects.forEach(([x, y, w, h], i) => {
          const along = Math.min(x + w, b.x + b.width) - Math.max(x, b.x);
          if (along < 0.5*Math.min(w, b.width)) return;
          const dy = Math.abs((y + h/2) - (b.y + b.height/2));
          if (dy > (h + b.height)/2 + 1.5*r.px) return;
          // (the nearest: by how far its edges are from the band's, where bands lie close together)
          const off = Math.abs(y - b.y) + Math.abs(y + h - b.y - b.height) + Math.abs(x - b.x) + Math.abs(x + w - b.x - b.width);
          if (off < bestOff){ best = i; bestOff = off; }
        });
        if (best < 0) unmatched++; else got[best].push(b);
      }
      const problems = [];
      r.suspects.forEach(([x, y, w, h, line, ], i) => {
        checked++;
        const taken = got[i].some(b => b.line);
        if (line && !got[i].length) problems.push(`line at ${x},${y} (${w} wide): not found`);
        else if (line && !taken) problems.push(`line at ${x},${y} (${w} wide): not taken for a line`);
        else if (!line && taken) problems.push(`not a line at ${x},${y} (${w} wide): taken for a line`);
      });
      bad += problems.length;
      console.log(`${problems.length ? '✘' : '✔'} ${r.page} (${r.copy})`);
      problems.forEach(p => console.log('      ' + p));
    }
    console.log(`\n${checked} suspects checked on ${runs.length} images, ${bad} wrong; ${unmatched} bands matched no suspect`);
    failed = bad > 0 || !runs.length;
  } catch (err) {
    console.error('Could not run the line tests:', err.message || err);
  }
  process.exit(failed ? 1 : 0);
})();
