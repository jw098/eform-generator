# eForm Generator

A single-page browser app that turns a scanned or PDF form into an OSCAR eForm: put fields
on the page image, tag them with `oscarDB` tags, and export the eForm's HTML (or an OSCAR
package). **Auto Detect** finds the tick boxes and the places to write, and suggests tags.

## Layout

- `eForm_Generator.html`: the whole app, one file (~6,200 lines). It runs
  offline from disk, so its libraries are embedded (pdf.js, Tesseract.js with its English
  data, an Emscripten module): lines ~500–870 are minified or base64 vendor code, some lines
  megabytes long. Don't edit them, and keep searches off them (a search that hits them prints
  megabytes). The app's own code starts around line 900.
- `tests/`: the Auto Detect tests (see `tests/README.md`). Each case in `tests/cases/` is a
  finished eForm and its page image(s), and for a fillable PDF the PDF itself (its `pdf`); or
  the session it was made in (its `session`, Save Session's `.json`), which the tests export as
  the app does.
- `CodingAgentContext/standard-eform-tags.csv`: OSCAR's standard eForm tags, with the OSCAR
  version each came in (see "Tags" below).

## Words

- **line**: a straight line printed on the page: a fill-in line, a table's or a box's edge, the
  line under a heading. Never a row of printed words: that is a **row of text**.
- **check**: a step of Auto Detect that decides something ("the line check": `solidLine` and
  `isLine`). Not "rule", which this project used for both.
- **band**: a run of ink across a row that the band finder (`bands`) returns, before any check:
  a line, or words or a bar that look like one.
- **bar**: a shaded bar, a block of grey or black ink, often with white letters in it.

## Tags

Only the **OSCAR version 12** tags count: the rows of `standard-eform-tags.csv` whose
`Oscar Version` is `12` and whose tag isn't empty (102 tags). Tags from later versions (`15`, `15b803`, `19`…) and tags
not in the file don't exist for this project: Auto Detect must never suggest one, and a new
check or list of tags must use only version 12's. (The rows with no version are the source
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
A tick box (`checkbox`), a circle toggle, a free draw area and a signature never hold a tag
(`takesNoTag`): Auto Detect, "Auto-tag untagged" and "Guess" (`guessTag`) give them none, and
a tag one is given (by a user, an imported eForm, a saved session) is dropped. A tick box can
still be ticked by a custom fill (for a sex).
A test case's expected tags follow it too. (OSCAR measurement references such as
`m$EDC#value` aren't standard tags, and Auto Detect doesn't suggest them.)

## Auto Detect, in order (`detectCurrentPage`)

The forms are blank templates, mostly clean PDFs rendered at some size, sometimes a scan or a
fax. A check may rely on that: a tick box is empty (`isRealBox` turns away ink in a box's
middle, which is how a letter such as the B in "Bilat." is told from a box), and nothing is
filled in or ticked by hand. Don't loosen a check for filled-in forms.

Auto Detect works from the picture, in two passes. When the page came from a fillable PDF,
the PDF's own form fields are taken as they are (`pdfFormFields`: positions, names and labels)
in place of the fields pass 1 finds, unless "Detect from" is set to "Visual detection"
(`state.detectMode`; it offers "PDF form fields" only for a fillable PDF, `refreshDetectMode`); pass 1 still reads the page's lines, and pass 2 only what's
printed around them (`sectionFields`) and their tags (`tagFields`).

**Pass 1: the picture only, no OCR.** It must not rely on OCR: it finds the fields from the
ink alone, so it works where the words can't be read (no WebAssembly SIMD, no workers;
`readWords: false` runs it so). Never move a call to `readPageWords`, or anything using its
words, into pass 1.
1. Straighten (`estimateSkew`), stretch a faint page's grey levels (`stretchGrey`, also on
   the copy OCR reads), make an ink map (`inkMap`) and find its bands (`bands`), the candidate lines. The ink map
   drops lone pixels: keep that, even for clean PDFs (a lone pixel on the Diabetes form's top
   edge becomes a writing area without it). It also drops a small colon's one-pixel dots
   ("MENOPAUSE (AGE):" at 1500 px), which OCR misses too, so a check can't rely on every colon.
   Dotted and dashed lines ("Date of injury: ........") are drawn into the ink map as the
   solid lines they stand for (`drawDotLeaders`), before the bands are found.
   A band is taken for a line that bounds a field only if it isn't part of a bar other than its
   bottom edge (`barBands`: bands overlapping along half the longer, with no row of paper between
   them on the grey page, together thicker than a line can be), its ink, split at its own grey
   level (Otsu's), is a solid line once its soft edges are trimmed (`solidLine`), or it is a dot
   leader or a thick band's bottom edge; and it isn't an underline, with letters standing on it
   (`isLine`). Bold words run together, a bar's solid top and the white letters in it make bands
   too; this is what turns them away.
2. Tick boxes: connected blobs and `rectScan`, both judged by `isRealBox` / `isRealCircle`.
3. Text fields from the lines (`textFieldsFromLines`: fill-in lines, table rows and cells,
   ruled writing areas; it is given the tick boxes, a cell's options), then open writing areas
   under a label (`areaFields`). A "label" here is ink, not words. A table's heading row (cells with
   print, over at least two rows of empty cells of their column right under them: blank, or a single
   tick box, between the column's side lines) has no fields (`dropHeadingRows`). Boxes for one
   character each (a strip framed top and bottom, split by full-height dividers into even, empty,
   letter-sized cells; strips less than a box apart on one row are one row) are a field per box,
   marked with their row (`characterBoxes`).

**Pass 2: the words OCR reads (`readPageWords`).** Only pass 2 uses OCR. It refines what
pass 1 found and is skipped when the words can't be read (fields then keep plain names and
no tags).
4. Words OCR read from a line ("EEE" on an underscore line, `markLineWords`) are left out of
   the page's typical word height, not out of the words. A row of character boxes is one field
   across the row (its label beside or above it), unless words are printed over the boxes one by
   one ("0 1 2 3"): then each box stays its own (`joinCharacterBoxes`). Then fields after a colon
   (`colonFields`: blank page, or a line too short for pass 1 to find), each field's label (`labelFields`; the words just above a line come last, and never another
   line's caption), a one-line field
   shorter than its own label's text made taller, through blank page only
   (`fitFieldsToLabels`), the fields the labels split or rule out (`fieldsFromLabels`),
   captions and section headings (`sectionFields`: a one-line field with no other label takes its
   caption, and several captions spaced along a line are a field each).
5. Names from the labels, then tags (`tagFields`: `fieldOwners` → `guessTag` / `askedFor` /
   `TAG_FOR` → `captionTag`), then date fields: a one-line field whose label names a date
   (`labelNamesADate`, not a birth date) becomes one, in the format printed with it
   (`printedDateFormat`); and a field whose tag fills several lines (`label`, `clinic_label`)
   is a text area (`fitMultilineFields`). A stamp's label gives its details (`guessTag`:
   "Doctor stamp" `current_user`, "Clinic stamp" `clinic_label`). A fillable PDF's field the PDF formats as a date is one already, in
   its format (`pdfDateFormat`).

Last, whichever pass found it, a field with printed text in it (more than a speck, not a line or a
tick box) is cut back to its larger blank part, however small (`trimFieldsToBlank`): a field to
write in is blank page.

The pass-2 steps pass what they learn on the fields themselves (`box`, `_words`, `_split`…);
the list is in the comment at the head of "Pass 2". Shared tests: `sideLine` /
`joinedBySides` (lines and boxes), `capsText` / `headingLabel` / `isSentence` (headings and
sentences), `fieldLeftOf`.

## Testing

Serve the folder and run the tests in headless Chromium (here, `PW_CHANNEL=` uses
Playwright's own Chromium; on GitHub it's the runner's Chrome):

```
python3 -m http.server 8000 &
PW_CHANNEL= node tests/ci.js "http://localhost:8000/eForm_Generator.html#test" --variations
```

Every test must pass; to-dos (○) are allowed. CI runs the same on each push, then the line
tests: whether each band of ink on the case pages is taken for a line, against the labels in
`tests/cases/lines.js` (1: a line that bounds a field; 0: words, an underline, any part of a
bar but its bottom edge, a line's split-off edge). Run them after any change to the ink map, `bands` or the line
test (`barBands`, `solidLine`, `isLine`); they take about a minute here:

```
PW_CHANNEL= node tests/lines.js "http://localhost:8000/eForm_Generator.html#test" --variations
```

For a change meant not to change what Auto Detect finds (a refactor, a tidy-up), also compare
exact snapshots before and after. They are deterministic, so any diff comes from the change:

```
PW_CHANNEL= node tests/snapshot.js "http://localhost:8000/eForm_Generator.html#test" > before.txt
PW_CHANNEL= node tests/snapshot.js "http://localhost:8000/eForm_Generator.html#test" > after.txt
diff before.txt after.txt
```

The snapshot covers the case pages only, not the variations: a change it shows none for still
needs the full run with `--variations`. (Here, a snapshot takes about a minute and a half, the
full run several minutes. All three scripts run several browsers at once, each doing its share of
the cases: `--jobs N` sets how many, `--jobs 1` one; their output is the same whatever the jobs.)
To see why a check does what it does, add `--log` after the URL: whatever the app logs
to the console while it reads each image is printed after that image's fields, each line
starting "> ". Put a `console.log` in the app for the values you want, and take it out after.

To see a case page's expected and actual boxes (matched as the tests match them: green
matched, red missing, orange extra, magenta tags that differ, grey skipped), as a PNG and a
list:

```
PW_CHANNEL= node tests/show.js "http://localhost:8000/eForm_Generator.html#test" tests/cases/referral-form/referral_form_3c1x42_page1.png out.png
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
  the page allows; either way a check to match it would cost real fields on other forms. For
  example: a blank after a row of options that the eForm leaves out (when the same layout gets
  a field elsewhere), rows or cells the eForm joins into one field, a field its script fills, a
  reference that isn't a standard tag (`e$last#…`, `m$…`), a box a poorer copy has left the
  same in pixels as a letter. Skip only what can't apply: one test, one small region on one
  page, with a reason that names the evidence.

**When a general fix isn't there.** Detection must stay general and robust: a check has to hold
across forms, not rescue one case. Try for a general fact first, and test every attempt
against every case and variation (the snapshot and the full suite). If the only fixes found
need exceptions, special cases, or thresholds fitted to the one case, or any fix costs real
fields elsewhere (a false box, a lost field), don't add it: accept the miss. Skip it, with a
reason that says what was tried and why it can't be told apart ("at 70 dpi this box over a
line is the same in pixels as a letter on a line"). Keep a to-do only while you believe a
general fix exists; once you've tried and know why there isn't one, it's a skip. A few honest
skips are better than a detector tuned to its tests.

When a check takes out the right fields but costs real ones on other forms, look at what the
lost fields share before giving up, and say that in the check: a blank after a cell's only label
is a heading row's, where several labels spaced along a row are each a blank's.

Write skips by hand, one region each, so every one is visible in the panel with its reason.
Don't add checks to the tests or the app that skip things automatically: they would hide
regressions in those places. If the same kind of skip turns up across several forms, that is
the time to consider one in `tests/auto-detect.js`, for the extra-fields test only, never for
missed fields or tags.

The variations (`VARIATIONS` in `tests/auto-detect.js`) are copies of the pages of the cases
with `"variations": true`, as a clean PDF can come, since eForm templates are mostly clean
PDFs: rendered at another size (0.7× to 3×; the app renders a PDF at the width you set, up to
1500 px) or printed faint. Don't add scan or fax variations (blur, specks, tilt, a fax's black
and white): they test pages the forms rarely are, and tuning for them costs the clean ones. A
new case takes `"variations": true` (but a fillable PDF's, whose copies would be pictures with no
PDF behind them). Each variation is tested for both tick boxes and fields,
with words read, as the page itself is; the case's own skips and to-dos for fields hold on its
variations too. A variation Auto Detect should do better on is a to-do, in the case's
`variationTodo` (`ticks`, `extraTicks`, `fields` or `extraFields`). One can skip tick boxes it
has left too little of to find (a box over a line that a small size leaves the same in pixels
as a letter), once a general check has been tried and couldn't find them without taking letters
too: the case's `variationSkip` in `tests/cases/index.js`. Name each box and say what the
variation did to it; take a box off once it's found. The same goes for something a variation
takes for a tick box that its pixels can't tell from one (a bold letter that is a perfect
square at that size): a skip of one small region on one page. A field a variation can't help
taking or missing is a skip of one small region too (with its `test`), once a general fix has
been tried; a variation is where a threshold fitted to one rendering shows, so try first to
size it against the page.

## Changing a check

Discuss before fixing. When Auto Detect gets something wrong, first find the cause and say
what it is, with the evidence (the printed text, the values a temporary `console.log` showed,
a picture), and propose the fix: what the check would say, why it is general, and what it may
cost on other forms (with options where there is more than one way). Then wait for the user to
agree before changing any detection or tagging check in `eForm_Generator.html`. Investigating is
fine meanwhile: temporary logs and experiments on copies of a page, with the app put back as
it was after. Once agreed, make the change and test it as below (snapshot, full suite), and
bring back anything it changed that wasn't discussed.

**Working on your own, when asked.** When the user asks for work to go ahead without checking
in ("keep fixing the to-dos without my intervention"), don't wait for agreement: investigate,
make the change, test it and push it, for as long as that request holds. Everything else here
still applies: the cause found with evidence first, a fix only if it is general (no exceptions
or thresholds fitted to one case), tried on a copy with the snapshot diff explained, then the
full suite before pushing to `main`. Where a fix costs real fields elsewhere or needs special
cases, make it a skip with a reason saying what was tried, as "To-do or skip" says. Afterwards,
report what changed: each check changed and why, what each changed on other forms, and each
skip or to-do added. A test case's expected answer still changes only with the user's say-so.

## Decisions

Settled with the user; follow them unless the user changes them.

**Working**
- A test case's expected answer is what is right for the form, not what Auto Detect happens to
  do. Change one (an eForm's field, a session's) only with the user's say-so, and never just to
  make a test pass. Where Auto Detect is wrong, the check changes, or it is a to-do or a skip.
- A made-up test form (the limit forms) prints what real forms print. Where its wording is
  artificial ("Today (oscarDB today)"), fix the form, not the check.
- Measure before choosing a number: log the values on every case (a temporary `console.log`, the
  snapshot with `--log`), and say which numbers were measured and which were chosen.
- Run the full suite in the background, so the user can keep talking meanwhile, and don't change
  the app while a run is going: it reads the app once, at its start.
- Until the tests pass, commit to the session's branch only; push to `main` once they pass. Don't
  force-push.

**What a correct eForm is**
- A field to write in is blank page: it never covers printed text (`trimFieldsToBlank`).
- A signature line isn't a text field, nor are words printed to circle: Auto Detect can't make
  either, so where it takes one for a field, the case skips it.
- A stamp's space holds what the stamp would: "Doctor stamp", "Physician stamp" `current_user`;
  "Clinic stamp", "Office stamp" `clinic_label`. A stamp offered in brackets as another way to
  fill a field ("NAME OF PHYSICIAN (or office stamp)") doesn't make it a stamp's.
- A field whose tag fills several lines (`label`, `clinic_label`) is a text area.
- On a form sent by the clinician, "referral", "referring" and "prescriber" mean the clinician
  (the user): `current_user`, `clinic_phone`, `clinic_fax`. A date beside a signature is the date
  of signing, `today`.
- A birth date's tag is `dobc2` (year first). `chartno` isn't wanted: a chart number's field
  needs no tag.

## Style

- Match the existing code: compact JavaScript, small arrow helpers.
- Variable and function names are clear and descriptive: a name says what the value is or
  what the function does.
- Every function has a brief comment above it describing its purpose. The exception is a
  one-line helper inside a function whose name says what it does
  (`const rowHas = (y, xa, xb) => …`).
- Comments are plain English that say what a check is for, with the printed text that shows it
  in quotes ("Referring Physician: ____", "☐ OTHER, SPECIFY: ____"). Keep them up to date when
  a check changes.
- Field detection and tagging checks must be general: a check says something true of forms in
  general (how a table row is laid out, what a heading looks like), not of the one form in
  front of you. Don't add a check that names a form's words, a special case for one layout, or
  a stack of exceptions to make one case pass. If a fix needs exceptions to stop it breaking
  other forms, the check is probably the wrong one: look for the general fact instead.
- Prefer one shared test over another copy with its own thresholds, and size thresholds
  against the page (its lines, its printed text), not fixed pixel counts. Know which pixels a
  threshold counts: the canvas Auto Detect works on (`inkMap`, `bands`, `lineHeight`, `capHeight`) is the
  page resized to about 1600 px on its long side (twice the size for a page under 800 px), so
  it is already sized to the page; page-image pixels (OCR's words, the fields) are not (the
  cases are 850 to 1500 px wide, the variations 0.7× to 3× that).
- Test every change to a check against every case: an exact snapshot before and after
  (`tests/snapshot.js`), and every difference explained. Where a form can't be handled yet,
  leave a to-do in its test case rather than an exception in the code, or, if a general fix
  isn't possible, a skip (see "To-do or skip").
- Commit messages: a short summary of what changed, in the same plain style as the comments.
- Push finished work straight to `main` (once the tests pass), not to a separate branch, and
  open no pull request unless asked.
