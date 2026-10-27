// Tests for Auto Detect (the box/field detector in eForm_Generator_FreeScribe_offline.html).
//
// Run them by opening the app with #test at the end of its address, e.g.
//   file:///path/to/eForm_Generator_FreeScribe_offline.html#test
// (reload the page if you add #test to a page that is already open). The app loads this
// file, which puts each test page below on a page of its own, runs Auto Detect on it and
// checks the fields it found against the boxes known to be on the page. Results show in a
// panel at the top right of the page and in the browser console; the detected fields stay on
// the pages to look at (use the "Edit Page" tabs). Reading the printed words (for names, tags
// and tick-box labels) takes a few seconds a page; in a browser that can't run the embedded OCR
// (no WebAssembly SIMD) only the tag and label tests fail. After the pages come variations of
// the referral page (resized, blurred, speckled, tilted, faxed, faint, ticked by hand) that
// check tick boxes alone; the next "Edit Page" tab shows the last of them.
//
// To add a test page: put its PNG in tests/fixtures, make the matching .js beside it (see the
// top of either fixture .js), and add an entry to PAGES.
(async () => {
  const T = window.eformMapperTest;

  // How far (in page-image pixels) a detected field may sit from where it is expected
  const POS_TOL = 6;
  const SIZE_TOL = 6;

  // ----- The test pages -----
  // checkboxes / text / textareas: what Auto Detect finds there, by top-left corner and size,
  // with the tag it should suggest for each text field ('' for none: a wrong tag fills the
  // wrong patient data into the form; a list when either tag will do) and the printed label
  // it should read beside each tick box.
  // Nothing else of those kinds may be found, except a field in one of the `missing` places.
  // missing: blanks on the page Auto Detect doesn't find yet (reported as todo, not failures),
  // as { row: 'what it is', blanks: [{ label, type: 'text' | 'textarea', x1, x2, y1, y2 }] }.
  // A field there counts once it lies inside the blank and spans most of it. When the
  // detector finds them, move them into text / textareas with their exact positions.

  // Referral form, page 1: tables, tick boxes, and two large note boxes
  const PATIENT_X = 268, PATIENT_W = 469, MD_X = 927, MD_W = 474;
  const REFERRAL_ROWS = [
    { label: 'Last Name', y: 505, h: 16, patient: 'patient_nameL', md: '' },
    { label: 'First Name', y: 531, h: 16, patient: 'patient_nameF', md: '' },
    { label: 'Date of Birth / MSP #', y: 558, h: 16, patient: ['dobc2', 'dob'], md: 'current_user_ohip_no' },
    { label: 'PHN # / Clinic Name', y: 585, h: 16, patient: 'hin', md: 'clinic_name' },
    { label: 'Address', y: 611, h: 47, patient: ['addressline', 'address'], md: 'clinic_addressLine' },
    { label: 'Home Phone / Clinic Phone', y: 668, h: 17, patient: 'phone', md: 'clinic_phone' },
    { label: 'Cell Phone / Clinic Fax', y: 696, h: 16, patient: 'cell', md: 'clinic_fax' },
    { label: 'Email / Family MD', y: 722, h: 17, patient: 'email', md: '' },
  ];
  const box = (label, x, y, size, printed) => ({ label, x, y, width: size, height: size, printed });

  const PAGES = [
    {
      name: 'Referral form',
      image: 'referral-form-page1',
      checkboxes: [
        box('Referral to: Dr. (left 1)', 103, 352, 19, 'Dr.'),
        box('Referral to: Dr. (left 2)', 103, 377, 19, 'Dr.'),
        box('Referral to: Dr. (left 3)', 103, 403, 19, 'Dr.'),
        box('Referral to: Dr. (right 1)', 763, 352, 19, 'Dr.'),
        box('Referral to: Dr. (right 2)', 763, 377, 19, 'Dr.'),
        box('Referral to: Dr. (right 3)', 763, 403, 19, 'Dr.'),
        box('Referral to: Other', 763, 433, 19, 'Other'),
        box('Consent: Yes, text', 1057, 755, 19, 'Yes, text'),
        box('Consent: Yes, email', 1191, 755, 19, 'Yes, email'),
        box('Consent: No', 1338, 755, 19, 'No'),
        box('Urgency: Urgent', 103, 854, 19, 'Urgent'),
        box('Urgency: Semi-Urgent', 345, 854, 19, 'Semi-Urgent'),
        box('Urgency: Routine', 641, 854, 19, 'Routine'),
        box('Type: New Referral', 768, 854, 19, 'New Referral'),
        box('Type: Follow-up', 1109, 854, 19, 'Follow-up'),
        box('Type: Re-referral', 768, 884, 19, 'Re-referral'),
        box('Type: Revised Referral', 1109, 884, 19, 'Revised Referral'),
        box('Type: EPCP Completed', 768, 917, 19, 'Enhanced Primary Care Pathways (EPCP) Completed'),
      ],
      text: [
        { label: 'Referral to: Other ____', x: 860, y: 420, width: 533, height: 28, tag: '' },
        ...REFERRAL_ROWS.flatMap(r => [
          { label: `Patient: ${r.label}`, x: PATIENT_X, y: r.y, width: PATIENT_W, height: r.h, tag: r.patient },
          { label: `Referring MD: ${r.label}`, x: MD_X, y: r.y, width: MD_W, height: r.h, tag: r.md },
        ]),
      ],
      textareas: [
        { label: 'Past Hx', x: 93, y: 1098, width: 1308, height: 279, tag: '' },
        { label: 'Medications/Allergies', x: 93, y: 1413, width: 1308, height: 362, tag: '' },
      ],
      missing: [],
    },
    {
      // Fill-in lines with one, two or three labels on each, two tick boxes, and two open
      // writing areas under headings. Each line's field sits above the line (higher on the
      // top line, which has blank page above it).
      name: 'X-ray requisition',
      image: 'xray-requisition',
      checkboxes: [
        box('Male', 1101, 780, 25, 'Male'),
        box('Female', 1271, 780, 25, 'Female'),
      ],
      text: [
        { label: 'Dr', x: 113, y: 448, width: 548, height: 51, tag: 'current_user' },
        { label: 'Billing #', x: 791, y: 448, width: 297, height: 51, tag: 'current_user_ohip_no' },
        { label: 'Date', x: 1175, y: 448, width: 213, height: 51, tag: 'today' },
        { label: 'Clinic', x: 152, y: 510, width: 1236, height: 39, tag: 'clinic_name' },
        { label: 'Additional copy to', x: 289, y: 562, width: 1099, height: 39, tag: '' },
        { label: 'Patient Name: Last', x: 302, y: 613, width: 360, height: 39, tag: 'patient_nameL' },
        { label: 'Patient Name: First', x: 749, y: 613, width: 639, height: 39, tag: 'patient_nameF' },
        { label: 'Address', x: 176, y: 663, width: 912, height: 39, tag: ['address', 'addressline'] },
        { label: 'Postal Code', x: 1254, y: 663, width: 134, height: 39, tag: 'postal' },
        { label: 'Phone', x: 158, y: 715, width: 1230, height: 39, tag: 'phone' },
        { label: 'Date of Birth', x: 337, y: 766, width: 750, height: 39, tag: ['dobc2', 'dob'] },
        { label: 'Personal Health Number', x: 526, y: 816, width: 862, height: 39, tag: 'hin' },
        { label: 'Appointment: Date', x: 404, y: 868, width: 258, height: 29, tag: '' },
        { label: 'Appointment: Time', x: 752, y: 868, width: 636, height: 29, tag: '' },
        { label: 'Doctor stamp / Clinic stamp line', x: 69, y: 1327, width: 1319, height: 49, tag: '' },
      ],
      textareas: [
        { label: 'X-ray examination requested', x: 65, y: 973, width: 1327, height: 152, tag: '' },
        { label: 'History and clinical findings', x: 65, y: 1176, width: 1327, height: 146, tag: '' },
      ],
      missing: [],
    },
  ];

  // ----- A small test runner -----
  const tests = [];
  const test = (name, fn, opts = {}) => tests.push({ name, fn, todo: opts.todo });
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
    const t = (name, fn, opts) => test(`${tp.name}: ${name}`, fn, opts);

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
    { name: 'blurred 1px', make: (img) => ({ url: png(blurred(drawn(img), 1)), map: same(), scale: 1 }), todo: 'not all found yet' },
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
      }, todo: 'ticked boxes are not found yet' },
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
    test(`Referral form, ${v.name}: finds every tick box`, () => {
      const { missed } = matched();
      if (missed.length) throw new Error(`found ${VARIED.checkboxes.length - missed.length} of ${VARIED.checkboxes.length}; missed:\n  ${missed.join('\n  ')}`);
    }, { todo: v.todo });
    test(`Referral form, ${v.name}: finds no tick box that isn't there`, () => {
      sameList(matched().extra.map(show), [], 'tick boxes that are not on the page');
    });
  });

  // ----- Run and report -----
  const results = [];
  try { await detectAll(); }
  catch (err) { results.push({ name: 'run Auto Detect on the test pages', status: 'fail', error: err.message || String(err) }); }
  if (!results.length){
    for (const t of tests){
      try { await t.fn(); results.push({ name: t.name, status: t.todo ? 'todo-passes' : 'pass' }); }
      catch (err) { results.push({ name: t.name, status: t.todo ? 'todo' : 'fail', error: err.message, todo: t.todo }); }
    }
  }
  T.results = results;

  const count = (s) => results.filter(r => r.status === s).length;
  const summary = `${count('pass')} passed, ${count('fail')} failed` +
    (count('todo') ? `, ${count('todo')} todo` : '') +
    (count('todo-passes') ? `, ${count('todo-passes')} todo now passing (remove its todo)` : '');
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
  results.forEach(r => {
    const row = document.createElement('div');
    row.style.color = color[r.status];
    row.textContent = `${mark[r.status]} ${r.name}${r.todo ? ' (todo: ' + r.todo + ')' : ''}`;
    if (r.error && (r.status === 'fail' || r.status === 'todo')){
      const pre = document.createElement('pre');
      pre.style.cssText = 'margin:2px 0 6px 16px;white-space:pre-wrap;color:#444;font-size:12px';
      pre.textContent = r.error;
      row.appendChild(pre);
    }
    panel.appendChild(row);
  });
  document.body.appendChild(panel);
})();
