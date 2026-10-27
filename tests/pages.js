// What is on each test page: the tick boxes and the places to write, and what Auto Detect
// should make of each. This is the file to read or change; tests/auto-detect.js only runs it.
// (tests/README.md explains how the tests work.)
//
// Positions are in pixels on the page image, measured from its top-left corner:
//   x, y           the top-left corner of the box or field
//   width, height  its size (a tick box gives one size, being square)
// Auto Detect must find each one within 6 pixels of where it is listed, and nothing else.
//
// tick(what, x, y, size, printed)
//   A tick box. `printed` is the label printed beside it, which Auto Detect must read (only
//   its letters are compared). `what` names it in the test results; it defaults to `printed`.
// line(what, x, y, width, height, tag)
//   A single-line field to write in. `tag` is the OSCAR tag Auto Detect should give it:
//   '' means no tag (a wrong tag fills the wrong patient data into the form), and a list
//   means any of them will do.
// area(what, x, y, width, height, tag)
//   A field of several lines (a writing area), the same way.
// notYet: places Auto Detect doesn't find yet. They're reported as "todo" rather than as
//   failures, and a field found there doesn't count as a stray. Each is
//   { what, blanks: [{ label, type: 'text' or 'textarea', x1, x2, y1, y2 }] } (a found field
//   counts once it lies inside the blank and spans most of it). Once Auto Detect finds one,
//   move it into lines or areas with its exact position.
//
// To add a page: put its image in tests/fixtures as a PNG, make the matching .js beside it
// (the top of any fixture .js says how), and add an entry below.
(() => {
  const tick = (what, x, y, size, printed = what) => ({ label: what, x, y, width: size, height: size, printed });
  const line = (what, x, y, width, height, tag) => ({ label: what, x, y, width, height, tag });
  const area = line;

  window.TEST_PAGES = [
    {
      // Two tables side by side (patient, referring doctor), rows of tick boxes, two note boxes
      name: 'Referral form',
      image: 'referral-form-page1',
      tickBoxes: [
        tick('Referral to: Dr. (left 1)',  103, 352, 19, 'Dr.'),
        tick('Referral to: Dr. (left 2)',  103, 377, 19, 'Dr.'),
        tick('Referral to: Dr. (left 3)',  103, 403, 19, 'Dr.'),
        tick('Referral to: Dr. (right 1)', 763, 352, 19, 'Dr.'),
        tick('Referral to: Dr. (right 2)', 763, 377, 19, 'Dr.'),
        tick('Referral to: Dr. (right 3)', 763, 403, 19, 'Dr.'),
        tick('Referral to: Other',         763, 433, 19, 'Other'),
        tick('Consent: Yes, text',        1057, 755, 19, 'Yes, text'),
        tick('Consent: Yes, email',       1191, 755, 19, 'Yes, email'),
        tick('Consent: No',               1338, 755, 19, 'No'),
        tick('Urgency: Urgent',            103, 854, 19, 'Urgent'),
        tick('Urgency: Semi-Urgent',       345, 854, 19, 'Semi-Urgent'),
        tick('Urgency: Routine',           641, 854, 19, 'Routine'),
        tick('Type: New Referral',         768, 854, 19, 'New Referral'),
        tick('Type: Follow-up',           1109, 854, 19, 'Follow-up'),
        tick('Type: Re-referral',          768, 884, 19, 'Re-referral'),
        tick('Type: Revised Referral',    1109, 884, 19, 'Revised Referral'),
        tick('Type: EPCP Completed',       768, 917, 19, 'Enhanced Primary Care Pathways (EPCP) Completed'),
      ],
      lines: [
        line('Referral to: Other ____',        860, 420, 533, 28, ''),
        line('Patient: Last Name',             268, 505, 469, 16, 'patient_nameL'),
        line('Patient: First Name',            268, 531, 469, 16, 'patient_nameF'),
        line('Patient: Date of Birth',         268, 558, 469, 16, ['dobc2', 'dob']),
        line('Patient: PHN #',                 268, 585, 469, 16, 'hin'),
        line('Patient: Address',               268, 611, 469, 47, ['addressline', 'address']),
        line('Patient: Home Phone',            268, 668, 469, 17, 'phone'),
        line('Patient: Cell Phone',            268, 696, 469, 16, 'cell'),
        line('Patient: Email',                 268, 722, 469, 17, 'email'),
        // The referring doctor's own name: no tag, so the patient's name doesn't land here
        line('Referring MD: Last Name',        927, 505, 474, 16, ''),
        line('Referring MD: First Name',       927, 531, 474, 16, ''),
        line('Referring MD: MSP #',            927, 558, 474, 16, 'current_user_ohip_no'),
        line('Referring MD: Clinic Name',      927, 585, 474, 16, 'clinic_name'),
        line('Referring MD: Address',          927, 611, 474, 47, 'clinic_addressLine'),
        line('Referring MD: Clinic Phone',     927, 668, 474, 17, 'clinic_phone'),
        line('Referring MD: Clinic Fax',       927, 696, 474, 16, 'clinic_fax'),
        line('Referring MD: Family MD',        927, 722, 474, 17, ''),
      ],
      areas: [
        area('Past Hx',                         93, 1098, 1308, 279, ''),
        area('Medications/Allergies',           93, 1413, 1308, 362, ''),
      ],
      notYet: [],
    },
    {
      // Fill-in lines with one, two or three labels on each, two tick boxes, and two open
      // writing areas under headings. Each line's field sits above the line (higher on the top
      // line, which has blank page above it).
      name: 'X-ray requisition',
      image: 'xray-requisition',
      tickBoxes: [
        tick('Male',   1101, 780, 25),
        tick('Female', 1271, 780, 25),
      ],
      lines: [
        line('Dr',                           113, 448,  548, 51, 'current_user'),
        line('Billing #',                    791, 448,  297, 51, 'current_user_ohip_no'),
        line('Date',                        1175, 448,  213, 51, 'today'),
        line('Clinic',                       152, 510, 1236, 39, 'clinic_name'),
        line('Additional copy to',           289, 562, 1099, 39, ''),
        line('Patient Name: Last',           302, 613,  360, 39, 'patient_nameL'),
        line('Patient Name: First',          749, 613,  639, 39, 'patient_nameF'),
        line('Address',                      176, 663,  912, 39, ['address', 'addressline']),
        line('Postal Code',                 1254, 663,  134, 39, 'postal'),
        line('Phone',                        158, 715, 1230, 39, 'phone'),
        line('Date of Birth',                337, 766,  750, 39, ['dobc2', 'dob']),
        line('Personal Health Number',       526, 816,  862, 39, 'hin'),
        line('Appointment: Date',            404, 868,  258, 29, ''),
        line('Appointment: Time',            752, 868,  636, 29, ''),
        line('Doctor stamp / Clinic stamp line', 69, 1327, 1319, 49, ''),
      ],
      areas: [
        area('X-ray examination requested',   65, 973, 1327, 152, ''),
        area('History and clinical findings', 65, 1176, 1327, 146, ''),
      ],
      notYet: [],
    },
    {
      // A form printed in capitals, each label in the top corner of its own box; several labels
      // sharing a box (SURNAME | FIRST NAME, ADDRESS | CITY/TOWN | POSTAL CODE); a tall box
      // beside several rows; and many rows of tick boxes
      name: 'Mammography requisition',
      image: 'mammography-requisition',
      tickBoxes: [
        tick('Billable to: MSP',       64, 318, 24, 'MSP'),
        tick('Billable to: ICBC',     160, 318, 24, 'ICBC'),
        tick('Billable to: WCB',      263, 318, 24, 'WCB'),
        tick('Billable to: PATIENT',  359, 318, 22, 'PATIENT'),
        tick('Billable to: OTHER',    477, 318, 22, 'OTHER'),
        tick('Gender: M',             603, 495, 22, 'M'),
        tick('Gender: F',             668, 495, 24, 'F'),
        tick('Pregnant: Yes',         747, 495, 22, 'Yes'),
        tick('Pregnant: No',          827, 495, 24, 'No'),
        tick('DIAGNOSTIC MAMMOGRAPHY', 442, 603, 24),
        tick('ULTRASOUND',            853, 603, 24),
        tick('Proceed to further imaging', 514, 647, 22, 'Proceed to further imaging if indicated (mammography or ultrasound)'),
        tick('Proceed to needle biopsy',   513, 679, 24, 'Proceed to needle biopsy if indicated and feasible'),
        tick('Call me',                    513, 713, 24, 'Call me if further investigation is necessary'),
        tick('Previous mammograms: YES',        101, 804, 24, 'YES'),
        tick('Previous mammograms: NO',         195, 804, 24, 'NO'),
        tick('Previous biopsies/surgery: YES',  101, 863, 24, 'YES'),
        tick('Previous biopsies/surgery: NO',   195, 863, 24, 'NO'),
        tick('Hormone therapy: YES',            102, 922, 22, 'YES'),
        tick('Hormone therapy: NO',             195, 922, 24, 'NO'),
        tick('Family history: YES',             101, 980, 24, 'YES'),
        tick('Family history: NO',              195, 980, 24, 'NO'),
        tick('LUMP',                            101, 1127, 24),
        tick('THICKENING',                      452, 1127, 24),
        tick('LOCALIZED PAIN/TENDERNESS',       791, 1127, 24),
        tick('NIPPLE DISCHARGE',               1086, 1127, 24),
        tick('"ABNORMAL" SCREENING MAMMOGRAM',  101, 1163, 22),
        tick('FOLLOW UP OF PREVIOUS FINDINGS',  452, 1163, 24),
        tick('PREVIOUS BREAST CANCER',          791, 1163, 24),
        tick('BREAST PROSTHESES (IMPLANTS)',   1086, 1163, 22),
        tick('UNKNOWN PRIMARY MALIGNANCY',      101, 1199, 24),
        tick('FIRST POST-OPERATIVE MAMMOGRAPHY', 452, 1199, 24),
        tick('OTHER, SPECIFY',                  101, 1262, 24),
      ],
      lines: [
        line('Billable to: OTHER: ____',       576,  312,  314, 33, ''),
        line('PERSONAL HEALTH NUMBER',          63,  370,  503, 33, 'hin'),
        line('DOB: YYYY / MM / DD',            579,  370,  312, 33, ['dobc2', 'dob']),
        line('SURNAME OF PATIENT',              63,  429,  422, 33, 'patient_nameL'),
        line('FIRST NAME AND MIDDLE INITIAL',  485,  429,  405, 33, 'patient_nameF'),
        line('TELEPHONE # (INCLUDE AREA CODE)', 63,  488,  503, 33, 'phone'),
        line('ADDRESS',                         63,  546,  374, 33, ['address', 'addressline']),
        line('CITY/TOWN',                      438,  546,  310, 33, 'city'),
        line('POSTAL CODE',                    747,  546,  143, 33, 'postal'),
        line('COPY RESULTS TO',                903,  546,  530, 33, ''),
        line('Previous mammograms: DATE(S)',   354,  797, 1078, 34, ''),
        line('Previous biopsies: DATE(S)',     354,  856, 1078, 34, ''),
        line('Hormone therapy: DATE(S)',       354,  916, 1078, 33, ''),
        line('Family history: RELATIONSHIP',   354,  974, 1078, 34, ''),
        line('LMP (DATE)',                     201, 1032,  695, 34, ''),
        line('MENOPAUSE (AGE)',               1068, 1032,  365, 34, ''),
        line('OTHER, SPECIFY: ____',           271, 1248, 1162, 47, ''),
        line('TELEPHONE REQUISITION TIME',      64, 1741,  228, 49, ''),
        line('INITIALS OF RECORDER',           304, 1741,  195, 49, ''),
        line('DATE SIGNED (YYYY / MM / DD)',   512, 1742,  511, 47, 'today'),
        // Not really places to write, found all the same (harmless: no label, no tag)
        line('(beside the PRESENT COMPLAINT heading)', 750, 1080, 689, 28, ''),
        line('(above the line the bottom boxes start on)', 61, 1666, 952, 50, ''),
      ],
      areas: [
        area('X-RAY FACILITY ADDRESS',          63,  181,  986, 106, ''),
        area('X-RAY USE ONLY',                1061,  181,  371, 106, ''),
        area('NAME OF PHYSICIAN & MSP PRACTITIONER NUMBER', 903, 318, 530, 203, ['current_user_ohip_no', 'current_user']),
        area('PLEASE MARK AREA(S) OF CONCERN',  56, 1351, 1387, 295, ''),
        area('SIGNATURE OF REQUESTING PHYSICIAN', 1035, 1685, 397, 103, ''),
      ],
      notYet: [],
    },
  ];
})();
