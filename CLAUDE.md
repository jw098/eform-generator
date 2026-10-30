# eForm Generator (OSCAR eForm Mapper)

A single-page browser app that turns a scanned or PDF form into an OSCAR eForm: put fields
on the page image, tag them with `oscarDB` tags, and export the eForm's HTML (or an OSCAR
package). **Auto Detect** finds the tick boxes and the places to write, and suggests tags.

## Layout

- `eForm_Generator_FreeScribe_offline.html`: the whole app, one file (~6,200 lines). It runs
  offline from disk, so its libraries are embedded (pdf.js, Tesseract.js with its English
  data, an Emscripten module): lines ~500–870 are minified or base64 vendor code, some lines
  megabytes long. Don't edit them, and keep searches off them (a search that hits them prints
  megabytes). The app's own code starts around line 900.
- `tests/`: the Auto Detect tests (see `tests/README.md`). Each case in `tests/cases/` is a
  finished eForm and its page image(s).
- `CodingAgentContext/standard-eform-tags.csv`: OSCAR's standard eForm tags, with the OSCAR
  version each came in (see "Tags" below).

## Tags

Only the **OSCAR version 12** tags count: the rows of `standard-eform-tags.csv` whose
`Oscar Version` is `12` and whose tag isn't empty (102 tags). Tags from later versions (`15`, `15b803`, `19`…) and tags
not in the file don't exist for this project: Auto Detect must never suggest one, and a new
rule or list of tags must use only version 12's. (The rows with no version are the source
page's section headings, not tags.) To list them:

```
python3 -c "import csv; print('\n'.join(r[1] for r in csv.reader(open('CodingAgentContext/standard-eform-tags.csv', encoding='utf-8-sig')) if r[0].strip() == '12' and r[1].strip()))"
```

In the code: `STANDARD_TAGS` is all of version 12's tags, a fixed list: it is the tag list
the app offers, and Auto Detect suggests nothing outside it (`TAG_FOR`, what Auto Detect
suggests, holds only its tags). Nothing in the app adds to it or takes from it. A user can
still type any tag for a field; one that isn't standard shows a warning. `REMOVED_TAGS` lists
the other tags the app used to offer; a saved session's field loses one. Where version 12 has no tag for something (a clinician's email), the field gets none.
A signature is a field type (`signature`, exported as OSCAR's signature stamp), not a tag.
A test case's expected tags follow the same rule. (OSCAR measurement references such as
`m$EDC#value` aren't standard tags, and Auto Detect doesn't suggest them.)

## Auto Detect, in order (`detectCurrentPage`)

The forms are blank templates, mostly clean PDFs rendered at some size, sometimes a scan or a
fax. A rule may rely on that: a tick box is empty (`isRealBox` turns away ink in a box's
middle, which is how a letter such as the B in "Bilat." is told from a box), and nothing is
filled in or ticked by hand. Don't loosen a rule for filled-in forms.

Auto Detect works from the picture, in two passes. When the page came from a fillable PDF,
the PDF's own form fields are taken as they are (`pdfFormFields`: positions, names and labels)
in place of the fields pass 1 finds; pass 1 still reads the page's rules, and pass 2 only what's
printed around them (`sectionFields`) and their tags (`tagFields`).

**Pass 1: the picture only, no OCR.** It must not rely on OCR: it finds the fields from the
ink alone, so it works where the words can't be read (no WebAssembly SIMD, no workers;
`readWords: false` runs it so). Never move a call to `readPageWords`, or anything using its
words, into pass 1.
1. Straighten (`estimateSkew`), stretch a faint page's grey levels (`stretchGrey`, also on
   the copy OCR reads), make an ink map (`inkMap`) and find the rules (`bands`). The ink map
   drops lone pixels: keep that, even for clean PDFs (a lone pixel on the Diabetes form's top
   edge becomes a writing area without it). It also drops a small colon's one-pixel dots
   ("MENOPAUSE (AGE):" at 1500 px), which OCR misses too, so a rule can't rely on every colon.
2. Tick boxes: connected blobs and `rectScan`, both judged by `isRealBox` / `isRealCircle`.
3. Text fields from the rules (`textFieldsFromLines`: fill-in lines, table rows and cells,
   ruled writing areas; it is given the tick boxes, a cell's options), then open writing areas
   under a label (`areaFields`). A "label" here is ink, not words.

**Pass 2: the words OCR reads (`readPageWords`).** Only pass 2 uses OCR. It refines what
pass 1 found and is skipped when the words can't be read (fields then keep plain names and
no tags).
4. Fields after a colon (`colonFields`), each field's label (`labelFields`), the fields the
   labels split or rule out (`fieldsFromLabels`), captions and section headings
   (`sectionFields`).
5. Names from the labels, then tags (`tagFields`: `fieldOwners` → `guessTag` / `askedFor` /
   `TAG_FOR` → `captionTag`).

The pass-2 steps pass what they learn on the fields themselves (`box`, `_words`, `_split`…);
the list is in the comment at the head of "Pass 2". Shared tests: `sideRule` /
`joinedBySides` (rules and boxes), `capsText` / `headingLabel` / `isSentence` (headings and
sentences), `fieldLeftOf`.

## Testing

Serve the folder and run the tests in headless Chromium (here, `PW_CHANNEL=` uses
Playwright's own Chromium; on GitHub it's the runner's Chrome):

```
python3 -m http.server 8000 &
PW_CHANNEL= node tests/ci.js "http://localhost:8000/eForm_Generator_FreeScribe_offline.html#test" --variations
```

Every test must pass; to-dos (○) are allowed. CI runs the same on each push.

For a change meant not to change what Auto Detect finds (a refactor, a tidy-up), also compare
exact snapshots before and after. They are deterministic, so any diff comes from the change:

```
PW_CHANNEL= node tests/snapshot.js "http://localhost:8000/eForm_Generator_FreeScribe_offline.html#test" > before.txt
PW_CHANNEL= node tests/snapshot.js "http://localhost:8000/eForm_Generator_FreeScribe_offline.html#test" > after.txt
diff before.txt after.txt
```

The snapshot covers the case pages only, not the variations: a change it shows none for still
needs the full run with `--variations`. (A snapshot takes about a minute, the full run about
four.) To see why a rule does what it does, add `--log` after the URL: whatever the app logs
to the console while it reads each image is printed after that image's fields, each line
starting "> ". Put a `console.log` in the app for the values you want, and take it out after.

To see a case page's expected and actual boxes (matched as the tests match them: green
matched, red missing, orange extra, magenta tags that differ, grey skipped), as a PNG and a
list:

```
PW_CHANNEL= node tests/show.js "http://localhost:8000/eForm_Generator_FreeScribe_offline.html#test" tests/cases/referral-form/referral_form_3c1x42_page1.png out.png
```

`show.js` uses the tests' own machinery (`T.harness` in `tests/auto-detect.js`, which stops
before running the tests when `window.eformMapperTestNoRun` is set), so the two always agree.
Add `--variation "0.7× size"` (a variation's name) to draw what Auto Detect finds on that
poorer copy instead, on the page itself.

### To-do or skip

Where a test case's eForm and Auto Detect disagree and the code shouldn't change, say so in
the case's entry in `tests/cases/index.js` (see `tests/README.md`), and pick the right one:

- **To-do**: Auto Detect is wrong and should do better (a missed tick box, letters taken for
  a tick box), and a general fix is believed to exist. It stays until fixed; take it off once
  it passes.
- **Skip**: the eForm made a choice the page can't show, or Auto Detect's answer is as good as
  the page allows; either way a rule to match it would cost real fields on other forms. For
  example: a blank after a row of options that the eForm leaves out (when the same layout gets
  a field elsewhere), rows or cells the eForm joins into one field, a field its script fills, a
  reference that isn't a standard tag (`e$last#…`, `m$…`), a box a poorer copy has left the
  same in pixels as a letter. Skip only what can't apply: one test, one small region on one
  page, with a reason that names the evidence.

**When a general fix isn't there.** Detection must stay general and robust: a rule has to hold
across forms, not rescue one case. Try for a general fact first, and check every attempt
against every case and variation (the snapshot and the full suite). If the only fixes found
need exceptions, special cases, or thresholds fitted to the one case, or any fix costs real
fields elsewhere (a false box, a lost field), don't add it: accept the miss. Skip it, with a
reason that says what was tried and why it can't be told apart ("at 70 dpi this box over a
rule is the same in pixels as a letter on a rule"). Keep a to-do only while you believe a
general fix exists; once you've tried and know why there isn't one, it's a skip. A few honest
skips are better than a detector tuned to its tests.

When a rule takes out the right fields but costs real ones on other forms, look at what the
lost fields share before giving up, and say that in the rule: a blank after a cell's only label
is a heading row's, where several labels spaced along a row are each a blank's.

Write skips by hand, one region each, so every one is visible in the panel with its reason.
Don't add rules to the tests or the app that skip things automatically: they would hide
regressions in those places. If the same kind of skip turns up across several forms, that is
the time to consider one in `tests/auto-detect.js`, for the extra-fields test only, never for
missed fields or tags.

The variations (`VARIATIONS` in `tests/auto-detect.js`) are copies of the pages of the cases
with `"variations": true`, as a clean PDF can come, since eForm templates are mostly clean
PDFs: rendered at another size (0.7× to 3×; the app renders a PDF at the width you set, up to
1500 px) or printed faint. Don't add scan or fax variations (blur, specks, tilt, a fax's black
and white): they test pages the forms rarely are, and tuning for them costs the clean ones. A
new case takes `"variations": true`. Each variation is tested for both tick boxes and fields,
with words read, as the page itself is; the case's own skips and to-dos for fields hold on its
variations too. A variation Auto Detect should do better on is a to-do, in the case's
`variationTodo` (`ticks`, `extraTicks`, `fields` or `extraFields`). One can skip tick boxes it
has left too little of to find (a box over a rule that a small size leaves the same in pixels
as a letter), once a general rule has been tried and couldn't find them without taking letters
too: the case's `variationSkip` in `tests/cases/index.js`. Name each box and say what the
variation did to it; take a box off once it's found. The same goes for something a variation
takes for a tick box that its pixels can't tell from one (a bold letter that is a perfect
square at that size): a skip of one small region on one page. A field a variation can't help
taking or missing is a skip of one small region too (with its `test`), once a general fix has
been tried; a variation is where a threshold fitted to one rendering shows, so try first to
size it against the page.

## Style

- Match the existing code: compact JavaScript, small arrow helpers.
- Variable and function names are clear and descriptive: a name says what the value is or
  what the function does.
- Every function has a brief comment above it describing its purpose. The exception is a
  one-line helper inside a function whose name says what it does
  (`const rowHas = (y, xa, xb) => …`).
- Comments are plain English that say what a rule is for, with the printed text that shows it
  in quotes ("Referring Physician: ____", "☐ OTHER, SPECIFY: ____"). Keep them up to date when
  a rule changes.
- Field detection and tagging rules must be general: a rule says something true of forms in
  general (how a table row is laid out, what a heading looks like), not of the one form in
  front of you. Don't add a rule that names a form's words, a special case for one layout, or
  a stack of exceptions to make one case pass. If a fix needs exceptions to stop it breaking
  other forms, the rule is probably the wrong one: look for the general fact instead.
- Prefer one shared test over another copy with its own thresholds, and size thresholds
  against the page (its rules, its printed text), not fixed pixel counts. Know which pixels a
  threshold counts: the canvas Auto Detect works on (`inkMap`, `bands`, `lineHeight`, `capHeight`) is the
  page resized to about 1600 px on its long side (twice the size for a page under 800 px), so
  it is already sized to the page; page-image pixels (OCR's words, the fields) are not (the
  cases are 850 to 1500 px wide, the variations 0.7× to 3× that).
- Check every rule change against every case: an exact snapshot before and after
  (`tests/snapshot.js`), and every difference explained. Where a form can't be handled yet,
  leave a to-do in its test case rather than an exception in the code, or, if a general fix
  isn't possible, a skip (see "To-do or skip").
- Commit messages: a short summary of what changed, in the same plain style as the comments.
