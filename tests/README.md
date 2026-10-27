# Auto Detect tests

These tests check **Auto Detect**, the button in the eForm Mapper that finds the tick boxes
and the places to write on a scanned form and suggests their OSCAR tags.

A **test case is a finished eForm**: the eForm HTML and its page image(s), with every box in
the right place and the right `oscarDB` tag. Each case is a folder in `cases/` holding those
files as they are (the app's OSCAR package, unzipped), so its images can be opened and looked
at like any other. The tests do what you would do in the app:

1. put the case's page image(s) in the app and run **Auto Detect**;
2. build the eForm from what it found with **Build HTML draft**;
3. compare that eForm with the case's eForm.

So they check the whole way from page image to eForm: finding the boxes, tagging them, and
writing them into the eForm's HTML.

## Running them

Open the app with `#test` at the end of its address, for example:

```
file:///C:/path/to/eForm_Generator_FreeScribe_offline.html#test
```

If the app is already open, add `#test` and reload. Nothing needs installing; the tests run
in the browser, inside the app. A run takes about 15 to 20 seconds.

Opened from disk like this, the panel first asks you to **choose the `tests/cases` folder**.
A page opened from disk may show an image file but isn't allowed to read its pixels, or to
read other files at all, so it asks for the folder; nothing leaves your computer. If the app
is served over http instead (for example `python -m http.server` in this folder, then
`http://localhost:8000/eForm_Generator_FreeScribe_offline.html#test`), it reads the files
itself and doesn't ask.

## What is compared

For each page of each case, the case's eForm is compared with the one built from Auto Detect:

- **Where the boxes are.** A found box matches an eForm box of the same kind (tick box, or
  place to write) when each of its edges is within **10 pixels, or 20% of the box's size**
  in that direction, whichever is more (pixels of the page image). Each case reports:
  - tick boxes and fields in the eForm that weren't found;
  - tick boxes and fields found that aren't in the eForm.
- **The `oscarDB` tags.** Each matched field must have the same tag as the eForm's (or both
  none).

Names don't matter. The margin is set at the top of `auto-detect.js` (`MARGIN_PX`,
`MARGIN_SHARE`).

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

Then, on poorer copies of the referral form made in the browser (resized as if scanned at
another resolution, blurred, speckled, rough JPEG, tilted, faxed, printed faint, ticked by
hand), every tick box must be found and nothing else taken for one.

## Reading the results

A panel appears at the top right with one line per case:

- ✔ green: everything in that case passed.
- ✘ red: something failed. The line opens by itself, and each failure says what went wrong,
  for example `field at (63, 546) 374×33: got "addressline", want "address"`, or
  `not found: tick box at (64, 318)`. Positions are (x, y) from the page image's top-left
  corner, and width×height, in pixels.
- ○ amber, "to do": something Auto Detect doesn't manage yet (see below); not a failure.
- ★ blue: a to-do that now passes. Take it off the to-do list.

Click a line to see each test under it. Each case's page is also on its own **Edit Page**
tab in the app, with what Auto Detect found drawn on it.

## Adding a test case

1. In the app, make the eForm as it should be: every box in place, with its `oscarDB` tag.
   Download it with **Download OSCAR package** (a zip of the HTML and its page images). An
   eForm made elsewhere works too: use its `.html` and its background image(s).
2. Open the app with `#test`, click **Add a test case…** in the panel, and pick the zip (or
   the `.html` and its images together). The case runs straight away; its results appear in
   the panel.
3. To keep it, the panel names a folder for it, for example `tests/cases/my-form`. Make that
   folder and put the eForm's files in it: unzip the package there, or use the buttons for
   the `.html` and each image. Then save the `index.js` it offers into `tests/cases` (the list
   of cases, with the new one added).

From then on it runs with the others.

## The files

| File | What it is |
|---|---|
| `cases/index.js` | The list of test cases: each one's name, folder, eForm file and page images, and any to-dos. |
| `cases/<folder>/` | One test case: the eForm's `.html` and its page image(s). |
| `auto-detect.js` | The machinery that runs the tests and shows the results. |

## To-dos

A case's test it doesn't pass yet can be marked as a to-do in `cases/index.js`, with the
reason, so it shows as "to do" rather than as a failure:

```js
{
  "name": "Mammography requisition",
  "folder": "mammography-requisition",
  "eform": "mammography_requisition_42630x.html",
  "images": ["mammography_requisition_42630x_page1.png"],
  "todo": { "extraFields": "two places that aren't fields" }
}
```

The keys are `ticks` (tick boxes not found), `fields` (fields not found), `extraTicks` and
`extraFields` (found, but not in the eForm), and `tags`. Delete the to-do once it passes.
The poorer copies' to-dos are the `todo: '...'` on their lines in `auto-detect.js`.
