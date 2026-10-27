# Auto Detect tests

These tests check **Auto Detect**, the button in the eForm Mapper that finds the tick boxes
and the places to write on a scanned form, names them after their printed labels and suggests
their OSCAR tags.

## Running them

Open the app with `#test` at the end of its address, for example:

```
file:///C:/path/to/eForm_Generator_FreeScribe_offline.html#test
```

If the app is already open, add `#test` and reload. Nothing needs installing; the tests run
in the browser, inside the app itself. A run takes about 15 to 20 seconds.

## Reading the results

A panel appears at the top right with one line per test page:

- ✔ green: everything on that page passed.
- ✘ red: something failed. The group opens by itself, and each failure says what went wrong,
  for example `CITY/TOWN: got "addressline", want "city"` or
  `expected fields that were not detected: SURNAME OF PATIENT`.
- ○ amber, "to do": something Auto Detect doesn't manage yet. These are known gaps, not
  failures; the line says how far it got (`found 6 of 18`).
- ★ blue: a to-do that now passes. Take it off the to-do list (see below).

Click a line to see each test under it. Each test page is also put on its own **Edit Page**
tab in the app, with everything Auto Detect found drawn on it, so you can look at the page
itself. The same results are written to the browser's console.

## What is checked

For each test page in `pages.js`:

- every tick box is found, and nothing else is taken for one;
- the label printed beside each tick box is read correctly;
- every place to write is found, as a single line or as a writing area of several lines, and
  nothing else is;
- each place to write gets the right OSCAR tag, or no tag where none fits (a wrong tag fills
  the wrong patient data into the form, which is worse than none);
- tick boxes get no tag, names don't repeat, and no text field covers a tick box.

Then, on poorer copies of the referral form made in the browser (resized as if scanned at
another resolution, blurred, speckled, rough JPEG, tilted, faxed, printed faint, ticked by
hand), every tick box must be found and nothing else taken for one.

Positions may be off by up to 6 pixels.

## The files

| File | What it is |
|---|---|
| `pages.js` | **What is on each test page**: one line per tick box or place to write, with where it is and the label or tag Auto Detect should come up with. The file to read or change. |
| `auto-detect.js` | The machinery that runs the tests and shows the results. |
| `fixtures/*.png` | The test pages as images. |
| `fixtures/*.js` | The same images written out as text. A page opened from disk can't read the pixels of a separate image file, so the tests load the image from here. Not meant to be read. |

## Adding a test page

1. Save the page as a PNG in `fixtures/`, for example `fixtures/my-form.png`.
2. Make `fixtures/my-form.js` from it. Copy the first five lines of another fixture `.js`,
   change the name in them to `my-form`, and replace the long text in quotes with the output
   of `base64 -w0 my-form.png`.
3. Add an entry for it at the end of the list in `pages.js`. The easiest way to fill it in:
   run the tests, look at what Auto Detect found on the new page's tab (select a field to see
   its position and size), and write down the ones that are right. Anything it misses goes
   under `notYet`, as a to-do.

## Taking a to-do off the list

A to-do in `pages.js` (under `notYet`) moves into `lines` or `areas` with its exact
position. A to-do among the poorer copies is the `todo: '...'` on its line in
`auto-detect.js`; delete it.
