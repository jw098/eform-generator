# Auto Detect tests

These tests check **Auto Detect**, the button in the eForm Generator that finds the tick boxes
and the places to write on a form's page image and suggests their OSCAR tags.

A **test case is a finished eForm**: the eForm HTML and its page image(s), with every box in
the right place and the right `oscarDB` tag. Each case is a folder in `cases/` holding those
files as they are (the app's OSCAR package, unzipped), so its images can be opened and looked
at like any other. A case can instead be the **session** the eForm was made in (the `.json`
**Save Session** saves): the tests export it as the app does, and it is then tested the same
way. The tests do what you would do in the app:

1. put the case's page image(s) in the app and run **Auto Detect**;
2. build the eForm from what it found, as the export does;
3. compare that eForm with the case's eForm.

So they check the whole way from page image to eForm: finding the boxes, tagging them, and
writing them into the eForm's HTML.

## Running them

Open the app with `#test` at the end of its address, for example:

```
file:///C:/path/to/eForm_Generator.html#test
```

If the app is already open, add `#test` and reload. Nothing needs installing; the tests run
in the browser, inside the app. A run takes about 10 seconds; the panel's title says what it
is doing ("processing page 2 of 3").

Opened from disk like this, the panel first asks you to **choose the `tests/cases` folder**.
A page opened from disk may show an image file but isn't allowed to read its pixels, or to
read other files at all, so it asks for the folder; nothing leaves your computer. If the app
is served over http instead (for example `python -m http.server` in this folder, then
`http://localhost:8000/eForm_Generator.html#test`), it reads the files
itself and doesn't ask.

## On GitHub

The tests also run on GitHub on each push and pull request
(`.github/workflows/tests.yml`), in the Chrome that GitHub's runners come with, driven by
`ci.js`. A failing test fails the run. Its log shows the same expected/actual lines as the
panel under each failure and each to-do (with the to-do's reason), and what each test skipped.
To-dos don't fail it. Each run tests the poorer copies too. To run it again
by hand: Actions → Auto Detect tests → Run workflow.

To run it the same way on your own computer (with Node and Chrome installed):

```
npm install --no-save playwright
python -m http.server 8000
node tests/ci.js "http://localhost:8000/eForm_Generator.html#test" --variations
```

(Leave out `--variations` to skip the poorer copies.)

## What is compared

Two eForms are compared, page by page:

- **Expected:** the test case's eForm.
- **Actual:** the eForm the export builds from what Auto Detect found on the
  case's page image.

What must agree:

- **Where the boxes are.** An actual box matches an expected box of the same kind (tick box,
  or field to write in) when each of its edges is within **10 pixels, or 20% of the box's
  size** in that direction, whichever is more (pixels of the page image). A field to write in
  also matches when the two overlap, across and down, by at least **60% of the expected field
  and 50% of the actual one**: a box a little taller, or set a little higher, over the same
  line. Each case reports:
  - expected tick boxes and fields with no actual one there;
  - actual tick boxes and fields with no expected one there.
- **The `oscarDB` tags.** Each matched field's actual tag must be its expected tag (or both
  none).
- **Date fields.** Each matched field that is a date field in the expected eForm (a date
  input, or one it gives OSCAR's calendar with `Calendar.setup`) must be one in the actual
  eForm too. Not the other way round: most eForms don't mark their date fields.

Names aren't compared; they're only shown, to say which field a failure is about. The
margin and overlap are set at the top of `auto-detect.js` (`MARGIN_PX`, `MARGIN_SHARE`,
`OVERLAP_EXPECTED`, `OVERLAP_ACTUAL`).

Both eForms are read the same way: laid out by the browser, as OSCAR would show them, with
their scripts switched off (only the layout counts), and every field measured against the
page image. So boxes sized by an eForm's CSS (a class for tick boxes) are measured at their
real size, whatever made the eForm. Within an eForm:

- **Pages:** each `<img>` whose id starts with `BGImage` is a page. It shows the image its
  `src` names, or the one a script puts there (`changeImage("page.png", "BGImage")`), or else
  the largest image in the case.
- **Fields:** every input, text area and list on a page counts, except hidden inputs, buttons,
  and anything inside a `DoNotPrint` block.
- **Tick boxes:** checkboxes, radio buttons, and inputs with an `Xbox` or `xMarkOnly` class.

**Also test poorer copies** (a button in the panel, after a run) checks tick boxes and fields
on variations: copies made in the browser of each page of the cases with `"variations": true`
in `cases/index.js`, as a clean PDF can come, since eForm templates are mostly clean PDFs: rendered at
0.7×, 1.5×, 2×, 2.5× or 3× the size, or printed faint. (Scans and faxes aren't among them.)
The forms are blank, so a tick box is empty. On each, Auto Detect runs as on the page itself,
reading the words too, and every tick box and field of the eForm must be found and nothing
else taken for one, but those the case skips (below). Fields are matched as the case's own
tests match them, and the case's own skips and to-dos for fields hold on every copy. It takes
about two and a half minutes more, so it only runs when asked: use it when changing how tick
boxes or fields are found.

## Reading the results

A panel appears at the top right with one line per case:

- ✔ green: everything in that case passed.
- ✘ red: something failed. The line opens by itself, and each failure says what was expected
  and what was actual, for example:
  ```
  expected field "surname" at (63, 429) 422×33 oscarDB="patient_nameL"
      → actual: none there (closest actual: field "surname_of_patient" at (63, 440) 422×20)
  actual field "text_1" at (60, 1666) 960×54
      → expected: nothing there
  field "city_town_40" at (438, 546) 318×38: expected oscarDB="city", actual oscarDB="addressline"
  ```
  Each field is named as its eForm names it (its `name`, or its `id`). Positions are (x, y)
  from the page image's top-left corner, and width×height, in pixels. "Closest actual" is
  the nearest actual box of that kind, when there is one nearby: often it is the right box,
  just outside the margin.
- ○ amber, "to do": something Auto Detect doesn't manage yet (see below); not a failure.
- ★ blue: a to-do that now passes. Take it off the to-do list.

Click a line to see each test under it. Each case's page is also on its own **Page**
tab in the app, with what Auto Detect found drawn on it.

## Adding a test case

1. In the app, make the eForm as it should be: every box in place, with its `oscarDB` tag.
   Download it with **Export OSCAR eForm (.zip)** (a zip of the HTML and its page images). An
   eForm made elsewhere works too: use its `.html` and its background image(s).
2. Open the app with `#test`, click **Add a test case…** in the panel, and pick the zip (or
   the `.html` and its images together). The case runs straight away; its results appear in
   the panel.
3. To keep it, the panel names a folder for it, for example `tests/cases/my-form`. Make that
   folder and put the eForm's files in it: unzip the package there, or use the buttons for
   the `.html` and each image. Then save the `index.js` it offers into `tests/cases` (the list
   of cases, with the new one added).

From then on it runs with the others.

**A fillable PDF** (one with its own form fields): Auto Detect takes the PDF's fields rather than
finding them in the picture, so the test must give it the PDF too. Make the eForm from pages
the app's PDF converter made (**Load onto Canvas**, "All pages"), add the case as above, then
put the PDF in the case's folder and name it in the case's entry in `cases/index.js` as `pdf`:

```js
"pdf": "BounceBack_Referral_Form_2025.pdf"
```

Its pages are the eForm's, in order. Such a case has no variations: a poorer copy of a page is
a picture only, with no PDF behind it.

**A session as the case.** A case can be the session the eForm was made in, in place of its
eForm and images: in the app, place and tag every box, then **Save Session**. Pick that `.json`
with **Add a test case…** (or put it in the case's folder yourself), and name it in the case's
entry as `session`, in place of `eform` and `images`:

```js
{ "name": "Lab requisition", "folder": "lab-requisition", "session": "lab_requisition_session.json" }
```

The tests build the case's eForm from it with the app's own export, then compare as for any
other case; skips, to-dos and variations work the same. It is easier to change than an eForm
(open the session, fix the box, save it again), but it is tested through the export as it is
now: a change to the export changes what the case expects. A session from a fillable PDF isn't
supported (its page images are given to Auto Detect as pictures).

## The files

| File | What it is |
|---|---|
| `cases/index.js` | The list of test cases: each one's name, folder, eForm file and page images, and any to-dos. |
| `cases/<folder>/` | One test case: the eForm's `.html` and its page image(s), and the fillable PDF they were made from, for a case with one; or the session it was made in (`.json`). |
| `auto-detect.js` | The machinery that runs the tests and shows the results. |
| `ci.js` | Runs them in headless Chrome and prints the results, for GitHub (or a terminal). |
| `cases/lines.js` | The line suspects on each case page: every band of ink the app may take for a line, as a box in the page's pixels, labelled 1 (a line that bounds a field: a line to write on, a table row's or box's edge, a shaded bar's bottom edge) or 0 (words, an underline, any part of a bar but its bottom edge, a barcode, a line's soft edge split off). |
| `lines.js` | Tests the line test alone: runs Auto Detect's first pass on each page in `cases/lines.js` (and, with `--variations`, its poorer copies) and checks each band it finds against the suspect nearest it: `node tests/lines.js <app url#test> [--variations] [--page "<folder> p<n>"]`. A new case's page can be added to `cases/lines.js` with its suspects; a change to the band finder can leave bands that match no suspect, which are counted, not tested. |
| `snapshot.js` | Prints exactly what Auto Detect finds on each case's images (no margin), to compare before and after a change that shouldn't change it. |
| `show.js` | Draws one case page with its expected and actual boxes, matched as the tests match them (skips in grey), and saves it as a PNG: `node tests/show.js <app url#test> tests/cases/<folder>/<image> [out.png]` (for a case given as a session, `page1`, `page2`… in place of `<image>`). With `--variation "0.7× size"`, it draws what Auto Detect finds on that poorer copy instead, on the page itself. |

## To-dos

A case's test it doesn't pass yet can be marked as a to-do in `cases/index.js`, with the
reason, so it shows as "to do" rather than as a failure:

```js
{
  "name": "Lab requisition",
  "folder": "lab-requisition",
  "eform": "lab_requisition.html",
  "images": ["lab_requisition_page1.png"],
  "todo": { "ticks": "the tick boxes printed in grey aren't found yet" }
}
```

(The four cases that test Auto Detect's limits, the lab requisition, the questionnaire, the typed
form and the character boxes, have to-dos of their own; some others have one for a variation.)

The keys are `ticks` and `fields` (expected, but missing from the actual eForm), `extraTicks`
and `extraFields` (in the actual eForm, but not expected), `tags`, and `dates`. Delete the to-do once
it passes. A variation's to-dos are the case's `variationTodo` in `cases/index.js`: each names
the variation (as the panel names it), the page (leave it out for every page), the test,
`ticks`, `extraTicks`, `fields` or `extraFields`, and the reason:

```js
"variationTodo": [
  { "variation": "0.7× size", "page": 1, "test": "fields",
    "reason": "the DATE: ____ fill-in line at the top of the page isn't found at 0.7× (about 123 dpi)" }
]
```

Where a test can't apply to part of a page (no printed tick boxes there, say), or what Auto
Detect does there is fine as it is (a blank it takes for a field), the boxes in that part
can be skipped instead: left out of that one test, while everything else is
still checked. Each skip names the test (same keys as above), the page, the region as
[x, y, width, height] in page-image pixels (the same numbers the failures show), and the
reason. A box is left out when its centre is in the region. Leave out `page` for every page,
or `region` for the whole page:

```js
"skip": [
  {
    "test": "ticks",
    "page": 2,
    "region": [0, 170, 1500, 900],
    "reason": "no printed tick boxes here, so there are none to find"
  }
]
```

The test's line in the panel then says what it left out, in grey, for example
`16 tick boxes on page 2 in (0, 170) 1500×900 skipped: no printed tick boxes here, …`.

A variation can skip tick boxes too, where it leaves too little of a box to find (at a small
size, a box over a line is the same in pixels as a letter on one). The skips are the case's
`variationSkip` in `cases/index.js`: each names the variation (as the panel names it) and the
boxes (by their names in the eForm), with the reason:

```js
"variationSkip": [
  {
    "variation": "0.7× size",
    "boxes": ["Orientation2_Left", "Orientation4_Left"],
    "reason": "at 0.7× the page is about 70 dpi, …"
  }
]
```

They're left out of that variation's "each expected tick box is found" only; one found anyway
still counts as found, not as an extra, and its line then says `found now, take off the skip`.

Where a variation takes something for a tick box that the page itself can't tell from one (a
bold letter that is a perfect square at that size), a skip can leave it out of "no actual tick
box that isn't expected" instead: it names the page and a small region, in the page's own
pixels (as the case's own skips do), and anything found there, but an expected box, is left
out. With a `test`, `fields` or `extraFields`, it leaves fields there out of that test instead
(without one, it is `extraTicks`). Its line says what it left out, or `nothing … now, take off
the skip`:

```js
{ "variation": "0.7× size", "page": 2, "region": [625, 1655, 35, 35],
  "reason": "the bold D of \"DETAILS\" in a heading: …" }
```

A variation, box or page that isn't there, in a skip or a to-do, fails "each skip and to-do
names a variation, and tick boxes and pages there are".
