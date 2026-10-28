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
- `CodingAgentContext/standard-eform-tags.csv`: OSCAR's standard eForm tags.

## Auto Detect, in order (`detectCurrentPage`)

1. A fillable PDF's own form fields, when the page came from one (`pdfFormFields`); else:
2. The picture: straighten (`estimateSkew`), make an ink map (`clean`) and find the rules (`bands`).
3. Text fields from the rules (`textFieldsFromLines`: fill-in lines, table rows and cells,
   ruled writing areas), then open writing areas under a label (`areaFields`).
4. Tick boxes: connected blobs and `rectScan`, both judged by `isRealBox` / `isRealCircle`.
5. Pass 2, with the words OCR reads (`readPageWords`): fields after a colon (`colonFields`),
   each field's label (`labelFields`), the fields the labels split or rule out
   (`fieldsFromLabels`), captions and section headings (`sectionFields`).
6. Names from the labels, then tags (`tagFields`: `fieldOwners` → `guessTag` / `askedFor` /
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

## Style

- Match the existing code: compact JavaScript, short local names, small arrow helpers.
- Comments are plain English that say what a rule is for, with the printed text that shows it
  in quotes ("Referring Physician: ____", "☐ OTHER, SPECIFY: ____"). Keep them up to date when
  a rule changes.
- Prefer one shared test over another copy with its own thresholds. A new exception for one
  form should be a last resort; check it against every case.
- Commit messages: a short summary of what changed, in the same plain style as the comments.
