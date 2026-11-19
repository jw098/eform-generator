// Runs the Auto Detect tests in headless Chrome, for CI (.github/workflows/tests.yml): opens the
// app with #test, waits for the results, prints them (what went wrong under each failure and
// to-do, and what each test skipped), and exits with 1 if any test failed. To-dos don't fail
// the run; a to-do that now passes is a warning (take it off the list).
//
//   node tests/ci.js <app url ending in #test> [--variations] [--jobs N]
//
// The cases are split into N shards of about the same work, each run in a browser of its own
// at the same time (the default: one per two processors, up to 4, as each keeps two busy, the
// page's and OCR's; --jobs 1 runs them all in one). Each detection is the same whichever shard
// runs it, so the results are too.
//
// The app must be served over http, so the panel reads tests/cases itself. Uses the Chrome
// installed on the machine (PW_CHANNEL=chrome, the default); set PW_CHANNEL= to use
// Playwright's own Chromium instead.
const { chromium } = require('playwright');
const os = require('os');

// How many shards to run at once: --jobs N, or one per two processors, up to 4
function jobsOf(args){
  const i = args.indexOf('--jobs'), n = i >= 0 ? Number(args[i + 1]) : Math.max(1, Math.min(4, Math.floor(os.cpus().length/2)));
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

// One shard's results: the app with #test in a browser of its own, told which shard it is
async function runShard(url, variations, index, of, channel){
  const browser = await chromium.launch(channel ? { channel } : {});
  try {
    const page = await browser.newPage();
    page.on('pageerror', err => console.error(`page error${of > 1 ? ` (shard ${index + 1})` : ''}:`, err.message));
    await page.addInitScript(s => { window.eformMapperTestShard = s; }, { index, of });
    await page.goto(url);
    await page.waitForFunction(() => window.eformMapperTest && window.eformMapperTest.results, null, { timeout: 1800000 });
    let results = await page.evaluate(() => window.eformMapperTest.results);
    // (the panel offers the poorer copies only when the shard has a case with variations)
    if (variations && await page.$('text=Also test poorer copies')){
      await page.click('text=Also test poorer copies');
      await page.waitForFunction(n => window.eformMapperTest.results.length > n, results.length, { timeout: 1800000 });
      results = await page.evaluate(() => window.eformMapperTest.results);
    }
    return results;
  } finally {
    await browser.close();
  }
}

(async () => {
  const args = process.argv.slice(2), url = args[0], variations = args.includes('--variations'), jobs = jobsOf(args);
  if (!url) { console.error('usage: node tests/ci.js <app url ending in #test> [--variations] [--jobs N]'); process.exit(2); }
  const channel = process.env.PW_CHANNEL ?? 'chrome';
  let failed = true;
  try {
    const shards = await Promise.all([...Array(jobs).keys()].map(k => runShard(url, variations, k, jobs, channel)));
    const results = shards.flat();
    const mark = { pass: '✔', fail: '✘', todo: '○', 'todo-passes': '★' };
    const indent = (s) => s.split('\n').map(l => '      ' + l).join('\n');
    // Each test, with what went wrong under a failure or a to-do (and the to-do's reason), and
    // what it skipped
    for (const r of results){
      console.log(`${mark[r.status] || '?'} ${r.name}${r.status === 'todo' ? ` (to do: ${r.todo})` : ''}`);
      if (r.error && (r.status === 'fail' || r.status === 'todo')) console.log(indent(r.error));
      if (r.note) console.log(indent(r.note));
      if (r.status === 'todo-passes') console.log(`::warning::"${r.name}" is a to-do that now passes: take it off the to-do list`);
    }
    const n = (s) => results.filter(r => r.status === s).length;
    console.log(`\n${n('pass') + n('todo-passes')} passed, ${n('fail')} failed, ${n('todo')} to do`);
    failed = n('fail') > 0 || !results.length;
  } catch (err) {
    console.error('Could not run the tests:', err.message || err);
  }
  process.exit(failed ? 1 : 0);
})();
