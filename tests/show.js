// Draws a test case's page image with its expected boxes and the actual ones Auto Detect finds,
// matched the same way as the tests (tests/auto-detect.js), and saves it as a PNG:
//   green      expected, with an actual box matching it (the actual one thin blue, inside)
//   red        expected, with no actual box there
//   orange     actual, with nothing expected there
//   magenta    matched, but the tags differ (labelled "expected → actual")
//   grey       a problem the case skips (its "skip" in tests/cases/index.js), dashed
// Each box is labelled with its tag (the expected tag for a match). Also prints the same as a
// list, with each skip's reason and the case's to-dos.
//
//   node tests/show.js <app url ending in #test> <page image> [out.png]
//
// The page image is one of a case's, as tests/cases/index.js lists it, e.g.
// tests/cases/referral-form/referral_form_3c1x42_page1.png. Without out.png, the picture is
// saved beside where you run it, as <image name>.compare.png. The app must be served over http, as for ci.js. Uses the Chrome
// installed on the machine (PW_CHANNEL=chrome, the default); set PW_CHANNEL= to use
// Playwright's own Chromium instead.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');

(async () => {
  const [url, image, outArg] = process.argv.slice(2);
  if (!url || !image) { console.error('usage: node tests/show.js <app url ending in #test> <page image> [out.png]'); process.exit(2); }
  const m = image.replace(/\\/g, '/').match(/(?:^|\/)cases\/([^/]+)\/([^/]+)$/);
  if (!m) { console.error('the page image must be in a case folder: tests/cases/<folder>/<image>'); process.exit(2); }
  const [, folder, file] = m;
  const out = outArg || path.basename(file).replace(/\.[^.]+$/, '') + '.compare.png';
  const channel = process.env.PW_CHANNEL ?? 'chrome';
  const browser = await chromium.launch(channel ? { channel } : {});
  let failed = false;
  try {
    const page = await browser.newPage();
    page.on('pageerror', err => { console.error('page error:', err.message); failed = true; });
    await page.addInitScript(() => { window.eformMapperTestNoRun = true; });
    await page.goto(url);
    await page.waitForFunction(() => window.eformMapperTest && window.eformMapperTest.harness, null, { timeout: 60000 });
    const res = await page.evaluate(async ({ folder, file }) => {
      const T = window.eformMapperTest, H = T.harness;
      await H.loadScript('tests/cases/index.js');
      const entry = (window.TEST_CASE_LIST || []).find(e => e.folder === folder);
      if (!entry) throw new Error(`tests/cases/index.js has no case in folder "${folder}"`);
      const c = await H.loadCase(entry, H.fromServer());
      const pg = (await H.eformPages(c.html, c.images)).find(p => p.file === file);
      if (!pg) throw new Error(`"${file}" isn't one of the case's pages (${entry.images.join(', ')})`);
      // Auto Detect on this page alone, then the eForm built from what it found, read like the case's
      await H.detectOn(1, pg.imgData, pg.file);
      const draft = H.draftOf(1, 1);
      const built = (await H.eformPages(draft.html, draft.images))[0] || { boxes: [] };
      const r = H.compare(pg.boxes, built.boxes);
      // The case's skips, as the tests apply them: by test, page and the box's centre
      const inside = (b, [x, y, w, h]) => { const cx = b.x + b.width/2, cy = b.y + b.height/2; return cx >= x && cx <= x + w && cy >= y && cy <= y + h; };
      const skipFor = (key, b) => (Array.isArray(entry.skip) ? entry.skip : [])
        .find(k => k.test === key && (k.page == null || Number(k.page) === pg.n) && (!k.region || inside(b, k.region)));

      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = pg.imgData; });
      const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(0, 0, cv.width, cv.height);   // (the page faded, the boxes clear)
      const lw = Math.max(2, Math.round(img.width/600)), font = Math.max(11, Math.round(img.width/110));
      const box = (b, color, width = lw, dash = []) => {
        ctx.setLineDash(dash); ctx.strokeStyle = color; ctx.lineWidth = width;
        ctx.strokeRect(b.x, b.y, b.width, b.height); ctx.setLineDash([]);
      };
      const label = (b, text, color) => {
        if (!text) return;
        ctx.font = `${font}px sans-serif`;
        const w = ctx.measureText(text).width + 6, y = Math.max(font + 2, b.y - 2);
        ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(b.x, y - font - 1, w, font + 4);
        ctx.fillStyle = color; ctx.fillText(text, b.x + 3, y);
      };
      const where = (b) => `${b.kind === 'tick' ? 'tick box' : 'field'}${b.id ? ` "${b.id}"` : ''} at (${Math.round(b.x)}, ${Math.round(b.y)})` +
        (b.kind === 'tick' ? '' : ` ${Math.round(b.width)}×${Math.round(b.height)}`);
      const tagOf = (t) => t ? `oscarDB="${t}"` : 'no tag';
      // A problem: drawn in its colour, or grey when the case skips it; listed either way
      const lines = [], skipped = [];
      let problems = 0;
      const problem = (key, b, color, text, line, dash = []) => {
        const k = skipFor(key, b);
        box(b, k ? '#9ca3af' : color, lw*1.5, k ? [lw*2, lw*2] : dash);
        label(b, k ? `skipped: ${text}` : text, k ? '#6b7280' : color);
        if (k) skipped.push(`${line}\n      skipped: ${k.reason || '(no reason given)'}`); else { lines.push(line); problems++; }
      };
      r.pairs.forEach(([e, f]) => {
        box(f, '#2563eb', Math.max(1, lw/2));
        if (e.tag !== f.tag) problem('tags', e, '#a21caf', `${e.tag || '(none)'} → ${f.tag || '(none)'}`, `tags differ: ${where(e)}: expected ${tagOf(e.tag)}, actual ${tagOf(f.tag)}`);
        else { box(e, '#16a34a', lw*1.5); label(e, e.tag, '#15803d'); }
      });
      r.missing.forEach(e => problem(e.kind === 'tick' ? 'ticks' : 'fields', e, '#dc2626', e.tag ? `missing: ${e.tag}` : 'missing',
                                     `missing: expected ${where(e)}${e.tag ? ' ' + tagOf(e.tag) : ''}`));
      r.extra.forEach(f => problem(f.kind === 'tick' ? 'extraTicks' : 'extraFields', f, '#ea580c', f.tag ? `extra: ${f.tag}` : 'extra',
                                   `extra: actual ${where(f)}${f.tag ? ' ' + tagOf(f.tag) : ''}`, [lw*3, lw*2]));
      const n = (k, list) => list.filter(b => b.kind === k).length;
      const summary = `${pg.boxes.length} expected (${n('tick', pg.boxes)} tick boxes, ${n('write', pg.boxes)} fields), ${built.boxes.length} actual: ` +
        `${r.pairs.length} matched, ${r.pairs.filter(([e, f]) => e.tag !== f.tag).length} with tags that differ, ${r.missing.length} missing, ${r.extra.length} extra` +
        ` (${problems} not skipped, ${skipped.length} skipped)`;
      const todos = Object.entries(entry.todo || {}).map(([k, v]) => `to do (${k}): ${v}`);
      return { png: cv.toDataURL('image/png'), summary, lines, skipped, todos };
    }, { folder, file });
    fs.writeFileSync(out, Buffer.from(res.png.split(',')[1], 'base64'));
    console.log(res.summary);
    res.lines.forEach(l => console.log('  ' + l));
    res.skipped.forEach(l => console.log('  ' + l));
    res.todos.forEach(l => console.log('  ' + l));
    console.log(`Saved ${out}`);
  } catch (err) {
    console.error('Could not draw it:', err.message || err);
    failed = true;
  } finally {
    await browser.close();
  }
  process.exit(failed ? 1 : 0);
})();
