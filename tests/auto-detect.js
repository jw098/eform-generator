// Runs the Auto Detect tests: the machinery only. The test cases are finished eForms in
// tests/cases; tests/README.md explains how it all works.
//
// The app loads this file when opened with #test at the end of its address. For each test
// case (an eForm and its page images) it puts each page in the app, runs Auto Detect there and
// compares what was found with the eForm's own fields: where the boxes are, and their oscarDB
// tags (not their names). Then it runs Auto Detect on poorer copies of the referral form (tick
// boxes only). Results show in a panel at the top right, which can also add a test case.
(async () => {
  const T = window.eformMapperTest;

  // How far a found box may be from the eForm's: each edge within 10 pixels, or within 20% of
  // the box's size in that direction when that is more (in pixels of the page image)
  const MARGIN_PX = 10, MARGIN_SHARE = 0.2;

  // ----- A small test runner -----
  // (group: the panel's heading for a test, a case or the variations; short: its line there)
  let tests = [];
  const test = (name, fn, opts = {}) => tests.push({ name, fn, todo: opts.todo, group: opts.group || '', short: opts.short || name });
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const sameList = (actual, expected, message) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected))
      throw new Error(`${message}:\n  ${actual.join('\n  ')}`);
  };

  const loadScript = (src) => new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src));
    document.body.appendChild(s);
  });
  const loadImage = (src) => new Promise((res, rej) => {
    const img = new Image(); img.onload = () => res(img); img.onerror = () => rej(new Error('Could not read an image')); img.src = src;
  });

  // ----- Test cases: finished eForms -----
  // A case is { name, html, images: { 'file name.png': 'data:image/png;base64,...' } }: the
  // eForm's HTML and the page images it shows. Its expected boxes are the eForm's fields where
  // the browser lays them out: the eForm is rendered in a hidden frame with its scripts off
  // (only its layout counts), each page's background image put in, and every visible field
  // measured against it, so its CSS (a class giving tick boxes their size), margins and
  // offsets all count, whatever made the eForm.
  //  - Background images: those with an id starting BGImage (else every image showing one of
  //    the case's images). Each shows the image its src names, or else the one a script puts
  //    there ("changeImage('page.png', 'BGImage')"), or else the largest image not yet used.
  //  - Fields: inputs, text areas and lists, except hidden ones, buttons, and anything inside
  //    a DoNotPrint block (on-screen controls). Tick boxes are checkboxes and radio buttons, and
  //    inputs with an Xbox or xMarkOnly class. Each field's tag is its oscarDB attribute.
  const kindOf = (type) => (type === 'checkbox' || type === 'xbox') ? 'tick' : 'write';
  const fileOf = (src) => decodeURIComponent(String(src).split(/[?#]/)[0].split(/[\/}=]/).pop());
  async function casePages(c){
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-same-origin');   // its layout, without running its scripts
    frame.style.cssText = 'position:absolute;left:-20000px;top:0;width:1600px;height:30000px;border:0;visibility:hidden';
    const loaded = new Promise(res => { frame.onload = res; });
    frame.srcdoc = c.html;
    document.body.appendChild(frame);
    try {
      await loaded;
      const doc = frame.contentDocument;
      if (!doc) throw new Error('the eForm could not be laid out in this browser');
      let bgs = [...doc.querySelectorAll('img')].filter(i => /^bgimage/i.test(i.id || ''));
      if (!bgs.length) bgs = [...doc.querySelectorAll('img')].filter(i => c.images[fileOf(i.getAttribute('src') || '')]);
      if (!bgs.length) throw new Error('the eForm has no background image (an <img> with an id starting BGImage)');
      const bySize = Object.keys(c.images).sort((a, b) => c.images[b].length - c.images[a].length);
      const used = new Set();
      const pages = [];
      for (const bg of bgs){
        let file = fileOf(bg.getAttribute('src') || '');
        if (!c.images[file]){
          const m = c.html.match(new RegExp(`["']([^"']+\\.(?:png|jpe?g|gif))["']\\s*,\\s*["']${bg.id}["']`, 'i'));
          file = m && c.images[fileOf(m[1])] ? fileOf(m[1]) : bySize.find(f => !used.has(f));
        }
        if (!file) throw new Error(`no image for ${bg.id || 'a background image'}`);
        used.add(file);
        await new Promise(res => { bg.onload = bg.onerror = res; bg.src = c.images[file]; });
        pages.push({ n: pages.length + 1, file, imgData: c.images[file], bg, expected: [] });
      }
      const fields = [...doc.querySelectorAll('input, textarea, select')].filter(el => {
        const type = (el.getAttribute('type') || '').toLowerCase();
        if (['hidden', 'button', 'submit', 'reset', 'image', 'file'].includes(type)) return false;
        if (el.closest('[class*="donotprint" i], [class*="noprint" i]')) return false;
        const st = frame.contentWindow.getComputedStyle(el), r = el.getBoundingClientRect();
        return st.display !== 'none' && st.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      });
      fields.forEach(el => {
        const r = el.getBoundingClientRect(), cx = r.left + r.width/2, cy = r.top + r.height/2;
        const pg = pages.find(p => { const b = p.bg.getBoundingClientRect(); return cx >= b.left && cx <= b.right && cy >= b.top && cy <= b.bottom; });
        if (!pg) return;                                     // (off the page: an on-screen control)
        const b = pg.bg.getBoundingClientRect(), k = pg.bg.naturalWidth / b.width;
        const type = (el.getAttribute('type') || '').toLowerCase();
        const tick = type === 'checkbox' || type === 'radio' || /(^|\s)(xbox|xmarkonly)(\s|$)/i.test(el.className || '');
        pg.expected.push({ kind: tick ? 'tick' : 'write', x: (r.left - b.left)*k, y: (r.top - b.top)*k, width: r.width*k, height: r.height*k,
                           tag: el.getAttribute('oscardb') || '' });
      });
      pages.forEach(p => delete p.bg);
      return pages;
    } finally {
      frame.remove();
    }
  }

  // Put an image on page n of the app and run Auto Detect on it, from no fields at all. What
  // it found stays on that page to look at afterwards (keep: false for a page reused at once).
  const onShow = new Map();                              // page -> its fields, put back at the end
  async function detectOn(n, imgData, fileName, opts, keep = true){
    const img = await loadImage(imgData);
    T.createPageDOM(n);
    T.state.pages[n] = { imgData, naturalW: img.width, naturalH: img.height, fileName };
    document.getElementById('img' + n).src = imgData;
    T.state.fields = [];
    T.setCurrentPage(n);
    await T.detectCurrentPage(opts);
    onShow.set(n, keep ? T.state.fields.slice() : []);
    return T.state.fields.map(f => ({ kind: kindOf(f.type), x: f.x, y: f.y, width: f.width, height: f.height, tag: f.oscarTag || '' }));
  }
  const showAll = () => { T.state.fields = [...onShow.values()].flat(); T.setCurrentPage(1); };

  // ----- Comparing found boxes with the eForm's -----
  const close = (a, b) => {
    const mx = Math.max(MARGIN_PX, MARGIN_SHARE*Math.max(a.width, b.width));
    const my = Math.max(MARGIN_PX, MARGIN_SHARE*Math.max(a.height, b.height));
    return Math.abs(a.x - b.x) <= mx && Math.abs(a.x + a.width - b.x - b.width) <= mx &&
           Math.abs(a.y - b.y) <= my && Math.abs(a.y + a.height - b.y - b.height) <= my;
  };
  const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.width - b.width) + Math.abs(a.height - b.height);
  const where = (f, withTag = true) => `${f.kind === 'tick' ? 'tick box' : 'field'} at (${Math.round(f.x)}, ${Math.round(f.y)})` +
    (f.kind === 'tick' ? '' : ` ${Math.round(f.width)}×${Math.round(f.height)}`) + (withTag && f.tag ? ` oscarDB="${f.tag}"` : '');
  // Pairs each expected box with the closest found box of its kind within the margin
  function compare(expected, found){
    const left = [...found], pairs = [], missing = [];
    expected.forEach(e => {
      let best = -1;
      left.forEach((f, i) => { if (f.kind === e.kind && close(e, f) && (best < 0 || distance(e, f) < distance(e, left[best]))) best = i; });
      if (best < 0) missing.push(e); else pairs.push([e, left.splice(best, 1)[0]]);
    });
    return { pairs, missing, extra: left };
  }

  // A case's tests; returns the function that runs Auto Detect on its pages (from page
  // firstPage of the app on) and resolves to how many pages it used
  function caseTests(c, entry, firstPage){
    const todo = entry.todo || {};
    let pages = null, error = null;
    const run = async () => {
      try {
        pages = await casePages(c);
        for (const pg of pages) pg.result = compare(pg.expected, await detectOn(firstPage + pg.n - 1, pg.imgData, pg.file));
      } catch (err) { error = err; }
      return pages ? pages.length : 1;
    };
    const lines = (fn) => {
      if (error) throw new Error('Could not run this case: ' + (error.message || error));
      return pages.flatMap(pg => fn(pg.result).map(l => (pages.length > 1 ? `page ${pg.n}: ` : '') + l));
    };
    const t = (short, key, fn, message) => test(`${c.name}: ${short}`, () => sameList(lines(fn), [], message),
                                                { group: c.name, short, todo: todo[key] });
    t('finds every tick box in the eForm', 'ticks', r => r.missing.filter(e => e.kind === 'tick').map(e => where(e)), 'not found');
    t('finds every field to write in', 'fields', r => r.missing.filter(e => e.kind === 'write').map(e => where(e)), 'not found');
    t('finds no tick box the eForm doesn\'t have', 'extraTicks', r => r.extra.filter(f => f.kind === 'tick').map(f => where(f)), 'found, but not in the eForm');
    t('finds no field the eForm doesn\'t have', 'extraFields', r => r.extra.filter(f => f.kind === 'write').map(f => where(f)), 'found, but not in the eForm');
    t('gives each field the eForm\'s oscarDB tag', 'tags', r => r.pairs.filter(([e, f]) => e.tag !== f.tag)
      .map(([e, f]) => `${where(e, false)}: got ${f.tag ? `"${f.tag}"` : 'no tag'}, want ${e.tag ? `"${e.tag}"` : 'no tag'}`), 'wrong tags');
    return run;
  }

  // ----- Variations of the referral form: tick boxes on poorer copies -----
  // Each copy is made here from the referral form's page (no extra image files): resized as
  // if scanned at another resolution, blurred, speckled, saved as a rough JPEG, tilted, turned
  // into a fax, printed faint, or with boxes ticked by hand. Auto Detect runs on each (without
  // reading words) and must find the eForm's tick boxes and nothing else. A copy it can't
  // handle yet is a to-do whose message says how many it found.
  const VARIED_CASE = 'referral-form';
  let VARIED_BOXES = [];                                  // the referral form's tick boxes, once loaded
  const canvasFor = (w, h) => { const c = document.createElement('canvas'); c.width = Math.round(w); c.height = Math.round(h); return c; };
  // Draw the page at k times its size (white behind it)
  const drawn = (img, k = 1) => {
    const c = canvasFor(img.width*k, img.height*k), ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, c.width, c.height);
    return c;
  };
  // Change each pixel's grey level
  const eachGrey = (c, fn) => {
    const ctx = c.getContext('2d'), d = ctx.getImageData(0, 0, c.width, c.height), px = d.data;
    for (let i=0, j=0; j<px.length; i++, j+=4){ const v = fn(Math.round(0.299*px[j] + 0.587*px[j+1] + 0.114*px[j+2]), i); px[j] = px[j+1] = px[j+2] = v; }
    ctx.putImageData(d, 0, 0); return c;
  };
  // Gaussian blur of the grey levels (sigma in pixels), the same in every browser
  const blurred = (c, sigma) => {
    const r = Math.ceil(sigma*3), k = []; let sum = 0;
    for (let i=-r; i<=r; i++){ const v = Math.exp(-i*i/(2*sigma*sigma)); k.push(v); sum += v; }
    const W = c.width, H = c.height, a = new Float32Array(W*H), b = new Float32Array(W*H);
    eachGrey(c, (v, i) => { a[i] = v; return v; });
    for (let y=0; y<H; y++) for (let x=0; x<W; x++){ let t = 0; for (let i=-r; i<=r; i++) t += k[i+r]*a[y*W + Math.min(W-1, Math.max(0, x+i))]; b[y*W+x] = t/sum; }
    for (let y=0; y<H; y++) for (let x=0; x<W; x++){ let t = 0; for (let i=-r; i<=r; i++) t += k[i+r]*b[Math.min(H-1, Math.max(0, y+i))*W + x]; a[y*W+x] = t/sum; }
    return eachGrey(c, (v, i) => Math.round(a[i]));
  };
  // Repeatable random numbers, so a speckled copy is the same every run
  const random = (seed) => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const png = (c) => c.toDataURL('image/png');
  const same = (k = 1) => (x, y) => [x*k, y*k];
  const resized = (k) => (img) => ({ url: png(drawn(img, k)), map: same(k), scale: k });
  const tilted = (deg) => (img) => {
    // Turned anticlockwise about the middle, as a crooked scan
    const a = deg*Math.PI/180, c = drawn(img), ctx = c.getContext('2d'), cx = c.width/2, cy = c.height/2;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.translate(cx, cy); ctx.rotate(-a); ctx.translate(-cx, -cy); ctx.drawImage(img, 0, 0);
    const map = (x, y) => { const dx = x-cx, dy = y-cy; return [cx + dx*Math.cos(a) + dy*Math.sin(a), cy - dx*Math.sin(a) + dy*Math.cos(a)]; };
    return { url: png(c), map, scale: 1 };
  };
  const VARIATIONS = [
    { name: 'half size (scanned at half the resolution)', make: resized(0.5), todo: 'not all found yet' },
    { name: '0.7× size', make: resized(0.7) },
    { name: '1.5× size', make: resized(1.5) },
    { name: '2× size', make: resized(2) },
    { name: '2.5× size (a high-resolution scan)', make: resized(2.5) },
    { name: '3× size', make: resized(3) },
    { name: 'blurred 1px', make: (img) => ({ url: png(blurred(drawn(img), 1)), map: same(), scale: 1 }) },
    { name: 'blurred 2px', make: (img) => ({ url: png(blurred(drawn(img), 2)), map: same(), scale: 1 }), todo: 'not all found yet' },
    { name: 'speckled (1% of pixels)', make: (img) => { const rnd = random(1);
        return { url: png(eachGrey(drawn(img), v => rnd() < 0.01 ? (rnd() < 0.5 ? 0 : 255) : v)), map: same(), scale: 1 }; }, todo: 'not all found yet' },
    { name: 'rough JPEG (quality 30)', make: (img) => ({ url: drawn(img).toDataURL('image/jpeg', 0.3), map: same(), scale: 1 }) },
    { name: 'tilted 1°', make: tilted(1) },
    { name: 'tilted 2.5°', make: tilted(2.5) },
    { name: 'fax (2/3 size, black and white only)', make: (img) => ({ url: png(eachGrey(drawn(img, 2/3), v => v < 160 ? 0 : 255)), map: same(2/3), scale: 2/3 }),
      todo: 'not all found yet' },
    { name: 'faint print', make: (img) => ({ url: png(eachGrey(drawn(img), v => Math.round(180 + v*75/255))), map: same(), scale: 1 }) },
    { name: 'ticked by hand (✗ inside, or ✓ running out of the box)', make: (img) => {
        const c = drawn(img), ctx = c.getContext('2d');
        ctx.strokeStyle = '#000'; ctx.lineCap = 'round';
        VARIED_BOXES.forEach((b, i) => {
          const x = Math.round(b.x), y = Math.round(b.y); ctx.beginPath();
          if (i % 3 === 0){ ctx.lineWidth = 2; ctx.moveTo(x+4, y+4); ctx.lineTo(x+15, y+15); ctx.moveTo(x+15, y+4); ctx.lineTo(x+4, y+15); }
          else if (i % 3 === 1){ ctx.lineWidth = 3; ctx.moveTo(x+3, y+9); ctx.lineTo(x+8, y+16); ctx.lineTo(x+24, y-8); }
          ctx.stroke();
        });
        return { url: png(c), map: same(), scale: 1 };
      }, todo: 'not all found yet' },
  ];
  function variationTests(){
    const group = 'Poorer copies of the referral form (tick boxes only)';
    VARIATIONS.forEach(v => {
      const boxes = () => (v.fields || []).filter(f => f.kind === 'tick');
      // Each box found once, by its centre (within 8 pixels at the page's own size)
      const matched = () => {
        const left = [...boxes()], missed = [];
        VARIED_BOXES.forEach(e => {
          const [X, Y] = v.map(e.x + e.width/2, e.y + e.height/2);
          const i = left.findIndex(f => Math.hypot(f.x + f.width/2 - X, f.y + f.height/2 - Y) < 8*v.scale);
          if (i < 0) missed.push(where(e)); else left.splice(i, 1);
        });
        return { missed, extra: left };
      };
      test(`Referral form, ${v.name}: finds every tick box`, () => {
        assert(VARIED_BOXES.length, `the ${VARIED_CASE} case has no tick boxes`);
        const { missed } = matched();
        if (missed.length) throw new Error(`found ${VARIED_BOXES.length - missed.length} of ${VARIED_BOXES.length}; missed:\n  ${missed.join('\n  ')}`);
      }, { todo: v.todo, group, short: `${v.name}: finds every tick box` });
      test(`Referral form, ${v.name}: finds no tick box that isn't there`, () => {
        sameList(matched().extra.map(f => where(f)), [], 'tick boxes that are not on the page');
      }, { group, short: `${v.name}: finds no tick box that isn't there` });
    });
  }

  // ----- Run -----
  async function runTests(list){
    const out = [];
    for (const t of list){
      const r = { name: t.name, group: t.group, short: t.short };
      try { await t.fn(); out.push({ ...r, status: t.todo ? 'todo-passes' : 'pass' }); }
      catch (err) { out.push({ ...r, status: t.todo ? 'todo' : 'fail', error: err.message, todo: t.todo }); }
    }
    return out;
  }

  const results = [];
  let nextPage = 1;                                       // the app page the next case starts on
  try {
    await loadScript('tests/cases/index.js');
    const entries = (window.TEST_CASE_LIST || []).map(e => typeof e === 'string' ? { file: e } : e);
    for (const entry of entries){
      try { await loadScript(`tests/cases/${entry.file}.js`); } catch (err) { /* reported below */ }
      const c = (window.TEST_CASES || {})[entry.file];
      if (!c){ results.push({ name: entry.file, group: entry.file, short: 'load the case', status: 'fail', error: `tests/cases/${entry.file}.js is missing or holds no case` }); continue; }
      nextPage += await caseTests(c, entry, nextPage)();
    }
    // The variations, one after another on the next page (it shows the last of them)
    const ref = (window.TEST_CASES || {})[VARIED_CASE];
    if (ref){
      const pg = (await casePages(ref))[0];
      VARIED_BOXES = pg.expected.filter(e => e.kind === 'tick');
      const base = await loadImage(pg.imgData);
      for (const v of VARIATIONS){
        const made = v.make(base);
        v.fields = await detectOn(nextPage, made.url, `${VARIED_CASE} (${v.name}).png`, { readWords: false }, v === VARIATIONS[VARIATIONS.length-1]);
        v.map = made.map; v.scale = made.scale;
      }
      nextPage++;
    }
    variationTests();
    results.push(...await runTests(tests));
  } catch (err) {
    results.push({ name: 'run the tests', group: 'Setup', short: 'run the tests', status: 'fail', error: err.message || String(err) });
  }
  T.results = results;
  showAll();

  // ----- Adding a test case -----
  // From a finished eForm: the package the app downloads (a zip of the HTML and its page
  // images), or the HTML file and its images picked together. The case runs at once, and the
  // panel offers the two files that add it to the suite: the case, and the updated list.
  const slugOf = (s) => String(s).toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'test-case';
  const mimeOf = (name) => /\.png$/i.test(name) ? 'image/png' : /\.gif$/i.test(name) ? 'image/gif' : 'image/jpeg';
  const readFile = (file, how) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r[how](file); });
  async function caseFromFiles(files){
    let html = '', htmlName = '', title = '';
    const images = {};
    for (const file of files){
      if (/\.zip$/i.test(file.name)){
        const zip = await JSZip.loadAsync(file);
        for (const entry of Object.values(zip.files)){
          if (entry.dir) continue;
          const base = entry.name.split('/').pop();
          if (/\.html?$/i.test(base)){ html = await entry.async('string'); htmlName = base; }
          else if (/\.(png|jpe?g|gif)$/i.test(base)) images[base] = `data:${mimeOf(base)};base64,${await entry.async('base64')}`;
          else if (base === 'eform.properties'){ const m = (await entry.async('string')).match(/^form\.name=(.*)$/m); if (m) title = m[1].trim(); }
        }
      } else if (/\.html?$/i.test(file.name)){ html = await readFile(file, 'readAsText'); htmlName = file.name; }
      else if (/\.(png|jpe?g|gif)$/i.test(file.name)) images[file.name] = await readFile(file, 'readAsDataURL');
    }
    if (!html) throw new Error('no eForm HTML among the files picked (choose the eForm package zip, or the .html with its images)');
    if (!Object.keys(images).length) throw new Error('no page images among the files picked');
    return { name: title || htmlName.replace(/\.[^.]+$/, ''), html, images };
  }
  const download = (name, text) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/javascript' }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const caseFileText = (slug, c) =>
    `// Auto Detect test case: ${c.name.replace(/[\r\n]+/g, ' ')}\n` +
    `// A finished eForm (its HTML and page images), added with "Add a test case" in the test panel.\n` +
    `// Auto Detect is checked against its fields: where they are, and their oscarDB tags.\n` +
    `window.TEST_CASES = window.TEST_CASES || {};\nwindow.TEST_CASES[${JSON.stringify(slug)}] = ${JSON.stringify(c)};\n`;
  const listFileText = (entries) =>
    `// The Auto Detect test cases: one file each in this folder, tests/cases/<file>.js.\n` +
    `// todo: a case's tests it doesn't pass yet, reported as "to do" rather than as failures, by\n` +
    `// key: ticks, fields, extraTicks, extraFields, tags (see tests/README.md).\n` +
    `window.TEST_CASE_LIST = ${JSON.stringify(entries, null, 2)};\n`;
  async function addCase(files, note){
    note.textContent = 'Reading the eForm and running Auto Detect on it…';
    try {
      const c = await caseFromFiles(files);
      const list = (window.TEST_CASE_LIST || []).map(e => typeof e === 'string' ? { file: e } : e);
      let slug = slugOf(c.name);
      for (let k = 2; list.some(e => e.file === slug); k++) slug = `${slugOf(c.name)}-${k}`;
      tests = [];
      nextPage += await caseTests(c, {}, nextPage)();
      results.push(...await runTests(tests));
      T.results = results;
      showAll();
      render();
      const save = document.createElement('div');
      save.style.cssText = 'margin:6px 0;padding:6px 8px;background:#f1f5f9;border-radius:6px';
      save.append(`"${c.name}" ran as a test case (its results are below). To keep it in the suite, save both of these into the tests/cases folder: `);
      const b1 = document.createElement('button'), b2 = document.createElement('button');
      b1.textContent = `${slug}.js`; b2.textContent = 'index.js (the list, with it added)';
      b1.onclick = () => download(`${slug}.js`, caseFileText(slug, c));
      b2.onclick = () => download('index.js', listFileText([...list, { file: slug }]));
      save.append(b1, ' ', b2);
      panel.insertBefore(save, groupsBox);
      note.textContent = '';
    } catch (err) {
      note.textContent = 'Could not add it: ' + (err.message || err);
    }
  }

  // ----- Report -----
  const mark = { pass: '✔', fail: '✘', todo: '○', 'todo-passes': '★' };
  const color = { pass: '#15803d', fail: '#b91c1c', todo: '#a16207', 'todo-passes': '#1d4ed8' };
  const count = (s) => results.filter(r => r.status === s).length;
  const summary = () => `${count('pass')} passed, ${count('fail')} failed` +
    (count('todo') ? `, ${count('todo')} to do` : '') +
    (count('todo-passes') ? `, ${count('todo-passes')} to-do now passing (take it off the to-do list)` : '');

  console.log('Auto Detect tests: ' + summary());
  results.forEach(r => (r.status === 'fail' ? console.error : console.log)(
    `${mark[r.status]} ${r.name}${r.todo ? ' # TODO ' + r.todo : ''}${r.error ? '\n  ' + r.error : ''}`));

  const panel = document.createElement('div');
  panel.id = 'autoDetectTestResults';
  panel.style.cssText = 'position:fixed;top:10px;right:10px;z-index:99999;max-width:480px;max-height:80vh;overflow:auto;' +
    'background:#fff;color:#111;border:2px solid #15803d;border-radius:8px;' +
    'padding:10px 12px;font:13px/1.4 system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.2)';
  const head = document.createElement('div');
  head.style.cssText = 'display:flex;justify-content:space-between;gap:8px;font-weight:600;margin-bottom:6px';
  const title = document.createElement('span');
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×'; closeBtn.title = 'Close'; closeBtn.style.cssText = 'border:0;background:none;font-size:16px;cursor:pointer';
  closeBtn.onclick = () => panel.remove();
  head.append(title, closeBtn);
  const hint = document.createElement('div');
  hint.style.cssText = 'color:#555;font-size:12px;margin-bottom:6px';
  hint.textContent = 'Click a line to open it. Each test page is on its own "Edit Page" tab, with what Auto Detect found drawn on it. How the tests work: tests/README.md.';
  const adder = document.createElement('div');
  adder.style.cssText = 'margin-bottom:6px';
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add a test case…';
  addBtn.title = 'Pick a finished eForm: the package zip the app downloads, or the .html with its page images';
  const picker = document.createElement('input');
  picker.type = 'file'; picker.multiple = true; picker.accept = '.zip,.html,.htm,.png,.jpg,.jpeg,.gif'; picker.hidden = true;
  picker.id = 'autoDetectAddCase';
  const note = document.createElement('span');
  note.style.cssText = 'margin-left:8px;color:#555;font-size:12px';
  addBtn.onclick = () => picker.click();
  picker.onchange = () => { const files = [...picker.files]; picker.value = ''; if (files.length) addCase(files, note); };
  adder.append(addBtn, picker, note);
  const groupsBox = document.createElement('div');
  panel.append(head, hint, adder, groupsBox);

  // One line per case (and one for the variations), opened when something in it fails
  function render(){
    title.textContent = 'Auto Detect tests: ' + summary();
    panel.style.borderColor = count('fail') ? '#b91c1c' : '#15803d';
    groupsBox.innerHTML = '';
    const groups = [];
    results.forEach(r => { let g = groups.find(g => g.name === r.group); if (!g) groups.push(g = { name: r.group, results: [] }); g.results.push(r); });
    groups.forEach(g => {
      const n = (st) => g.results.filter(r => r.status === st).length;
      const box = document.createElement('details');
      box.open = n('fail') > 0 || n('todo-passes') > 0;
      box.style.margin = '2px 0';
      const sum = document.createElement('summary');
      const worst = n('fail') ? 'fail' : n('todo-passes') ? 'todo-passes' : n('todo') ? 'todo' : 'pass';
      sum.style.cssText = 'cursor:pointer;font-weight:600;color:' + color[worst];
      sum.textContent = `${mark[worst]} ${g.name || 'Setup'}: ${n('pass') + n('todo-passes')} of ${g.results.length} passed` +
        (n('fail') ? `, ${n('fail')} failed` : '') + (n('todo') ? `, ${n('todo')} to do` : '');
      box.appendChild(sum);
      g.results.forEach(r => {
        const row = document.createElement('div');
        row.style.cssText = 'margin-left:16px;color:' + color[r.status];
        row.textContent = `${mark[r.status]} ${r.short || r.name}${r.todo ? ' (to do: ' + r.todo + ')' : ''}`;
        if (r.error && (r.status === 'fail' || r.status === 'todo')){
          const pre = document.createElement('pre');
          pre.style.cssText = 'margin:2px 0 6px 16px;white-space:pre-wrap;color:#444;font-size:12px';
          // (for a variation's to-do, just how far it got: "found 6 of 18")
          pre.textContent = r.status === 'todo' && /^found \d+ of \d+/.test(r.error) ? r.error.split('\n')[0].replace(/;?\s*missed:$/, '') : r.error;
          row.appendChild(pre);
        }
        box.appendChild(row);
      });
      groupsBox.appendChild(box);
    });
  }
  render();
  document.body.appendChild(panel);
})();
