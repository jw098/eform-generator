# eForm Generator - How to use

Turns a PDF form into an OSCAR eForm.

## Quick start

To quickly generate an eForm, just do the following steps:
- Download `eForm_Generator.html` and open it in a browser; it runs offline.
- Load the images: Under `PDF → PNG converter`, browse and select your PDF file. Click `Load into Mapper`. The image should show up in the canvas.
- Click `Auto Detect (All Pages)`. 
- Review each page to ensure the input fields are correctly placed, and are properly tagged (see "Editing input fields" below). Click the buttons for `Page 1`, `Page 2`, etc. to check each page.
- Click `Check eForm` to ensure there are no major issues with the eForm.
- Click `Export OSCAR eForm (.zip)` to get the final .zip file, which can be imported into OSCAR.

## Upload images

There are 2 different approaches:

- `PDF → PNG converter`: Upload the PDF file. Then click `Load into Mapper` (purple button).
- Upload images manually: Click `Upload Page 1 Image`, then select the desired image. For a multi-page eForm, click `+ Add Page`, which asks for the new page's image straight away. Repeat for all necessary pages. To change a page's image, open its tab and click the same button, now `Replace Page N Image`; a new image the same shape as the old one keeps the page's fields in place.

If done correctly, your desired image should show up on the canvas. For multi-page eForms, click the `Page N` tabs to move between pages.

## Auto Detect

Next, detect the location of the fields/input boxes. Click `Auto Detect (All Pages)` (purple button) to do every page, or `Auto Detect (Current Page)` for the page shown.

`Auto Detect (All Pages)` skips pages that already have fields, so it never puts a second set on top of your work, and one `Undo` takes back the whole run. To redo a page, clear it (`More` → `Clear Current Page`) and run Auto Detect again.

`Detect from` (next to the buttons) chooses where the fields come from:
- `PDF form fields`: a fillable PDF's own fields, with their exact positions and the PDF's names. A page with no PDF form fields is detected visually. This is the default for a fillable PDF.
- `Visual detection`: the printed lines and boxes, with names from the printed labels. Use it when a fillable PDF's fields are poor (missing, misplaced, or named `Text1`). For page images and flat PDFs, it's the only choice.

The eForm Generator should automatically add boxes for all input fields. Using OCR, it also names the fields from their printed labels (with `PDF form fields`, the PDF's own names) and, more importantly, suggests an oscarDB tag for each.

Checkboxes, circles, free draw areas and signatures never get an oscarDB tag. A checkbox can still be ticked automatically with a `Custom text/action`, such as one for the patient's sex.

## Manually adding fields
Above the canvas, and below the `Auto Detect (Current Page)` button, there are buttons to add input fields.

- `Add Text Line`: Adds a single line text field to the top left corner.
- `Add Text Area`: Adds a multi-line text field to the top left corner, with ▲▼ font size buttons.
- `Place Checkbox`: Then click the page wherever a checkbox goes, sized by `Checkbox size (px)`. Click the button again to stop.
- `Add Date`: Adds a single line text field to the top left corner, with a calendar selector.

Revealed by the `More` button:
- `Add Circle`: Adds a circle to the top left corner. In the actual eForm, clicking will toggle on/off a circle.
- `Free Draw`: Adds a free draw box to the top left corner. The associated `Undo, Clear` controls can be moved separately from the free draw box; they can even be moved off the canvas to the right side bar.
- `Add Signature`: Adds a signature box to the bottom right corner. The associated `Stamp, Draw, Electronic, Clear` controls can be moved separately from the signature box; they can even be moved off the canvas to the right side bar.

## Adjusting position of fields
All fields can be moved and resized, and copied and pasted. 

Keyboard shortcuts, when a field is selected:
- Arrow keys: nudge the field 1 pixel
- Shift+Arrow keys: nudge the field 10 px
- Ctrl/Cmd+C: copy
- Ctrl/Cmd+V: paste (next to the original on the same page, at the top left corner on another page)
- Ctrl/Cmd+D: duplicate, next to the original.
- Ctrl/Cmd+Z: undo (the same as the `Undo` button)
- Delete or Backspace: delete the field

## Editing input fields: oscarDB, name, size, location

If you click a specific input field, its data will be in the right sidebar under `Selected field`.

- `Name`: The field's name in the eForm; OSCAR saves its value under it, so ensure you keep names unique. Also used by `Guess tag`.
- `Fill with`: Dropdown that toggles between `OSCAR tag` and `Custom text/action`
    - `OSCAR tag`: oscarDB tag, which then automatically pulls in its associated value when the eForm is loaded on OSCAR. Shows up as green text on the canvas. You may choose the tag from the dropdown list, or manually type in the oscarDB tag. If you manually input an oscarDB tag that isn't in the standard OSCAR 12 tags, you will see a warning.
    - `Custom text/action`: These are an alternative to oscarDB tags, particularly where the text or action you want isn't offered directly by the oscarDB tag. For example, ticking a box for the patient's sex, showing two phone numbers, or only the current user's first or last name. These show up as purple text on the canvas. 
- `Guess tag`: Guesses an oscarDB tag from the selected field's name (and, for a field Auto Detect or an import found, the label printed beside it).
- `Font size`: Changes the font size. Only appears for certain fields such as text lines, text areas, checkboxes and some custom fills.
- `X`, `Y`, `W`, `H`: adjusts the x-position, y-position, width, and height respectively of the selected field.

## Validation
Validation warns the person submitting the eForm when required fields are empty.

To create a validation group, select one or more fields on the canvas. You may use Ctrl-click or Shift-click, or drag on a blank part of the page, to select multiple fields. Then click `+ New group from selected`. You can set the rule to either `All filled` or `Exactly one`. If the rule is broken when the eForm is submitted, a warning pops up for the user. To remove any field from the group, click the `x` button next to it under `Fields`.

## Check eForm

Checks the eForm for problems such as duplicate names, fields that look like they need a tag, fields off the page, and pages with no image.

## Export

Click `Export OSCAR eForm (.zip)` to get the final .zip file, which can be imported into OSCAR.

## Saving your work

Use `Save Session`, located on the right sidebar, to keep your work. Use `Load Session` to resume.

## Importing a pre-existing eForm

Open `eForm HTML import` on the right sidebar, click `Import eForm HTML` and select the eForm's .html file. Then click `Add fields/tags from HTML` to add its fields to the canvas. Use it on pages without fields (before Auto Detect, say), or you'll get two sets.

Note: It imports the eForm's fields, tags and scripts, but not its images: upload the pages to the canvas first. If any pages are missing from the canvas, those pages' fields will be skipped. e.g. If the eForm .html has 3 pages, but only 2 pages are uploaded to the canvas, only 2 pages will receive fields from the eForm.

The eForm's scripts (fax, print, signature, `onload`) go into your export too, unless you untick `Include extracted scripts / onload in export` in the same panel. `Auto-tag untagged` also uses the eForm's field names and tags to tag your other fields.

# Credits

This eForm generator was built off the one made by Dr. R. Montazeri, the version from Oct 26 2026.

https://oscargalaxy.org/download/oscar-eform-mapper-by-dr-montazeri/