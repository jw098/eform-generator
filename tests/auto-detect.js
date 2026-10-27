// Runs the Auto Detect tests: the machinery only. What is on each test page, and what Auto
// Detect should make of it, is in tests/pages.js; tests/README.md explains how it all works.
//
// The app loads this file when opened with #test at the end of its address. It puts each test
// page on a page of its own in the app, runs Auto Detect there, and checks what was found
// against tests/pages.js; then it runs Auto Detect on poorer copies of the referral page
// (tick boxes only). Results show in a panel at the top right and in the browser console.
(async () => {
  const T = window.eformMapperTest;

  // How far (in page-image pixels) a detected field may sit from where it is expected
  const POS_TOL = 6;
  const SIZE_TOL = 6;

  // ----- A small test runner -----
  const tests = [];
  // (group: the panel's heading for it, a page or the variations; short: its line under that)
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
    const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = src;
  });

  // ----- The test pages (tests/pages.js), in the shape the tests below use -----
  await loadScript('tests/pages.js');
  const PAGES = window.TEST_PAGES.map(p => ({
    name: p.name, image: p.image, checkboxes: p.tickBoxes, text: p.lines, textareas: p.areas,
    missing: (p.notYet || []).map(n => ({ row: n.what, blanks: n.blanks })),
  }));

  // ----- Run Auto Detect on each test page, each on a page of its own -----
  // Each page starts from no fields at all, and its tests see only what was found on it, so
  // no page's result depends on another's. Afterwards every page's fields are put back so
  // they can be looked at on their tabs.
  // Put an image on page n of the app and run Auto Detect on it, from no fields at all
  async function detectOn(n, imgData, fileName, opts){
    const img = await loadImage(imgData);
    T.createPageDOM(n);
    T.state.pages[n] = { imgData, naturalW: img.width, naturalH: img.height, fileName };
    document.getElementById('img' + n).src = imgData;
    T.state.fields = [];
    T.setCurrentPage(n);
    await T.detectCurrentPage(opts);
    return T.state.fields.slice();
  }

  async function detectAll(){
    const all = [];
    for (let i = 0; i < PAGES.length; i++){
      const tp = PAGES[i];
      await loadScript(`tests/fixtures/${tp.image}.js`);
      const imgData = (window.TEST_PAGE_IMAGES || {})[tp.image];
      if (!imgData) throw new Error(`tests/fixtures/${tp.image}.js did not provide the page image`);
      tp.fields = await detectOn(i + 1, imgData, tp.image + '.png');
      all.push(...tp.fields);
    }
    // Variations, one after another on the next page (it shows the last one afterwards)
    const base = await loadImage(window.TEST_PAGE_IMAGES[VARIED.image]);
    for (const v of VARIATIONS){
      const made = v.make(base);
      v.fields = await detectOn(PAGES.length + 1, made.url, `${VARIED.image} (${v.name}).png`, { readWords: false });
      v.map = made.map; v.scale = made.scale;
      if (v === VARIATIONS[VARIATIONS.length-1]) all.push(...v.fields);
    }
    T.state.fields = all;
    T.setCurrentPage(1);
  }

  const near = (f, e) => Math.abs(f.x - e.x) <= POS_TOL && Math.abs(f.y - e.y) <= POS_TOL &&
    Math.abs(f.width - e.width) <= SIZE_TOL && Math.abs(f.height - e.height) <= SIZE_TOL;
  const show = f => `${f.type} at (${Math.round(f.x)}, ${Math.round(f.y)}) ${Math.round(f.width)}x${Math.round(f.height)}`;
  // A field fills a blank when it lies inside it (a little slack) and spans most of it
  const fills = (f, b) => f.type === b.type &&
    f.x >= b.x1 - 20 && f.x + f.width <= b.x2 + 20 && f.y >= b.y1 - 10 && f.y + f.height <= b.y2 + 10 &&
    f.width >= (b.x2 - b.x1) * 0.6 && (b.type !== 'textarea' || f.height >= (b.y2 - b.y1) * 0.6);

  // Each expected box is found once, and nothing else of that kind is found (but a field
  // filling one of the page's `missing` blanks is welcome)
  function assertMatches(found, expected, blanks){
    const left = [...found];
    const missing = [];
    expected.forEach(e => {
      const i = left.findIndex(f => near(f, e));
      if (i < 0) missing.push(e.label); else left.splice(i, 1);
    });
    sameList(missing, [], 'expected fields that were not detected');
    sameList(left.filter(f => !blanks.some(b => fills(f, b))).map(show), [], 'detected fields that are not on the page');
  }

  // ----- The tests, for each page -----
  PAGES.forEach(tp => {
    const fields = () => tp.fields || [];
    const ofType = (...types) => fields().filter(f => types.includes(f.type));
    const blanks = tp.missing.flatMap(m => m.blanks);
    const t = (name, fn, opts = {}) => test(`${tp.name}: ${name}`, fn, { ...opts, group: tp.name, short: name });

    t('detection finds fields', () => {
      assert(fields().length > 0, 'nothing was detected (see the message under the toolbar)');
    });

    t('fields get unique names', () => {
      const names = fields().map(f => f.name);
      assert(new Set(names).size === names.length, 'some names are repeated');
    });

    t('finds every checkbox and nothing else that looks like one', () => {
      assertMatches(ofType('checkbox', 'xbox'), tp.checkboxes, []);
    });

    t('checkboxes come out square', () => {
      ofType('checkbox', 'xbox').forEach(f => assert(Math.abs(f.width - f.height) < 1, `not square: ${show(f)}`));
    });

    t('finds the single-line fields', () => {
      assertMatches(ofType('text'), tp.text, blanks);
    });

    t('finds the multi-line fields', () => {
      assertMatches(ofType('textarea'), tp.textareas, blanks);
    });

    // From the printed words beside each field (read with OCR)
    t('suggests the right tag for each text field, and none where none fits', () => {
      const wrong = [];
      [...tp.text, ...tp.textareas].filter(e => e.tag !== undefined).forEach(e => {
        const f = fields().find(f => f.type !== 'checkbox' && near(f, e));
        if (!f) return;                                   // (reported by the tests above)
        const want = [].concat(e.tag), got = f.oscarTag || '';
        if (!want.includes(got)) wrong.push(`${e.label}: got ${got ? `"${got}"` : 'no tag'}, want ${want.map(t => t ? `"${t}"` : 'no tag').join(' or ')}`);
      });
      sameList(wrong, [], 'wrong tags');
    });

    t('tick boxes get no tag', () => {
      const tagged = ofType('checkbox', 'xbox').filter(f => f.oscarTag).map(f => `${show(f)}: "${f.oscarTag}"`);
      sameList(tagged, [], 'tagged tick boxes');
    });

    t('reads the label printed beside each tick box', () => {
      const letters = (t) => String(t || '').toLowerCase().replace(/[^a-z]/g, '');
      const wrong = [];
      tp.checkboxes.filter(e => e.printed).forEach(e => {
        const f = fields().find(f => f.type === 'checkbox' && near(f, e));
        if (f && letters(f.label) !== letters(e.printed)) wrong.push(`${e.label}: read "${f.label || ''}", want "${e.printed}"`);
      });
      sameList(wrong, [], 'wrong labels');
    });

    t('no text field covers a checkbox', () => {
      const overlaps = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
      const boxes = ofType('checkbox', 'xbox');
      ofType('text', 'textarea').forEach(f => boxes.forEach(b => assert(!overlaps(f, b), `${show(f)} covers ${show(b)}`)));
    });

    // Known gaps: on the page but not found yet. Move a row into `text`/`textareas` above
    // once the detector handles it.
    tp.missing.forEach(m => t(`finds a field for ${m.row}`, () => {
      const notFound = m.blanks.filter(b => !fields().some(f => fills(f, b))).map(b => b.label);
      sameList(notFound, [], 'no field for');
    }, { todo: 'not detected yet' }));
  });

  // ----- Variations of the referral page: tick boxes on poorer copies -----
  // Each copy is made here from the referral page (no extra image files): resized as if
  // scanned at another resolution, blurred, speckled, saved as a rough JPEG, tilted, turned
  // into a fax, printed faint, or with boxes ticked by hand. Auto Detect runs on each
  // (without reading words) and must find all 18 tick boxes and nothing else. A copy it can't
  // handle yet is a todo whose message says how many it found.
  const VARIED = PAGES[0];
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
        VARIED.checkboxes.forEach((b, i) => {
          const { x, y } = b; ctx.beginPath();
          if (i % 3 === 0){ ctx.lineWidth = 2; ctx.moveTo(x+4, y+4); ctx.lineTo(x+15, y+15); ctx.moveTo(x+15, y+4); ctx.lineTo(x+4, y+15); }
          else if (i % 3 === 1){ ctx.lineWidth = 3; ctx.moveTo(x+3, y+9); ctx.lineTo(x+8, y+16); ctx.lineTo(x+24, y-8); }
          ctx.stroke();
        });
        return { url: png(c), map: same(), scale: 1 };
      }, todo: 'not all found yet' },
  ];

  VARIATIONS.forEach(v => {
    const boxes = () => (v.fields || []).filter(f => f.type === 'checkbox' || f.type === 'xbox');
    // Each box found once, by its centre (within 8 pixels at the page's own size)
    const matched = () => {
      const left = [...boxes()], missed = [];
      VARIED.checkboxes.forEach(e => {
        const [X, Y] = v.map(e.x + e.width/2, e.y + e.height/2);
        const i = left.findIndex(f => Math.hypot(f.x + f.width/2 - X, f.y + f.height/2 - Y) < 8*v.scale);
        if (i < 0) missed.push(e.label); else left.splice(i, 1);
      });
      return { missed, extra: left };
    };
    const group = 'Poorer copies of the referral form (tick boxes only)';
    test(`Referral form, ${v.name}: finds every tick box`, () => {
      const { missed } = matched();
      if (missed.length) throw new Error(`found ${VARIED.checkboxes.length - missed.length} of ${VARIED.checkboxes.length}; missed:\n  ${missed.join('\n  ')}`);
    }, { todo: v.todo, group, short: `${v.name}: finds every tick box` });
    test(`Referral form, ${v.name}: finds no tick box that isn't there`, () => {
      sameList(matched().extra.map(show), [], 'tick boxes that are not on the page');
    }, { group, short: `${v.name}: finds no tick box that isn't there` });
  });

  // ----- Run and report -----
  const results = [];
  try { await detectAll(); }
  catch (err) { results.push({ name: 'run Auto Detect on the test pages', status: 'fail', error: err.message || String(err) }); }
  if (!results.length){
    for (const t of tests){
      const r = { name: t.name, group: t.group, short: t.short };
      try { await t.fn(); results.push({ ...r, status: t.todo ? 'todo-passes' : 'pass' }); }
      catch (err) { results.push({ ...r, status: t.todo ? 'todo' : 'fail', error: err.message, todo: t.todo }); }
    }
  }
  T.results = results;

  const count = (s) => results.filter(r => r.status === s).length;
  const summary = `${count('pass')} passed, ${count('fail')} failed` +
    (count('todo') ? `, ${count('todo')} to do` : '') +
    (count('todo-passes') ? `, ${count('todo-passes')} to-do now passing (remove its todo)` : '');
  const mark = { pass: '✔', fail: '✘', todo: '○', 'todo-passes': '★' };
  const color = { pass: '#15803d', fail: '#b91c1c', todo: '#a16207', 'todo-passes': '#1d4ed8' };

  console.log('Auto Detect tests: ' + summary);
  results.forEach(r => (r.status === 'fail' ? console.error : console.log)(
    `${mark[r.status]} ${r.name}${r.todo ? ' # TODO ' + r.todo : ''}${r.error ? '\n  ' + r.error : ''}`));

  const panel = document.createElement('div');
  panel.id = 'autoDetectTestResults';
  panel.style.cssText = 'position:fixed;top:10px;right:10px;z-index:99999;max-width:460px;max-height:80vh;overflow:auto;' +
    'background:#fff;color:#111;border:2px solid ' + (count('fail') ? '#b91c1c' : '#15803d') + ';border-radius:8px;' +
    'padding:10px 12px;font:13px/1.4 system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.2)';
  const head = document.createElement('div');
  head.style.cssText = 'display:flex;justify-content:space-between;gap:8px;font-weight:600;margin-bottom:6px';
  head.textContent = 'Auto Detect tests: ' + summary;
  const close = document.createElement('button');
  close.textContent = '×'; close.title = 'Close'; close.style.cssText = 'border:0;background:none;font-size:16px;cursor:pointer';
  close.onclick = () => panel.remove();
  head.appendChild(close);
  panel.appendChild(head);
  const hint = document.createElement('div');
  hint.style.cssText = 'color:#555;font-size:12px;margin-bottom:6px';
  hint.textContent = 'Click a line to open it. Each test page is on its own "Edit Page" tab, with what Auto Detect found drawn on it. How the tests work: tests/README.md.';
  panel.appendChild(hint);
  // One line per page (and one for the variations), opened when something in it fails or is to do
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
        // (for a to-do, just how far it got: "found 6 of 18")
        pre.textContent = r.status === 'todo' ? r.error.split('\n')[0].replace(/;?\s*missed:$/, '') : r.error;
        row.appendChild(pre);
      }
      box.appendChild(row);
    });
    panel.appendChild(box);
  });
  document.body.appendChild(panel);
})();
