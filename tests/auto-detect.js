// Tests for Auto Detect (the box/field detector in eForm_Generator_FreeScribe_offline.html).
//
// Run them by opening the app with #test at the end of its address, e.g.
//   file:///path/to/eForm_Generator_FreeScribe_offline.html#test
// (reload the page if you add #test to a page that is already open). The app loads this
// file, which puts the test page on page 1, runs Auto Detect on it and checks the fields it
// found against the boxes known to be on the page. Results show in a panel at the top right
// of the page and in the browser console; the detected fields stay on the page to look at.
(async () => {
  const T = window.eformMapperTest;

  // How far (in page-image pixels) a detected field may sit from where it is expected
  const POS_TOL = 6;
  const SIZE_TOL = 6;

  // Every tick box on fixtures/referral-form-page1.png (1500x1941), by the top-left of its ☐
  const CHECKBOXES = [
    { label: 'Referral to: Dr. (left 1)', x: 103, y: 352 },
    { label: 'Referral to: Dr. (left 2)', x: 103, y: 377 },
    { label: 'Referral to: Dr. (left 3)', x: 103, y: 403 },
    { label: 'Referral to: Dr. (right 1)', x: 763, y: 352 },
    { label: 'Referral to: Dr. (right 2)', x: 763, y: 377 },
    { label: 'Referral to: Dr. (right 3)', x: 763, y: 403 },
    { label: 'Referral to: Other', x: 763, y: 433 },
    { label: 'Consent: Yes, text', x: 1057, y: 755 },
    { label: 'Consent: Yes, email', x: 1191, y: 755 },
    { label: 'Consent: No', x: 1338, y: 755 },
    { label: 'Urgency: Urgent', x: 103, y: 854 },
    { label: 'Urgency: Semi-Urgent', x: 345, y: 854 },
    { label: 'Urgency: Routine', x: 641, y: 854 },
    { label: 'Type: New Referral', x: 768, y: 854 },
    { label: 'Type: Follow-up', x: 1109, y: 854 },
    { label: 'Type: Re-referral', x: 768, y: 884 },
    { label: 'Type: Revised Referral', x: 1109, y: 884 },
    { label: 'Type: EPCP Completed', x: 768, y: 917 },
  ];
  const CHECKBOX_SIZE = 19;

  // The "Other: ____" line, the blank value cells of the two tables, and the two large note boxes
  const PATIENT_X = 268, PATIENT_W = 469, MD_X = 927, MD_W = 474;
  const TABLE_ROWS = [
    { label: 'Last Name', y: 505, h: 16 },
    { label: 'First Name', y: 531, h: 16 },
    { label: 'Date of Birth / MSP #', y: 558, h: 16 },
    { label: 'PHN # / Clinic Name', y: 585, h: 16 },
    { label: 'Address', y: 611, h: 47 },
    { label: 'Home Phone / Clinic Phone', y: 668, h: 17 },
    { label: 'Cell Phone / Clinic Fax', y: 696, h: 16 },
    { label: 'Email / Family MD', y: 722, h: 17 },
  ];
  const TEXT_FIELDS = [
    { label: 'Referral to: Other ____', x: 860, y: 420, width: 533, height: 28 },
    ...TABLE_ROWS.flatMap(r => [
      { label: `Patient: ${r.label}`, x: PATIENT_X, y: r.y, width: PATIENT_W, height: r.h },
      { label: `Referring MD: ${r.label}`, x: MD_X, y: r.y, width: MD_W, height: r.h },
    ]),
  ];
  const TEXTAREAS = [
    { label: 'Past Hx', x: 93, y: 1098, width: 1308, height: 279 },
    { label: 'Medications/Allergies', x: 93, y: 1413, width: 1308, height: 362 },
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

  // ----- Run Auto Detect on the test page -----
  let fields = [];
  async function detect(){
    await loadScript('tests/fixtures/referral-form-page1.js');
    const imgData = window.TEST_PAGE_IMAGE, img = await loadImage(imgData);
    T.state.fields = [];
    T.state.currentPage = 1;
    T.state.pages[1] = { imgData, naturalW: img.width, naturalH: img.height, fileName: 'referral-form-page1.png' };
    document.getElementById('img1').src = imgData;
    T.renderAll();
    await T.detectCurrentPage();
    fields = T.state.fields.slice();
  }

  const ofType = (...types) => fields.filter(f => types.includes(f.type));
  const near = (f, e) => Math.abs(f.x - e.x) <= POS_TOL && Math.abs(f.y - e.y) <= POS_TOL &&
    Math.abs(f.width - e.width) <= SIZE_TOL && Math.abs(f.height - e.height) <= SIZE_TOL;
  const show = f => `${f.type} at (${Math.round(f.x)}, ${Math.round(f.y)}) ${Math.round(f.width)}x${Math.round(f.height)}`;

  // Each expected box is found once, and nothing else of that kind is found
  function assertMatches(found, expected){
    const left = [...found];
    const missing = [];
    expected.forEach(e => {
      const i = left.findIndex(f => near(f, e));
      if (i < 0) missing.push(e.label); else left.splice(i, 1);
    });
    sameList(missing, [], 'expected fields that were not detected');
    sameList(left.map(show), [], 'detected fields that are not on the page');
  }

  // ----- The tests -----
  test('detection finds fields, all on page 1', () => {
    assert(fields.length > 0, 'nothing was detected (see the message under the toolbar)');
    assert(fields.every(f => Number(f.page) === 1), 'some fields are not on page 1');
  });

  test('finds every checkbox and nothing else that looks like one', () => {
    assertMatches(ofType('checkbox', 'xbox'), CHECKBOXES.map(c => ({ ...c, width: CHECKBOX_SIZE, height: CHECKBOX_SIZE })));
  });

  test('checkboxes come out square', () => {
    ofType('checkbox', 'xbox').forEach(f => assert(Math.abs(f.width - f.height) < 1, `not square: ${show(f)}`));
  });

  test('finds the "Other: ____" line and the value cells of the patient and referring MD tables', () => {
    assertMatches(ofType('text'), TEXT_FIELDS);
  });

  test('finds the Past Hx and Medications/Allergies boxes as multi-line fields', () => {
    assertMatches(ofType('textarea'), TEXTAREAS);
  });

  test('no text field covers a checkbox', () => {
    const overlaps = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
    const boxes = ofType('checkbox', 'xbox');
    ofType('text', 'textarea').forEach(t => boxes.forEach(b => assert(!overlaps(t, b), `${show(t)} covers ${show(b)}`)));
  });

  test('fields get unique names', () => {
    const names = fields.map(f => f.name);
    assert(new Set(names).size === names.length, 'some names are repeated');
  });

  // ----- Run and report -----
  const results = [];
  try { await detect(); }
  catch (err) { results.push({ name: 'run Auto Detect on the test page', status: 'fail', error: err.message || String(err) }); }
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
