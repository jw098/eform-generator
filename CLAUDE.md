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
`Oscar Version` is `12` (105 tags). Tags from later versions (`15`, `15b803`, `19`…) and tags
not in the file don't exist for this project: Auto Detect must never suggest one, and a new
rule or list of tags must use only version 12's. (The rows with no version are the source
page's section headings, not tags.) To list them:

```
python3 -c "import csv; print('\n'.join(r[1] for r in csv.reader(open('CodingAgentContext/standard-eform-tags.csv', encoding='utf-8-sig')) if r[0].strip() == '12'))"
```

In the code: `DEFAULT_TAGS` (the tags offered to start with) and `TAG_FOR` (what Auto Detect
suggests) hold only version 12's tags. `REMOVED_TAGS` lists the other tags the app used to
offer; they are kept out of the tag list from any source, and a saved session's field loses
one. Where version 12 has no tag for something (a clinician's email), the field gets none.
A signature is a field type (`signature`, exported as OSCAR's signature stamp), not a tag.
A test case's expected tags follow the same rule. (OSCAR measurement references such as
`m$EDC#value` aren't standard tags, and Auto Detect doesn't suggest them.)

## Auto Detect, in order (`detectCurrentPage`)

A fillable PDF's own form fields are taken as they are, when the page came from one
(`pdfFormFields`). Otherwise Auto Detect works from the picture, in two passes.

**Pass 1: the picture only, no OCR.** It must not rely on OCR: it finds the fields from the
ink alone, so it works where the words can't be read (no WebAssembly SIMD, no workers) and
in the tests' tick-box-only runs (`readWords: false`). Never move a call to
`readPageWords`, or anything using its words, into pass 1.
1. Straighten (`estimateSkew`), make an ink map (`clean`) and find the rules (`bands`).
2. Text fields from the rules (`textFieldsFromLines`: fill-in lines, table rows and cells,
   ruled writing areas), then open writing areas under a label (`areaFields`). A "label" here
   is ink, not words.
3. Tick boxes: connected blobs and `rectScan`, both judged by `isRealBox` / `isRealCircle`.

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

To see a case page's expected and actual boxes (matched as the tests match them: green
matched, red missing, orange extra, magenta tags that differ, grey skipped), as a PNG and a
list:

```
PW_CHANNEL= node tests/show.js "http://localhost:8000/eForm_Generator_FreeScribe_offline.html#test" tests/cases/referral-form/referral_form_3c1x42_page1.png out.png
```

`show.js` uses the tests' own machinery (`T.harness` in `tests/auto-detect.js`, which stops
before running the tests when `window.eformMapperTestNoRun` is set), so the two always agree.

## Style

- Match the existing code: compact JavaScript, short local names, small arrow helpers.
- Comments are plain English that say what a rule is for, with the printed text that shows it
  in quotes ("Referring Physician: ____", "☐ OTHER, SPECIFY: ____"). Keep them up to date when
  a rule changes.
- Field detection and tagging rules must be general: a rule says something true of forms in
  general (how a table row is laid out, what a heading looks like), not of the one form in
  front of you. Don't add a rule that names a form's words, a special case for one layout, or
  a stack of exceptions to make one case pass. If a fix needs exceptions to stop it breaking
  other forms, the rule is probably the wrong one: look for the general fact instead.
- Prefer one shared test over another copy with its own thresholds, and size thresholds
  against the page (its rules, its printed text), not fixed pixel counts.
- Check every rule change against every case: an exact snapshot before and after
  (`tests/snapshot.js`), and every difference explained. Where a form can't be handled yet,
  leave a to-do in its test case rather than an exception in the code.
- Commit messages: a short summary of what changed, in the same plain style as the comments.
