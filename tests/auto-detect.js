// Runs the Auto Detect tests: the machinery only. The test cases are finished eForms in
// tests/cases; tests/README.md explains how it all works.
//
// The app loads this file when opened with #test at the end of its address. For each test
// case (an eForm and its page images) it puts each page in the app, runs Auto Detect there,
// builds the eForm from what was found ("Build HTML draft"), and compares that eForm with the
// case's: where the boxes are, and their oscarDB tags (not their names). Results show in a
// panel at the top right, which can also add a test case, and run Auto Detect on poorer copies
// of the cases marked "variations" (tick boxes and fields) when asked.
(async () => {
  const T = window.eformMapperTest;

  // How far a found box may be from the eForm's: each edge within 10 pixels, or within 20% of
  // the box's size in that direction when that is more (in pixels of the page image)
  const MARGIN_PX = 10, MARGIN_SHARE = 0.2;
  // A found field also matches when, across and down, the two overlap by at least 60% of the
  // eForm's field and 50% of the found one (a box a little taller, or set a little higher,
  // over the same line)
  const OVERLAP_EXPECTED = 0.6, OVERLAP_ACTUAL = 0.5;

  // ----- A small test runner -----
  // (group: the panel's heading for a test, a case or the variations; short: its line there)
  let tests = [];
  // (note: a function giving a line shown under its result, such as what it skipped)
  const test = (name, fn, opts = {}) => tests.push({ name, fn, todo: opts.todo, note: opts.note, group: opts.group || '', short: opts.short || name });
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
  // eForm's HTML and the page images it shows. The case's eForm and the one the app builds
  // from Auto Detect's fields are read the same way, where the browser lays their fields out:
  // the eForm is rendered in a hidden frame with its scripts off (only its layout counts), each
  // page's background image put in, and every visible field measured against it, so its CSS
  // (a class giving tick boxes their size), margins and offsets all count, whatever made it.
  //  - Background images: those with an id starting BGImage (else every image showing one of
  //    the case's images). Each shows the image its src names, or else the one a script puts
  //    there ("changeImage('page.png', 'BGImage')"), or else the largest image not yet used.
  //  - Fields: inputs, text areas and lists, except hidden ones, buttons, and anything inside
  //    a DoNotPrint block (on-screen controls). Tick boxes are checkboxes and radio buttons, and
  //    inputs with an Xbox or xMarkOnly class. Each field's tag is its oscarDB attribute.
  const kindOf = (type) => (type === 'checkbox' || type === 'xbox') ? 'tick' : 'write';
  const fileOf = (src) => decodeURIComponent(String(src).split(/[?#]/)[0].split(/[\/}=]/).pop());
  // An eForm's pages: [{ n, file, imgData, boxes: [{ kind, x, y, width, height, tag }] }]
  async function eformPages(html, images){
    const c = { html, images };
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
        pages.push({ n: pages.length + 1, file, imgData: c.images[file], bg, boxes: [] });
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
        pg.boxes.push({ kind: tick ? 'tick' : 'write', x: (r.left - b.left)*k, y: (r.top - b.top)*k, width: r.width*k, height: r.height*k,
                        tag: el.getAttribute('oscardb') || '', id: el.getAttribute('name') || el.id || '' });
      });
      pages.forEach(p => delete p.bg);
      return pages;
    } finally {
      frame.remove();
    }
  }

  // Put an image on page n of the app and run Auto Detect on it, from no fields at all. What
  // it found stays on that page to look at afterwards (keep: false for a page reused at once).
  // pdf: { data, page } when the image is a page of a fillable PDF (its bytes in base64, and
  // which page), given to the app as its PDF converter gives it; else the app has no PDF.
  const onShow = new Map();                              // page -> its fields, put back at the end
  async function detectOn(n, imgData, fileName, opts, keep = true, pdf = null){
    const img = await loadImage(imgData);
    T.createPageDOM(n);
    T.state.pages[n] = { imgData, naturalW: img.width, naturalH: img.height, fileName, ...(pdf ? { pdfPage: pdf.page } : {}) };
    T.state.sourcePdf = pdf ? { name: fileName, data: pdf.data } : null;
    document.getElementById('img' + n).src = imgData;
    T.state.fields = [];
    T.setCurrentPage(n);
    await T.detectCurrentPage(opts);
    onShow.set(n, keep ? T.state.fields.slice() : []);
    // (a textarea's font size buttons are the app's own, not a field Auto Detect found)
    return T.state.fields.filter(f => f.type !== 'fontbuttons').map(f => ({ kind: kindOf(f.type), x: f.x, y: f.y, width: f.width, height: f.height, tag: f.oscarTag || '', id: f.name || '' }));
  }
  const showAll = () => { T.state.fields = [...onShow.values()].flat(); T.setCurrentPage(1); };

  // The eForm the app builds ("Build HTML draft") from what Auto Detect found on `count` pages
  // of the app from page `first` on, as { html, images } to read like a case's eForm. The draft
  // is built from those pages alone: the app's pages and fields are swapped for them meanwhile.
  function draftOf(first, count){
    const keep = { pages: T.state.pages, fields: T.state.fields, current: T.state.currentPage };
    const pages = {}, fields = [];
    for (let i = 0; i < count; i++){
      pages[i+1] = keep.pages[first+i];
      (onShow.get(first+i) || []).forEach(f => fields.push({ ...f, page: i+1 }));
    }
    try {
      T.state.pages = pages; T.state.fields = fields; T.state.currentPage = 1;
      const html = T.buildExportHtml();
      // The draft names each page's image; give it the pages' images under those names
      const doc = new DOMParser().parseFromString(html, 'text/html'), images = {};
      for (let i = 1; i <= count; i++){
        const bg = doc.getElementById('BGImage' + i);
        if (bg) images[fileOf(bg.getAttribute('src') || '')] = pages[i].imgData;
      }
      return { html, images };
    } finally {
      T.state.pages = keep.pages; T.state.fields = keep.fields; T.state.currentPage = keep.current;
    }
  }

  // ----- Comparing found boxes with the eForm's -----
  const close = (a, b) => {
    const mx = Math.max(MARGIN_PX, MARGIN_SHARE*Math.max(a.width, b.width));
    const my = Math.max(MARGIN_PX, MARGIN_SHARE*Math.max(a.height, b.height));
    return Math.abs(a.x - b.x) <= mx && Math.abs(a.x + a.width - b.x - b.width) <= mx &&
           Math.abs(a.y - b.y) <= my && Math.abs(a.y + a.height - b.y - b.height) <= my;
  };
  const overlap = (a0, al, b0, bl) => Math.max(0, Math.min(a0 + al, b0 + bl) - Math.max(a0, b0));
  // (e: the eForm's box; f: the found one)
  const overlaps = (e, f) => {
    const ox = overlap(e.x, e.width, f.x, f.width), oy = overlap(e.y, e.height, f.y, f.height);
    return ox >= OVERLAP_EXPECTED*e.width && oy >= OVERLAP_EXPECTED*e.height &&
           ox >= OVERLAP_ACTUAL*f.width && oy >= OVERLAP_ACTUAL*f.height;
  };
  const matches = (e, f) => f.kind === e.kind && (close(e, f) || (e.kind !== 'tick' && overlaps(e, f)));
  const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.width - b.width) + Math.abs(a.height - b.height);
  // "field "surname" at (63, 429) 422×33 oscarDB="patient_nameL"": the field's name (or id) in
  // its eForm, where it is (x, y from the page image's top-left corner), its size, its tag
  const where = (f, withTag = true) => `${f.kind === 'tick' ? 'tick box' : 'field'}${f.id ? ` "${f.id}"` : ''} at (${Math.round(f.x)}, ${Math.round(f.y)})` +
    (f.kind === 'tick' ? '' : ` ${Math.round(f.width)}×${Math.round(f.height)}`) + (withTag && f.tag ? ` oscarDB="${f.tag}"` : '');
  // Pairs each expected box with the closest found box of its kind that matches it
  function compare(expected, found){
    const left = [...found], pairs = [], missing = [];
    expected.forEach(e => {
      let best = -1;
      left.forEach((f, i) => { if (matches(e, f) && (best < 0 || distance(e, f) < distance(e, left[best]))) best = i; });
      if (best < 0) missing.push(e); else pairs.push([e, left.splice(best, 1)[0]]);
    });
    return { pairs, missing, extra: left, found };
  }

  // A case's tests; returns the function that runs Auto Detect on its pages (from page
  // firstPage of the app on), builds the eForm from what it found, compares that with the
  // case's eForm, and resolves to how many pages it used
  // (onPage(n, of): told before each page is processed, for the panel's progress line)
  function caseTests(c, entry, firstPage, onPage = () => {}){
    const todo = entry.todo || {}, skips = Array.isArray(entry.skip) ? entry.skip : [];
    let pages = null, error = null;
    const run = async () => {
      try {
        pages = await eformPages(c.html, c.images);
        for (const pg of pages){ onPage(pg.n, pages.length); await detectOn(firstPage + pg.n - 1, pg.imgData, pg.file, {}, true, pdfPage(c, pg.n)); }
        const draft = draftOf(firstPage, pages.length);
        const built = await eformPages(draft.html, draft.images);
        pages.forEach(pg => { pg.result = compare(pg.boxes, (built[pg.n - 1] || { boxes: [] }).boxes); });
      } catch (err) { error = err; }
      return pages ? pages.length : 1;
    };
    // A skip leaves out of one test the boxes whose centre is in its region (x, y, width,
    // height in page-image pixels) on its page; without a page, on every page; without a
    // region, the whole page
    const inside = (b, [x, y, w, h]) => { const cx = b.x + b.width/2, cy = b.y + b.height/2; return cx >= x && cx <= x + w && cy >= y && cy <= y + h; };
    const skipFor = (key, n, box) => skips.find(k => k.test === key && (k.page == null || Number(k.page) === n) && (!k.region || inside(box, k.region)));
    const skippedBy = {};                                 // test key -> Map(skip -> boxes it left out)
    // fn(result) gives [box, line] for each thing wrong on a page
    const lines = (key, fn) => {
      if (error) throw new Error('Could not run this case: ' + (error.message || error));
      const counts = skippedBy[key] = new Map();
      return pages.flatMap(pg => fn(pg.result)
        .filter(([box]) => { const k = skipFor(key, pg.n, box); if (k) counts.set(k, (counts.get(k) || 0) + 1); return !k; })
        .map(([, l]) => (pages.length > 1 ? `page ${pg.n}: ` : '') + l));
    };
    const noteFor = (key, one, many) => () => [...(skippedBy[key] || [])].map(([k, n]) => `${n} ${n === 1 ? one : many}` +
      (k.page != null ? ` on page ${k.page}` : '') + (k.region ? ` in (${k.region[0]}, ${k.region[1]}) ${k.region[2]}×${k.region[3]}` : '') +
      ` skipped${k.reason ? ': ' + k.reason : ''}`).join('\n');
    // Expected: the case's eForm. Actual: the eForm built from what Auto Detect found.
    const t = (short, key, fn, message, one, many) => test(`${c.name}: ${short}`, () => sameList(lines(key, fn), [], message),
                                                           { group: c.name, short, todo: todo[key], note: noteFor(key, one, many) });
    // (for an expected box with no actual one where it should be: the closest actual box of its
    // kind, when there is one nearby, as it may be one just outside the margin)
    const closest = (e, r) => {
      const centre = (b) => [b.x + b.width/2, b.y + b.height/2], [ex, ey] = centre(e);
      const near = r.found.filter(f => f.kind === e.kind).map(f => [f, Math.hypot(centre(f)[0] - ex, centre(f)[1] - ey)])
        .filter(([, d]) => d <= Math.max(60, 2*Math.max(e.width, e.height))).sort((a, b) => a[1] - b[1])[0];
      return near ? `closest actual: ${where(near[0])}` : 'nothing nearby';
    };
    const missing = (kind) => r => r.missing.filter(e => e.kind === kind).map(e => [e, `expected ${where(e)}\n      → actual: none there (${closest(e, r)})`]);
    const extra = (kind) => r => r.extra.filter(f => f.kind === kind).map(f => [f, `actual ${where(f)}\n      → expected: nothing there`]);
    const tagOf = (t) => t ? `oscarDB="${t}"` : 'no tag';
    t('each expected tick box is in the actual eForm', 'ticks', missing('tick'), 'expected, but missing from the actual eForm', 'tick box', 'tick boxes');
    t('each expected field is in the actual eForm', 'fields', missing('write'), 'expected, but missing from the actual eForm', 'field', 'fields');
    t('no actual tick box that isn\'t expected', 'extraTicks', extra('tick'), 'in the actual eForm, but not expected', 'tick box', 'tick boxes');
    t('no actual field that isn\'t expected', 'extraFields', extra('write'), 'in the actual eForm, but not expected', 'field', 'fields');
    t('each field\'s actual oscarDB tag is the expected one', 'tags', r => r.pairs.filter(([e, f]) => e.tag !== f.tag)
      .map(([e, f]) => [e, `${where(e, false)}: expected ${tagOf(e.tag)}, actual ${tagOf(f.tag)}`]), 'oscarDB tags that differ', 'field', 'fields');
    return run;
  }

  // ----- Variations: poorer copies of the cases' pages -----
  // The variations: copies of each page of the cases marked "variations" in tests/cases/index.js,
  // as a clean PDF can come (eForm templates are mostly clean PDFs): rendered at another size,
  // or printed faint. They are made here from the page (no extra image files). Auto Detect runs
  // on each and must find the eForm's tick boxes and fields and nothing else, but those the
  // case's skips leave out (its skip, for fields, and its variationSkip). (The forms are blank:
  // a tick box is empty.)
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
  const png = (c) => c.toDataURL('image/png');
  // (scale: the copy's size against the page's; what is found on it, divided by scale, is in the
  // page's own pixels)
  const resized = (k) => (img) => ({ url: png(drawn(img, k)), scale: k });
  const VARIATIONS = [
    { name: '0.7× size', make: resized(0.7) },
    { name: '1.5× size', make: resized(1.5) },
    { name: '2× size', make: resized(2) },
    { name: '2.5× size', make: resized(2.5) },
    { name: '3× size', make: resized(3) },
    { name: 'faint print', make: (img) => ({ url: png(eachGrey(drawn(img), v => Math.round(180 + v*75/255))), scale: 1 }) },
  ];
  // Each case's variations, once made: { c, entry, pages: [{ n, of, boxes, runs: [{ v, fields, scale }] }] }
  let varied = [];
  function variationTests(){
    varied.forEach(({ c, entry, pages, vs }) => {
      const group = `Poorer copies of ${c.name}`;
      // The case's skips and to-dos for its variations (its variationSkip and variationTodo in
      // tests/cases/index.js), and its own skips and to-dos for fields, which hold on every copy
      const skips = entry.variationSkip || [], todos = entry.variationTodo || [], all = pages.flatMap(pg => pg.boxes);
      const caseSkips = Array.isArray(entry.skip) ? entry.skip : [], caseTodo = entry.todo || {};
      const KEYS = ['ticks', 'extraTicks', 'fields', 'extraFields'];
      const todoOf = (v, n, key) => (todos.find(k => k.variation === v.name && k.test === key && (k.page == null || Number(k.page) === n)) || {}).reason ||
                                    (key === 'fields' || key === 'extraFields' ? caseTodo[key] : undefined);
      test(`${c.name} variations: each skip and to-do names a variation, and tick boxes and pages there are`, () => {
        const none = [...skips, ...todos].map(k => k.variation).filter(n => !vs.some(v => v.name === n));
        assert(!none.length, `variationSkip or variationTodo names variations the case doesn't run: ${none.join(', ')}`);
        const unknown = skips.flatMap(k => k.boxes || []).filter(id => !all.some(e => e.id === id && e.kind === 'tick'));
        assert(!unknown.length, `variationSkip names tick boxes the case doesn't have: ${unknown.join(', ')}`);
        const odd = skips.filter(k => !k.boxes === !k.region || (k.region && (k.region.length !== 4 || !pages.some(pg => pg.n === Number(k.page)))) ||
                                      (k.boxes && k.test) || (k.region && k.test && !['extraTicks', 'fields', 'extraFields'].includes(k.test)));
        assert(!odd.length, `a variationSkip needs either boxes, or a region [x, y, width, height], a page and a test (extraTicks, fields or extraFields): ${odd.map(k => k.variation).join(', ')}`);
        const bad = todos.filter(k => !KEYS.includes(k.test) || (k.page != null && !pages.some(pg => pg.n === Number(k.page))));
        assert(!bad.length, `variationTodo names a test that isn't ${KEYS.join(', ')}, or a page the case doesn't have: ${bad.map(k => `${k.variation} ${k.test} page ${k.page}`).join(', ')}`);
      }, { group, short: 'each skip and to-do names a variation, and tick boxes and pages there are' });
      pages.forEach(({ n, of, boxes: expected, runs }) => runs.forEach(({ v, fields, scale }) => {
        const name = `${c.name}${of > 1 ? `, page ${n}` : ''}, ${v.name}`, short = `${of > 1 ? `page ${n}, ` : ''}${v.name}`;
        // What was found, in the page's own pixels
        const found = fields.map(f => ({ ...f, x: f.x/scale, y: f.y/scale, width: f.width/scale, height: f.height/scale }));
        const ticks = expected.filter(e => e.kind === 'tick');
        // A skip leaves the tick boxes it names (by their name in the eForm) out of "each expected
        // tick box is found"; one found anyway still matches, so it isn't counted as an extra. A
        // skip with a region (in the page's own pixels) leaves what's there out of its test (an
        // extra tick box when it names no test), as the case's own skips do for its fields.
        const skipOf = (e) => skips.find(k => k.variation === v.name && (k.boxes || []).includes(e.id));
        const inside = (b, [x, y, w, h]) => { const cx = b.x + b.width/2, cy = b.y + b.height/2; return cx >= x && cx <= x + w && cy >= y && cy <= y + h; };
        const regionOf = (key, b) => skips.find(k => k.variation === v.name && k.region && Number(k.page) === n && (k.test || 'extraTicks') === key && inside(b, k.region)) ||
          ((key === 'fields' || key === 'extraFields') && caseSkips.find(k => k.test === key && (k.page == null || Number(k.page) === n) && (!k.region || inside(b, k.region))));
        const regions = (key) => skips.filter(k => k.variation === v.name && k.region && Number(k.page) === n && (k.test || 'extraTicks') === key);
        // Each tick box found once, by its centre (within 8 pixels of the page's own)
        const matched = () => {
          const left = found.filter(f => f.kind === 'tick'), missed = [], skipped = new Map(), got = [];
          ticks.forEach(e => {
            const X = e.x + e.width/2, Y = e.y + e.height/2;
            const i = left.findIndex(f => Math.hypot(f.x + f.width/2 - X, f.y + f.height/2 - Y) < 8), k = skipOf(e);
            if (k){ skipped.set(k, (skipped.get(k) || 0) + 1); if (i >= 0) got.push(e.id); }
            if (i >= 0) left.splice(i, 1); else if (!k) missed.push(`expected ${where(e)}`);
          });
          return { missed, extra: left.filter(f => !regionOf('extraTicks', f)), skipped, found: got, inRegions: regionCounts('extraTicks', left) };
        };
        // How many things each of the variation's regions for a test left out
        const regionCounts = (key, things) => new Map(regions(key).map(k => [k, things.filter(f => regionOf(key, f) === k).length]));
        const regionNote = (counts, one, many) => [...counts].map(([k, m]) => m ? `${m} ${m === 1 ? one : many} in (${k.region[0]}, ${k.region[1]}) ${k.region[2]}×${k.region[3]} skipped: ${k.reason}`
          : `nothing in (${k.region[0]}, ${k.region[1]}) ${k.region[2]}×${k.region[3]} now, take off the skip`).join('\n');
        const counted = () => ticks.filter(e => !skipOf(e)).length;
        if (ticks.length){
          test(`${name}: each expected tick box is found`, () => {
            const { missed } = matched();
            if (missed.length) throw new Error(`actual: found ${counted() - missed.length} of the ${counted()} expected tick boxes; missing:\n  ${missed.join('\n  ')}`);
          }, { group, short: `${short}: each expected tick box is found`, todo: todoOf(v, n, 'ticks'),
               note: () => { const { skipped, found } = matched();
                 return [...skipped].map(([k, n]) => `${n} tick ${n === 1 ? 'box' : 'boxes'} skipped: ${k.reason}`)
                   .concat(found.length ? [`found now, take off the skip: ${found.join(', ')}`] : []).join('\n'); } });
          test(`${name}: no actual tick box that isn't expected`, () => {
            sameList(matched().extra.map(f => `actual ${where(f)}`), [], 'found, but not expected');
          }, { group, short: `${short}: no actual tick box that isn't expected`, todo: todoOf(v, n, 'extraTicks'),
               note: () => regionNote(matched().inRegions, 'thing taken for a tick box', 'things taken for a tick box') });
        }
        // Fields, matched as the case's own tests match them
        const writes = expected.filter(e => e.kind === 'write');
        if (!writes.length) return;
        const r = () => compare(writes, found.filter(f => f.kind === 'write'));
        test(`${name}: each expected field is found`, () => {
          sameList(r().missing.filter(e => !regionOf('fields', e)).map(e => `expected ${where(e, false)}`), [], 'expected, but not found');
        }, { group, short: `${short}: each expected field is found`, todo: todoOf(v, n, 'fields'),
             note: () => regionNote(regionCounts('fields', r().missing), 'field', 'fields') });
        test(`${name}: no actual field that isn't expected`, () => {
          sameList(r().extra.filter(f => !regionOf('extraFields', f)).map(f => `actual ${where(f, false)}`), [], 'found, but not expected');
        }, { group, short: `${short}: no actual field that isn't expected`, todo: todoOf(v, n, 'extraFields'),
             note: () => regionNote(regionCounts('extraFields', r().extra), 'field', 'fields') });
      }));
    });
  }

  // ----- Run -----
  async function runTests(list){
    const out = [];
    for (const t of list){
      const r = { name: t.name, group: t.group, short: t.short };
      try { await t.fn(); out.push({ ...r, status: t.todo ? 'todo-passes' : 'pass' }); }
      catch (err) { out.push({ ...r, status: t.todo ? 'todo' : 'fail', error: err.message, todo: t.todo }); }
      if (t.note) out[out.length - 1].note = t.note();
    }
    return out;
  }

  // ----- Reading the cases' files -----
  // Each case is a folder in tests/cases (its eForm's HTML and page images), listed in
  // tests/cases/index.js. Served over http(s), the page fetches them. Opened from disk (file://),
  // the browser won't let it read files by itself (it may show an image, not read its pixels),
  // so the panel asks for the tests/cases folder and they're read from the files picked.
  // Either way, getFile('folder/file name') gives the file.
  const asDataUrl = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob); });
  const fromServer = () => async (path) => {
    const r = await fetch('tests/cases/' + path.split('/').map(encodeURIComponent).join('/'));
    if (!r.ok) throw new Error(`tests/cases/${path} is missing`);
    return r.blob();
  };
  const fromFolder = (files) => async (path) => {
    // (paths in the folder picked start with its own name: "cases/referral-form/page1.png")
    const f = [...files].find(f => (f.webkitRelativePath || f.name) === path || (f.webkitRelativePath || '').endsWith('/' + path));
    if (!f) throw new Error(`tests/cases/${path} is missing from the folder chosen`);
    return f;
  };
  async function loadCase(entry, getFile){
    const html = await (await getFile(`${entry.folder}/${entry.eform}`)).text();
    const images = {};
    for (const name of entry.images || []) images[name] = await asDataUrl(await getFile(`${entry.folder}/${name}`));
    // (a fillable PDF's bytes in base64, as the app keeps them)
    const pdf = entry.pdf ? (await asDataUrl(await getFile(`${entry.folder}/${entry.pdf}`))).split(',')[1] : null;
    return { name: entry.name || entry.folder, html, images, pdf };
  }
  // A case's page n as a page of its fillable PDF ({ data, page }, for detectOn), or null: the
  // eForm's pages are the PDF's, in order
  const pdfPage = (c, n) => c.pdf ? { data: c.pdf, page: n } : null;

  // ----- Running everything -----
  const results = [];
  let nextPage = 1;                                       // the app page the next case starts on
  let entries = [];
  const loaded = {};                                     // folder -> case, once read
  const progress = (text) => { title.textContent = 'Auto Detect tests: ' + text; };
  async function runAll(getFile){
    try {
      // Read every case first, to know how many pages there are to process
      const cases = [];
      for (const [i, entry] of entries.entries()){
        progress(`reading test case ${i + 1} of ${entries.length}…`);
        try {
          const c = await loadCase(entry, getFile);
          cases.push({ c, entry, pages: (await eformPages(c.html, c.images)).length });
          loaded[entry.folder] = c;
        } catch (err){ results.push({ name: entry.name || entry.folder, group: entry.name || entry.folder, short: 'read the case', status: 'fail', error: err.message || String(err) }); }
      }
      const total = cases.reduce((n, k) => n + k.pages, 0);
      let done = 0;
      for (const { c, entry } of cases){
        nextPage += await caseTests(c, entry, nextPage, (n, of) =>
          progress(`running… processing page ${++done} of ${total} (${c.name}${of > 1 ? `, page ${n}` : ''})`))();
      }
      progress('checking the results…');
      results.push(...await runTests(tests));
    } catch (err) {
      results.push({ name: 'run the tests', group: 'Setup', short: 'run the tests', status: 'fail', error: err.message || String(err) });
    }
    finished();
    if (entries.some(e => e.variations && loaded[e.folder])) panel.insertBefore(copiesBox, groupsBox);
  }
  // After a run: results on the board, in the panel and in the console
  function finished(){
    T.results = results;
    showAll();
    render();
    console.log('Auto Detect tests: ' + summary());
    results.forEach(r => (r.status === 'fail' ? console.error : console.log)(
      `${mark[r.status]} ${r.name}${r.todo ? ' # TODO ' + r.todo : ''}${r.error ? '\n  ' + r.error : ''}`));
  }

  // The variations, when asked for (they take a while): one after another on the next page of
  // the app, which shows the last of them afterwards
  async function runCopies(){
    try {
      varied = [];
      for (const entry of entries.filter(e => e.variations && loaded[e.folder])){
        const c = loaded[entry.folder], all = await eformPages(c.html, c.images), pages = [];
        const vs = VARIATIONS;
        for (const pg of all) if (pg.boxes.length) pages.push({ n: pg.n, of: all.length, boxes: pg.boxes, img: pg.imgData, runs: [] });
        varied.push({ c, entry, pages, vs });
      }
      const total = varied.reduce((s, k) => s + k.pages.length*k.vs.length, 0);
      let done = 0;
      for (const { c, entry, pages, vs } of varied) for (const pg of pages){
        const base = await loadImage(pg.img);
        for (const v of vs){
          progress(`poorer copies: processing ${++done} of ${total} (${c.name}${pg.of > 1 ? `, page ${pg.n}` : ''}, ${v.name})…`);
          const made = v.make(base);
          // (measured as the case's own tests measure what is found: in the eForm built from it)
          await detectOn(nextPage, made.url, `${entry.folder} (${v.name}).png`, {});
          const draft = draftOf(nextPage, 1), built = (await eformPages(draft.html, draft.images))[0] || { boxes: [] };
          if (done !== total) onShow.set(nextPage, []);
          pg.runs.push({ v, scale: made.scale, fields: built.boxes });
        }
      }
      nextPage++;
      tests = [];
      variationTests();
      results.push(...await runTests(tests));
    } catch (err) {
      results.push({ name: 'run the poorer copies', group: 'Poorer copies', short: 'run them', status: 'fail', error: err.message || String(err) });
    }
    finished();
  }

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
    return { name: title || htmlName.replace(/\.[^.]+$/, ''), html, images, htmlName };
  }
  const download = (name, blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const listFileText = (entries) =>
    `// The Auto Detect test cases. Each is a folder here holding a finished eForm: its HTML and its\n` +
    `// page image(s), as the app's OSCAR package has them (unzip the package into the folder).\n` +
    `//   name    what the test results call it\n` +
    `//   folder  its folder in tests/cases\n` +
    `//   eform   the eForm's HTML file, in that folder\n` +
    `//   images  its page images, in that folder\n` +
    `//   pdf     (optional) the fillable PDF the page images were made from (by the app's PDF\n` +
    `//           converter, its pages in order), in that folder: Auto Detect is given it as the\n` +
    `//           converter gives it, and takes the PDF's own form fields (no variations: a copy of a\n` +
    `//           page is a picture only)\n` +
    `//   todo    (optional) its tests it doesn't pass yet, shown as "to do" rather than failures, by\n` +
    `//           key: ticks, fields, extraTicks, extraFields, tags (see tests/README.md)\n` +
    `//   skip    (optional) boxes to leave out of a test, where it can't apply: a list of\n` +
    `//           { test, page, region: [x, y, width, height], reason }. The test is one of the keys\n` +
    `//           above; boxes whose centre is in the region (page-image pixels) on that page are\n` +
    `//           left out of it. Without a page, every page; without a region, the whole page.\n` +
    `//   variations (optional) true: its pages are also tested, tick boxes and fields, in copies\n` +
    `//           as a clean PDF can come (rendered at another size, printed faint) when asked\n` +
    `//   variationSkip (optional) tick boxes to leave out of a variation's "each expected tick box\n` +
    `//           is found", where the variation leaves too little of them: a list of { variation,\n` +
    `//           boxes, reason }, the variation by its name in the panel and the boxes by their\n` +
    `//           names in the eForm; or a region to leave out of one of its tests: { variation,\n` +
    `//           test, page, region: [x, y, width, height], reason }, in the page's own pixels, the\n` +
    `//           test extraTicks (without one), fields or extraFields (see tests/README.md). The\n` +
    `//           case's own skips and to-dos for fields hold on its variations too.\n` +
    `//   variationTodo (optional) a variation's tests it doesn't pass yet, shown as "to do": a list\n` +
    `//           of { variation, page, test, reason }, the test ticks, extraTicks, fields or\n` +
    `//           extraFields; without a page, every page\n` +
    `window.TEST_CASE_LIST = ${JSON.stringify(entries, null, 2)};\n`;
  async function addCase(files, note){
    note.textContent = 'Reading the eForm and running Auto Detect on it…';
    try {
      const c = await caseFromFiles(files);
      const list = window.TEST_CASE_LIST || [];
      let slug = slugOf(c.name);
      for (let k = 2; list.some(e => e.folder === slug); k++) slug = `${slugOf(c.name)}-${k}`;
      tests = [];
      // (shown apart from a case of the same name already run)
      const shownAs = results.some(r => r.group === c.name) ? { ...c, name: `${c.name} (added)` } : c;
      nextPage += await caseTests(shownAs, {}, nextPage, (n, of) => progress(`running the new case… processing page ${n} of ${of}`))();
      results.push(...await runTests(tests));
      T.results = results;
      showAll();
      render();
      // To keep it: its files in a folder of their own, and the list with it added
      const eform = c.htmlName || `${slug}.html`, images = Object.keys(c.images);
      const save = document.createElement('div');
      save.style.cssText = 'margin:6px 0;padding:6px 8px;background:#f1f5f9;border-radius:6px';
      save.append(`"${c.name}" ran as a test case (its results are below). To keep it in the suite: make the folder tests/cases/${slug}, put the eForm's files in it (unzip the package there, or save these: `);
      const fileBtn = (label, make) => { const b = document.createElement('button'); b.textContent = label; b.onclick = () => download(label, make()); return b; };
      save.append(fileBtn(eform, () => new Blob([c.html], { type: 'text/html' })), ' ');
      images.forEach(name => save.append(fileBtn(name, () => { const [head, b64] = c.images[name].split(','); const bin = atob(b64), a = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return new Blob([a], { type: head.slice(5).split(';')[0] }); }), ' '));
      save.append('), and save this into tests/cases: ');
      save.append(fileBtn('index.js', () => new Blob([listFileText([...list, { name: c.name, folder: slug, eform, images }])], { type: 'text/javascript' })));
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
  hint.textContent = 'Expected: the test case\'s eForm. Actual: the eForm built from what Auto Detect found on its page image. ' +
    'Click a line to open it. Each test page is on its own "Edit Page" tab, with what Auto Detect found drawn on it. How the tests work: tests/README.md.';
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
  const copiesBox = document.createElement('div');
  copiesBox.style.cssText = 'margin:6px 0';
  const copiesBtn = document.createElement('button');
  copiesBtn.textContent = 'Also test poorer copies';
  copiesBtn.title = 'Tick boxes and fields on poorer copies of each page of the cases marked "variations", as a clean PDF can come: resized, printed faint';
  const copiesNote = document.createElement('span');
  copiesNote.style.cssText = 'margin-left:8px;color:#555;font-size:12px';
  copiesNote.textContent = 'checks tick boxes and fields on poorer copies; takes a few minutes';
  copiesBtn.onclick = async () => { copiesBox.remove(); await runCopies(); };
  copiesBox.append(copiesBtn, copiesNote);

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
        if (r.note){
          const note = document.createElement('div');
          note.style.cssText = 'margin:0 0 2px 16px;color:#6b7280;font-size:12px;white-space:pre-wrap';
          note.textContent = r.note;
          row.appendChild(note);
        }
        if (r.error && (r.status === 'fail' || r.status === 'todo')){
          const pre = document.createElement('pre');
          pre.style.cssText = 'margin:2px 0 6px 16px;white-space:pre-wrap;color:#444;font-size:12px';
          // (for a variation's to-do, just how far it got: "found 6 of the 18 expected tick boxes")
          pre.textContent = r.status === 'todo' && /^actual: found \d+ of the \d+/.test(r.error) ? r.error.split('\n')[0].replace(/;?\s*missing:$/, '') : r.error;
          row.appendChild(pre);
        }
        box.appendChild(row);
      });
      groupsBox.appendChild(box);
    });
  }
  // The machinery, for tests/show.js (which draws a case's expected and actual boxes). With
  // window.eformMapperTestNoRun set before this file loads, it stops here: no tests, no panel.
  T.harness = { loadScript, loadCase, fromServer, eformPages, detectOn, draftOf, compare, pdfPage, VARIATIONS };
  if (window.eformMapperTestNoRun) return;
  render();
  document.body.appendChild(panel);

  // ----- Start -----
  try { await loadScript('tests/cases/index.js'); } catch (err) { /* no cases yet */ }
  entries = window.TEST_CASE_LIST || [];
  if (!entries.length || location.protocol !== 'file:'){ await runAll(fromServer()); return; }
  // From disk: ask for the folder
  const ask = document.createElement('div');
  ask.style.cssText = 'margin:6px 0;padding:8px;background:#fef9c3;border-radius:6px';
  ask.append('To run the test cases, choose the tests/cases folder. (A page opened from disk may show the cases\' images but not read them, so it asks; served over http it reads them itself.) ');
  const folderBtn = document.createElement('button');
  folderBtn.textContent = 'Choose the tests/cases folder…';
  const folder = document.createElement('input');
  folder.type = 'file'; folder.webkitdirectory = true; folder.multiple = true; folder.hidden = true; folder.id = 'autoDetectCasesFolder';
  folderBtn.onclick = () => folder.click();
  folder.onchange = async () => {
    const files = [...folder.files];
    if (!files.length) return;
    ask.remove();
    await runAll(fromFolder(files));
  };
  ask.append(folderBtn, folder);
  panel.insertBefore(ask, groupsBox);
  title.textContent = 'Auto Detect tests: waiting for the tests/cases folder';
})();
