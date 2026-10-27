// Runs the Auto Detect tests in headless Chrome, for CI (.github/workflows/tests.yml): opens the
// app with #test, waits for the results, prints them, and exits with 1 if any test failed.
// To-dos don't fail the run; a to-do that now passes is a warning (take it off the list).
//
//   node tests/ci.js <app url ending in #test> [--variations]
//
// The app must be served over http, so the panel reads tests/cases itself. Uses the Chrome
// installed on the machine (PW_CHANNEL=chrome, the default); set PW_CHANNEL= to use
// Playwright's own Chromium instead.
const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2], variations = process.argv.includes('--variations');
  if (!url) { console.error('usage: node tests/ci.js <app url ending in #test> [--variations]'); process.exit(2); }
  const channel = process.env.PW_CHANNEL ?? 'chrome';
  const browser = await chromium.launch(channel ? { channel } : {});
  let failed = true;
  try {
    const page = await browser.newPage();
    page.on('pageerror', err => console.error('page error:', err.message));
    await page.goto(url);
    await page.waitForFunction(() => window.eformMapperTest && window.eformMapperTest.results, null, { timeout: 600000 });
    let results = await page.evaluate(() => window.eformMapperTest.results);
    if (variations){
      await page.click('text=Also test poorer copies');
      await page.waitForFunction(n => window.eformMapperTest.results.length > n, results.length, { timeout: 600000 });
      results = await page.evaluate(() => window.eformMapperTest.results);
    }
    const mark = { pass: '✔', fail: '✘', todo: '○', 'todo-passes': '★' };
    const indent = (s) => s.split('\n').map(l => '      ' + l).join('\n');
    for (const r of results){
      console.log(`${mark[r.status] || '?'} ${r.name}${r.status === 'todo' ? ' (to do)' : ''}`);
      if (r.error && r.status === 'fail') console.log(indent(r.error));
      if (r.status === 'todo-passes') console.log(`::warning::"${r.name}" is a to-do that now passes: take it off the to-do list`);
    }
    const n = (s) => results.filter(r => r.status === s).length;
    console.log(`\n${n('pass') + n('todo-passes')} passed, ${n('fail')} failed, ${n('todo')} to do`);
    failed = n('fail') > 0 || !results.length;
  } catch (err) {
    console.error('Could not run the tests:', err.message || err);
  } finally {
    await browser.close();
  }
  process.exit(failed ? 1 : 0);
})();
