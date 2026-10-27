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
// (no WebAssembly SIMD) only the tag and label tests fail.
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
  async function detectAll(){
    const all = [];
    for (let i = 0; i < PAGES.length; i++){
      const tp = PAGES[i], n = i + 1;
      await loadScript(`tests/fixtures/${tp.image}.js`);
      const imgData = (window.TEST_PAGE_IMAGES || {})[tp.image];
      if (!imgData) throw new Error(`tests/fixtures/${tp.image}.js did not provide the page image`);
      const img = await loadImage(imgData);
      T.createPageDOM(n);
      T.state.pages[n] = { imgData, naturalW: img.width, naturalH: img.height, fileName: tp.image + '.png' };
      document.getElementById('img' + n).src = imgData;
      T.state.fields = [];
      T.setCurrentPage(n);
      await T.detectCurrentPage();
      tp.fields = T.state.fields.slice();
      all.push(...tp.fields);
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
    if (r.error && r.status === 'fail'){
      const pre = document.createElement('pre');
      pre.style.cssText = 'margin:2px 0 6px 16px;white-space:pre-wrap;color:#444;font-size:12px';
      pre.textContent = r.error;
      row.appendChild(pre);
    }
    panel.appendChild(row);
  });
  document.body.appendChild(panel);
})();
