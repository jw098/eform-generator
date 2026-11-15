# OSCAR eForm Test Checklist

Everything an eForm from the eForm Generator should do once it is in OSCAR. Use the feature test
eForm in this folder (`eform_generator_feature_test_4j5w2t_oscar_package.zip`; open
`eform_generator_session_20261115_0424.json` with Load Session to change it; it has three pages),
and open it on a test patient with sex, all three phones, address, health card number, family doctor and referral
doctor filled in.

Tick each box as it passes; note what went wrong under any that fails.

## 1. Install and open

- [ ] Upload the HTML and every page image (`page1.png`, `page2.png` …) in the eForm manager
- [ ] Open the form from a patient's chart, not only from the manager's preview
- [ ] Every page's background image shows (tests the `${oscar_image_path}` link)
- [ ] No JavaScript errors in the browser console when the form opens

## 2. Layout

- [ ] Fields sit on their printed lines and boxes on every page (check page 2 onwards especially)
- [ ] Page 3's fields are in place, including "Foot of the page" at its very bottom
- [ ] Text fits its fields at the default font size: nothing cut off, long words wrap in text areas
- [ ] Controls in the right margin are visible on screen and don't cover the form (phone selector,
      free draw toolbar, signature controls)

## 3. Data OSCAR fills in on a new form (oscarDB tags)

- [ ] Patient: name, birth date, address, postal code, phone, health card number
- [ ] Provider and clinic: `current_user`, `clinic_phone`, `clinic_fax`, `doctor`, `doctor_ohip_no`
- [ ] Referral tags, if used: `referral_fax`, `bc_referral_*`
- [ ] `today` and other date fields are in the expected format (Y-M-D, or the format printed on the form)

## 4. Custom fills

- [ ] Sex tick boxes: M or F is ticked on a new form (try a male, a female and an unknown-sex patient)
- [ ] Phone selector dropdown switches between home, cell and work
- [ ] "2 phones" and "3 phones" fills show the right numbers
- [ ] Current user's last name, first name, and first + last name
- [ ] Today's date in D-M-Y and in Y-M-D
- [ ] Static custom text shows as typed

## 5. Field types

- [ ] Text lines and text areas take typing; Tab order is sensible
- [ ] Date fields: the calendar opens and fills the date in the right format
- [ ] Tick boxes tick and untick on click
- [ ] Circle toggles draw and remove the circle on click
- [ ] Free draw: pens, Undo and Clear work; the drawing is kept after saving
- [ ] Font size buttons (▲▼) on text areas change the size; it is kept after saving

## 6. Signature

- [ ] Stamp mode shows the provider's signature image
- [ ] Stamp is hidden for a provider with no signature image
- [ ] The signature on page 3 works as well as those on page 2
- [ ] Draw mode: signing by hand works
- [ ] Electronic mode shows "Electronically signed"
- [ ] Chosen mode and drawn signature are kept after saving and reopening

### Two signatures on the same page

The feature test eForm has two on page 2: "Provider signature" and "Second signature".

- [ ] On a new form, both show the stamp (the provider's signature image)
- [ ] Each has its own Stamp, Draw and Electronic controls, next to it
- [ ] Changing one's mode leaves the other's as it was (first on Draw, second on Electronic)
- [ ] Drawing in one doesn't appear in the other, and Clear clears only its own
- [ ] Submit with them in different modes (one drawn, one stamped), then reopen: each comes back in its own mode, with its own drawing
- [ ] Both print, each in its own mode, and neither's controls print

## 7. Rules between fields

- [ ] "Exactly one" groups: ticking one box clears the others
- [ ] "All filled" groups: submitting with a field empty shows the message and blocks the submit
- [ ] The popup's "submit anyway" still submits
- [ ] Fields shown by a parent tick box appear and hide correctly (n/a for the feature test eForm:
      the generator can't add these; they come only from an imported eForm's scripts)

## 8. Save and reopen

- [ ] Submit, then reopen from the eChart: text, ticks, circles, drawings, signature and font sizes are all kept
- [ ] A reopened form does not fill itself in again (change the phone or untick the sex box, save
      and reopen: your change stays)
- [ ] Edit a saved form and save again: a new version, with the old one in the history
- [ ] Leaving a changed form without saving asks first
- [ ] After submitting, leaving doesn't ask

## 9. Print

- [ ] One printed page per form page: right page breaks, no blank pages at the end
- [ ] Three pages print as three, with page 3's "Foot of the page" line on page 3, not pushed onto a fourth
- [ ] Print scaling is right on Letter (or A4) paper
- [ ] None of the on-screen controls print (buttons, toolbars, signature controls, font buttons, phone selector)
- [ ] Ticks, circles, drawings and the signature do print

## 10. Fax

- [ ] "Fax & Submit" fills the fax number from the fax field, falling back to the clinic's or referral's fax
- [ ] The fax goes out (or the fax pop-up opens), then the form is submitted
- [ ] With no fax set up in OSCAR, the message says so and nothing breaks

## 11. Other

- [ ] Re-import the exported eForm or OSCAR package `.zip` into the generator: fields, tags,
      validation groups and signatures come back
- [ ] Works in each browser the clinic uses: Chrome, Edge, Firefox
- [ ] Attaching the eForm to a consultation request, or other clinic workflows, works
