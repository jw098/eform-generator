# eform Generator - How to use

Turns a PDF form into an OSCAR eForm.

## Quick start

To quickly generate an eform, just do the following steps:
- Download `eForm_Generator_FreeScribe_offline.html` and open it in a browser; it runs offline.
- Load the images: Under PDF->PNG converter, browse and select your PDF file. Click `Load into Mapper`. The image should show up in the canvas.
- For each page in the canvas, click `Auto Detect (Current Page)`. Click the `Page 1`, `Page 2`, etc. tabs to change pages.
- Click `Check eForm` to ensure there are no major issues with the eform.
- Click `Export OSCAR eform (.zip)` to get the final .zip file, which can be imported into OSCAR.

## Upload images

There are 2 different approaches:

- PDF -> PNG converter: Upload the PDF file. Then click `Load into Mapper` (purple button).
- Upload images manually: Click `Upload Page 1 Image`, then select the desired image. For a multi-page eform, click `+ Add Page`, which asks for the new page's image straight away. Repeat for all necessary pages. To change a page's image, open its tab and click `Replace Page N Image`; a new image the same shape as the old one keeps the page's fields in place.

If done correctly, your desired image should show up on the canvas. For multi-page eforms, click the `Page N` tabs to move between pages.

## Auto Detect

We now need to detect the location of the fields/input boxes. For each page, click `Auto Detect (Current Page)` (purple button).

The eform generator should automatically add boxes for all input fields. Using OCR, the script will also try to guess an appropriate name for the field, and more importantly, guess an oscardb tag.

## Manually adding fields
Above the canvas, and below the `Auto Detect (Current Page)` button, there are buttons to add input fields.

- `Add Text Line`: Adds a single line text field to the top left corner.
- `Add Text Area`: Adds a multi-line text field to the top left corner, accompanying ▲▼ font size buttons.
- `Place Checkbox`: Places a checkbox where you click, sized by `Checkbox px`.
- `Add Date`: Adds a single line text field to the top left corner, with a calendar selector.

Revealed by the `More` button:
- `Add circle`: Adds a circle to the top left corner. In the actual eform, clicking will toggle on/off a circle.
- `Free draw`: Adds a free draw box to the top left corner. The associated `Undo, Clear` controls can be moved separately from the free draw box; they can even be moved off the canvas to the right side bar.
- `Add signature`: Adds a signature box to the bottom right corner. The associated `Stamp, Draw, Electronic, Clear` controls can be moved separately from the signature box; they can even be moved off the canvas to the right side bar.

## Adjusting position of fields
All fields can be moved and resized, as well as copy/pasted. 

Keyboard shortcuts do work. When a field is selected: 
- Arrow keys: nudge the field 1 pixel
- Shift+Arrow keys: nudge the field 10 px
- Ctrl/Cmd+C: copy
- Ctrl/Cmd+V: paste: next to the original on the same page, at the top left corner on another page.
- Ctrl/Cmd+D: duplicate, next to the original.
- Delete: delete the field

## Editing input fields: oscardb, name, size, location

If you click a specific input field, its data will be in the right sidebar under `Selected field`.

- `Name`: The field’s name in the eForm; OSCAR saves its value under it, so ensure you keep names unique. Also used by `Guess tag`.
- `Fill with`: Dropdown that toggles between `OSCAR tag` and `Custom text/action`
    - `OSCAR tag`: oscardb tag, which then automatically pulls in its associated value when the eform is loaded on OSCAR. Shows up as green text on the canvas. You may choose the tag from the dropdown list, or manually type in the oscardb tag. If you manually input an oscardb tag that isn't in the standard OSCAR 12 tags, you will see a warning.
    - `Custom text/action`: These are an alternative to oscardb tags, particularly where the text or action you want isn't offered directly by the oscardb tag. e.g. checking a box based on patient's sex, display two phone numbers, current user's first name or last name only, etc. These show up as purple text on the canvas. 
- `Guess tag`: Guesses an oscardb tag based on the selected field's name.
- `Font size`: Changes the font size. Only appears for certain fields such as text lines, text areas, checkboxes and some custom fills.
- `X`, `Y`, `W`, `H`: adjusts the x-position, y-position, width, and height respectively of the selected field.

## Validation
eform validation allows it so that when the end-user submits an eform, the user gets a pop-up that certain fields are empty.

To create a validation group, select one or more fields on the canvas. You may use Ctrl-click or Shift-click or drag-click to select multiple fields. Then click `+ New group from selected`. You can set the rule to either `All filled` or `Exactly one`. If the rule is broken when the eform is submitted, a warning pops up for the user. To remove any field from the group, click the `x` button next to it under `Fields`.

## Check eform

Checks the eForm for problems such as duplicate names, untagged fields, fields off the page, and pages with no image.

## Export

Click `Export OSCAR eform (.zip)` to get the final .zip file, which can be imported into OSCAR.