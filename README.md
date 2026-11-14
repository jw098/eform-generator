# eform Generator - How to use

## Quick start

To quickly generate an eform, just do the following steps:
- Load the images: Under PDF->PNG converter, browse and select your PDF file. Click `Load into Mapper`. The image should show up in the canvas.
- For each page in the canvas, click `Auto Detect (Current Page)`. Click the `Edit Page 1`, `Edit Page 2`, etc. button to change pages.
- Click `Check eForm` to ensure there are no major issues with the eform.
- Click `Export OSCAR eform (.zip)` to get the final .zip file, which can be imported into OSCAR.

## Upload images

There are 2 different approaches:

- PDF -> PNG converter: Upload the PDF file. Then click `Load into Mapper` (purple button).
- Upload images manually: Click `Upload Page 1 image`, then select the desired image. For a multi-page eform, click `+ Add Page`, then click `Upload Page 2 image`, then select your desired page 2 image. Repeat this process for all necessary pages.

If done correctly, your desired image should show up on the canvas. For multi-page eforms, click the `Edit Page X` to move between different pages.

## Auto Detect

We now need to detect the location of the fields/input boxes. For each page, click `Auto Detect (Current Page)` (purple button).

The eform generator should automatically add boxes for all input fields. Using OCR, the script will also try to guess an appropriate name for the field, and more importantly, guess an oscardb tag.

The oscardb tag attached to each field will show up on the canvas.

## Manually adding fields
Above the canvas, and below the `Auto Detect (Current Page)` button, there are buttons to add input fields.

- `Add Text Line`: Adds a single line text field to the top left corner.
- `Add Text Area`: Adds a multi-line text field to the top left corner.
- `Place Checkbox`: Places a checkbox wherever you click the cursor.
- `Checkbox px`: The size of checkboxes when you click with `Place Checkbox` active.
- `Add Date`: Adds a single line text field to the top left corner, with a calendar selector.

More buttons that add fields:
- `Add Circle`: Adds a circle to the top left corner. In the actual eform, clicking will toggle on/off a circle.
- `Free draw`: Adds a free draw box to the top left corner. The associated `Undo, Clear` controls can be moved separately from the free draw box; they can even be moved off the canvas to the right side bar.
- `Add signature`: Adds a signature box to the bottom right corner. The associated `Stamp, Draw, Electronic, Clear` controls can be moved separately from the signature box; they can even be moved off the canvas to the right side bar.

## Adjusting position of fields
All fields can be moved and resized, as well as copy/pasted. 

Keyboard shortcuts do work. When a field is selected: 
- Arrow keys: nudge the field 1 pixel
- Shift+Arrow keys: nudge the field 10 px
- Ctrl/Cmd+C: copy
- Ctrl/Cmd+V: paste to top left corner.
- Delete: delete the field

If you click a specific input field, on the right sidebar will be a section for `Selected field`.

## Editing input fields: oscardb, name, size, location

As mentioned above, if you click a specific input field, on the right sidebar will be a section for `Selected field`.

- `Name`: The name of the field. Does not affect directly function of the eform, but is used by the `Guess tag` button (see below).
- `Fill with`: Dropdown that toggles between `OSCAR tag` and `Custom text/action`
    - `OSCAR tag`: oscardb tag, which then automatically pulls in its associated value when the eform is loaded on OSCAR. Shows up as green text on the canvas. You may choose the tag from the dropdown list, or manually type in the oscardb tag. If you manually input an oscardb tag that isn't in the standard OSCAR 12 tags, you will see a warning.
    - `Custom text/action`: These are an alternative to oscardb tags, particularly where the text or action you want isn't offered directly by the oscardb tag. e.g. checking a box based on gender, display two phone numbers, current user's first name or last name only, etc. These show up as purple text on the canvas. 
- `Guess tag`: Guesses an oscardb tag based on the selected field's name.
- `Font size`: Changes the font size
- `X`, `Y`, `W`, `H`: adjusts the x-position, y-position, width, and height respectively of the selected field.

## Validation
eform validation allows it so that when the end-user submits an eform, the user gets a pop-up that certain fields are empty.

To create a validation group, select one or more fields on the canvas. You may use Ctrl-click or Shift-click or drag-click to select multiple fields. Then click `+ New group from selected`. You can set the rule to either `All filled` or `Exactly one`. If the rule is broken when the eform is submitted, a warning pops up for the user. To remove any field from the group, click the `x` button next to it under `Fields`.

## Check eform

Checks the eForm for problems such as duplicate names, untagged fields, fields off the page, and pages with no image.

## Export

Click `Export OSCAR eform (.zip)` to get the final .zip file, which can be imported into OSCAR.