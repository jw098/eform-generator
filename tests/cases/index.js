// The Auto Detect test cases. Each is a folder here holding a finished eForm: its HTML and its
// page image(s), as the app's OSCAR package has them (unzip the package into the folder); or
// the session it was made in, as Save Session saves it (its pages and fields, which the tests
// export as the app does).
//   name    what the test results call it
//   folder  its folder in tests/cases
//   eform   the eForm's HTML file, in that folder
//   images  its page images, in that folder
//   session (in place of eform and images) the session's .json file, in that folder
//   pdf     (optional) the fillable PDF the page images were made from (by the app's PDF
//           converter, its pages in order), in that folder: Auto Detect is given it as the
//           converter gives it, and takes the PDF's own form fields (no variations: a copy of a
//           page is a picture only)
//   todo    (optional) its tests it doesn't pass yet, shown as "to do" rather than failures, by
//           key: ticks, fields, extraTicks, extraFields, tags (see tests/README.md)
//   skip    (optional) boxes to leave out of a test, where it can't apply: a list of
//           { test, page, region: [x, y, width, height], reason }. The test is one of the keys
//           above; boxes whose centre is in the region (page-image pixels) on that page are
//           left out of it. Without a page, every page; without a region, the whole page.
//   variations (optional) true: its pages are also tested, tick boxes and fields, in copies
//           as a clean PDF can come (rendered at another size, printed faint) when asked
//   variationSkip (optional) tick boxes to leave out of a variation's "each expected tick box
//           is found", where the variation leaves too little of them: a list of { variation,
//           boxes, reason }, the variation by its name in the panel and the boxes by their
//           names in the eForm; or a region to leave out of one of its tests: { variation,
//           test, page, region: [x, y, width, height], reason }, in the page's own pixels, the
//           test extraTicks (without one), fields or extraFields (see tests/README.md). The
//           case's own skips and to-dos for fields hold on its variations too.
//   variationTodo (optional) a variation's tests it doesn't pass yet, shown as "to do": a list
//           of { variation, page, test, reason }, the test ticks, extraTicks, fields or
//           extraFields; without a page, every page
window.TEST_CASE_LIST = [
  {
    "name": "eForm Generator feature test, page 1",
    "folder": "feature-test",
    "session": "feature_test_page1_session.json",
    "variations": true
  },
  {
    "name": "Referral form",
    "folder": "referral-form",
    "eform": "referral_form_3c1x42.html",
    "images": [
      "referral_form_3c1x42_page1.png"
    ],
    "variations": true
  },
  {
    "name": "X-ray requisition",
    "folder": "x-ray-requisition",
    "eform": "x_ray_requisition_5m1u0o.html",
    "images": [
      "x_ray_requisition_5m1u0o_page1.png"
    ]
  },
  {
    "name": "Mammography requisition",
    "folder": "mammography-requisition",
    "eform": "mammography_requisition_42630x.html",
    "images": [
      "mammography_requisition_42630x_page1.png"
    ],
    "variations": true,
    "skip": [
      {
        "test": "extraFields",
        "page": 1,
        "region": [50, 1656, 980, 74],
        "reason": "the ruled row left of SIGNATURE OF REQUESTING PHYSICIAN, between the box above and the TELEPHONE REQUISITION TIME row: an empty row with no words in it or beside it, which the eForm leaves out. Its ink is a table row's with nothing printed in it, as a box left blank to write in is (a big box with its label printed outside it), so no check can take it out without taking those"
      }
    ]
  },
  {
    "name": "Reproductive Mental Health referral",
    "folder": "reproductive-mental-health",
    "eform": "Reproductive_Mental_Health_2017_v2.html",
    "images": [
      "RMH_referral_form-1.png",
      "RMH_referral_form-2.png"
    ],
    "skip": [
      {
        "test": "ticks",
        "page": 2,
        "region": [0, 170, 1500, 900],
        "reason": "no printed tick boxes here (the eForm puts its tick boxes beside the words), so there are none to find"
      },
      {
        "test": "tags",
        "page": 2,
        "region": [1000, 330, 480, 70],
        "reason": "Due Date's m$EDC#value is a measurement tag, which Auto Detect leaves to you"
      }
    ]
  },
  {
    "name": "Reproductive Mental Health referral (St. Paul's)",
    "folder": "sph-reproductive-mental-health",
    "eform": "SPH_RMH.html",
    "images": [
      "RMH_1.png",
      "RMH_2.png"
    ],
    "variations": true,
    "variationSkip": [
      {
        "variation": "0.7× size",
        "page": 2,
        "region": [625, 1655, 35, 35],
        "reason": "the bold D of \"DETAILS\" in a heading: at 0.7× (about 123 dpi) its straight stem, flat top and bottom, filled corners and empty inside are a tick box's, and only the line of capitals it is in says it is a letter"
      },
      {
        "variation": "0.7× size",
        "test": "extraFields",
        "page": 2,
        "region": [740, 1645, 620, 50],
        "reason": "the blank beside RELEVANT MEDICAL HISTORY / ADDITIONAL DETAILS:, from the bold D of DETAILS taken for a tick box (the skip above): the box splits the label, so it no longer starts where the writing area under it does, and isn't taken for that area's heading"
      }
    ],
    "skip": [
      {
        "test": "extraFields",
        "page": 1,
        "region": [140, 15, 1310, 495],
        "reason": "the blank top of the page over the FOR OFFICE USE ONLY box, under a grey mark 2 px wide and 8 tall at the page's top edge (x 839, y 0 to 7), which reads as a label with open page under it"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [148, 515, 1292, 172],
        "reason": "the box FOR OFFICE USE ONLY, which the eForm leaves out"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [880, 1015, 560, 70],
        "reason": "(Cell) is tagged phone: the eForm's script fills it with the second-choice phone"
      },
      {
        "test": "extraFields",
        "page": 2,
        "region": [745, 540, 590, 50],
        "reason": "the room left under \"Fax completed form to the clinic then follow-up with a phone call outlining the urgency.\" at the foot of the URGENT REFERRAL box, which the eForm leaves out: in ink the same as a box's room to write under its label"
      }
    ]
  },
  {
    "name": "Diabetes Health Centre referral (St. Paul's)",
    "folder": "sph-diabetes-health-centre",
    "eform": "SPH_Diabetes_health_centre.html",
    "images": [
      "SPH_Diabetes_health_centre_1.png"
    ],
    "skip": [
      {
        "test": "extraFields",
        "page": 1,
        "region": [810, 775, 330, 60],
        "reason": "the Signature line: the eForm puts a signature image there"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [1140, 820, 320, 60],
        "reason": "the lower half of the MSP No box, beside Fax number: under MSP No's fill-in line and over the box's bottom line, joined by the box's sides, so a row in ink; the eForm leaves it empty"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [550, 1235, 900, 50],
        "reason": "the line beside Additional medications/dose: the eForm's text area starts on the line below"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [530, 1055, 920, 50],
        "reason": "the line beside Diabetes medications/dose: the eForm's text area starts on the line below"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [350, 1610, 1110, 60],
        "reason": "the blanks after FAX # and please call, in the LAB WORK box: the centre's own numbers"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [150, 1090, 1310, 360],
        "reason": "the medications text areas, which the eForm leaves untagged"
      }
    ]
  },
  {
    "name": "Medical imaging requisition (VCH)",
    "folder": "vch-medical-imaging",
    "eform": "VCH_Medical_Imaging_layout.html",
    "images": [
      "VCH_Medical_Imaging_2010_Pg1.png"
    ],
    "skip": [
      {
        "test": "fields",
        "page": 1,
        "region": [100, 462, 200, 58],
        "reason": "LMP, G, P, A, Height, Weight: blanks after labels with no colon, and no lines"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [460, 150, 380, 80],
        "reason": "the box printed \"PLACE MEDICAL IMAGING LABEL HERE\", for a sticker, which the eForm leaves out: its words are grey and inside the box, read as the label over a blank"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [440, 330, 330, 32],
        "reason": "the blank after the note \"Physician should consult with Radiologist for Urgent and Stat cases\", left of the Priority options (Routine, Urgent, Stat), which the eForm leaves out: a ruled blank after words on its row, as a field after its label is"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [95, 880, 745, 200],
        "reason": "DEPARTMENT USE: filled in by the imaging department"
      }
    ]
  },
  {
    "name": "ICBC GP Standard Medical Report (CL489)",
    "folder": "icbc-cl489",
    "eform": "CL489.html",
    "images": [
      "CL489_Pg1.png",
      "CL489_Pg2.png",
      "CL489_Pg3.png"
    ],
    "variations": true,
    "variationSkip": [
      {
        "variation": "0.7× size",
        "boxes": [
          "Fulltime_Yes",
          "Fulltime_No",
          "Self_employed",
          "Seasonal",
          "Training_Apprentice",
          "Student",
          "Retired",
          "Not_employed",
          "Absent_WorkFull",
          "Absent_WorkModified",
          "Absent_TrainFull",
          "Absent_TrainModified",
          "Absent_SchoolFull",
          "Absent_SchoolModified",
          "Duties_WorkFull",
          "Duties_SchoolFull",
          "Hours_WorkFull",
          "Hours_WorkModified",
          "Hours_TrainFull",
          "Hours_TrainModified",
          "Hours_SchoolFull",
          "Hours_SchoolModified"
        ],
        "reason": "at 0.7× the page is about 70 dpi, below a PDF render (about 176), and each of these boxes sits a pixel or two over its row's line with its label right beside it (\"☐Full time\", \"☐Yes ☐No\" in the work status table): in those pixels the same as a letter on a line (the D of \"Family MD\" on the referral form), so finding them would bring letters back"
      },
      {
        "variation": "0.7× size",
        "boxes": [
          "Orientation2_Left",
          "Orientation4_Left"
        ],
        "reason": "at 0.7× the page is about 70 dpi, below a PDF render (about 176), and each of these boxes sits a pixel or two over its row's line with its label right beside it (\"☐Left\" under ORIENTATION): in those pixels the same as a letter on a line (the D of \"Family MD\" on the referral form), so finding them would bring letters back"
      },
      {
        "variation": "0.7× size",
        "test": "fields",
        "page": 1,
        "region": [225, 195, 410, 40],
        "reason": "at 0.7× the page is about 70 dpi (it is 850 px wide), far below a PDF render (the app's is 1500 px wide), and the DATE OF ACCIDENT and DATE OF GP REPORT cells leave just under the room asked for a field under a label (y2 - lowInk >= line*0.6 in textFieldsFromLines, line guessed from the page's height; at 1× the DIAGNOSIS cells pass it by 0.04 px). Tried: measuring that room against the page's text (rowLine), which changes fields on four other forms"
      },
      {
        "variation": "0.7× size",
        "test": "extraFields",
        "page": 1,
        "region": [225, 195, 410, 40],
        "reason": "the small blank beside DATE OF ACCIDENT's label that the cell gets instead of its field (see the fields skip here)"
      },
      {
        "variation": "0.7× size",
        "test": "extraFields",
        "page": 1,
        "region": [640, 1025, 130, 50],
        "reason": "at 0.7× the page is about 70 dpi (it is 850 px wide), far below a PDF render (the app's is 1500 px wide): the footer \"GP Standard Medical Report\": at 70 dpi the bottoms of its letters run together into what reads as a fill-in line"
      },
      {
        "variation": "0.7× size",
        "test": "fields",
        "page": 2,
        "region": [35, 358, 575, 70],
        "reason": "at 0.7× the page is about 70 dpi (it is 850 px wide), far below a PDF render (the app's is 1500 px wide), and the first two DIAGNOSIS rows under OTHER DIAGNOSIS leave just under the room asked for a field under a label (y2 - lowInk >= line*0.6 in textFieldsFromLines, line guessed from the page's height; at 1× the DIAGNOSIS cells pass it by 0.04 px). Tried: measuring that room against the page's text (rowLine), which changes fields on four other forms. Without a field under its neighbours' labels, the DEGREE/GRADE cell has none either, and the blank beside DIAGNOSIS, its cell's one label with no colon, is no field"
      },
      {
        "variation": "faint print",
        "test": "extraFields",
        "page": 1,
        "region": [536, 398, 280, 26],
        "reason": "the PRACTITIONER INFORMATION heading row, right of the MSP/PRACTITIONER NUMBER column: the hairline under the row is light grey (about 150 of 255), which faint print takes to about 224, and only its part from that column's divider on still reads as a line, so that part makes a row of its own, with no label in it, under the table's top rule"
      },
      {
        "variation": "0.7× size",
        "test": "extraFields",
        "page": 2,
        "region": [640, 1035, 130, 40],
        "reason": "at 0.7× the page is about 70 dpi (it is 850 px wide), far below a PDF render (the app's is 1500 px wide): the footer \"GP Standard Medical Report\": at 70 dpi the bottoms of its letters run together into what reads as a fill-in line"
      }
    ],
    "skip": [
      {
        "test": "tags",
        "page": 1,
        "region": [35, 195, 780, 70],
        "reason": "the invoice fields' e$last#... references (the last value saved) and the payee name the eForm's script fills: no standard tags to expect"
      },
      {
        "test": "fields",
        "page": 1,
        "region": [35, 260, 785, 65],
        "reason": "the eForm takes both PAYEE ADDRESS rows as one field; Auto Detect's one field per row is as good"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [35, 260, 785, 65],
        "reason": "the eForm takes both PAYEE ADDRESS rows as one field; Auto Detect's one field per row is as good"
      },
      {
        "test": "fields",
        "page": 1,
        "region": [35, 425, 505, 30],
        "reason": "the eForm takes the practitioner's FIRST NAME and LAST NAME cells as one field, which its script fills"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [35, 425, 505, 30],
        "reason": "the eForm takes the practitioner's FIRST NAME and LAST NAME cells as one field, which its script fills"
      },
      {
        "test": "fields",
        "page": 2,
        "region": [35, 1018, 780, 32],
        "reason": "the eForm splits the one ANTICIPATED DATE OF FULL RECOVERY blank into a date and a note"
      },
      {
        "test": "extraFields",
        "page": 2,
        "region": [35, 1018, 780, 32],
        "reason": "the eForm splits the one ANTICIPATED DATE OF FULL RECOVERY blank into a date and a note"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [493, 922, 328, 27],
        "reason": "the blank after a row of options (School/Studies: Yes No): the eForm leaves it out, though it has a field after options laid out the same way (RegularMD_comment, AddRx_comment)"
      },
      {
        "test": "extraFields",
        "page": 2,
        "region": [258, 800, 559, 28],
        "reason": "the blank after a row of options (Yes No Unable to determine): the eForm leaves it out, though it has a field after options laid out the same way (RegularMD_comment, AddRx_comment)"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [530, 970, 290, 60],
        "reason": "the blanks after the rows of options under STATUS OF DUTIES and STATUS OF HOURS (Study: Full Modified), found at some sizes: the eForm leaves them out, though it has a field after options laid out the same way (RegularMD_comment, AddRx_comment)"
      }
    ]
  },
  {
    "name": "BounceBack referral (fillable PDF)",
    "folder": "bounceback-referral",
    "eform": "bounceback_0s1c1k.html",
    "images": [
      "bounceback_0s1c1k_page1.png",
      "bounceback_0s1c1k_page2.png"
    ],
    "pdf": "BounceBack_Referral_Form_2025.pdf",
    "skip": [
      {
        "test": "tags",
        "page": 1,
        "region": [1030, 796, 368, 44],
        "reason": "name_of_clinic_or_school_2 (Name of clinic/school): the PDF makes this a field of its own, a second or third line of \"Name of clinic/school\"; Auto Detect tags it from the PDF's label, the same as the first line's, where the eForm gives only the first line the tag"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [1030, 868, 368, 44],
        "reason": "referrer_name_2 (Referrer name): the PDF makes this a field of its own, a second or third line of \"Referrer name\"; Auto Detect tags it from the PDF's label, the same as the first line's, where the eForm gives only the first line the tag"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [1030, 1144, 368, 44],
        "reason": "address_2 (Address): the PDF makes this a field of its own, a second or third line of \"Address\"; Auto Detect tags it from the PDF's label, the same as the first line's, where the eForm gives only the first line the tag"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [1030, 1180, 368, 44],
        "reason": "address_3 (Address): the PDF makes this a field of its own, a second or third line of \"Address\"; Auto Detect tags it from the PDF's label, the same as the first line's, where the eForm gives only the first line the tag"
      }
    ]
  },
  {
    "name": "Lab requisition (boxed cells, two people side by side)",
    "folder": "lab-requisition",
    "session": "lab_requisition_session.json",
    "variations": true,
    "skip": [
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          240,
          1020,
          530,
          60
        ],
        "reason": "a signature line: Auto Detect makes no signatures, and its line is the same in ink and words as a fill-in line after a label (\"Practitioner signature: ____\"), so it is found as a text field"
      }
    ]
  },
  {
    "name": "Mood questionnaire (a grid of tick boxes)",
    "folder": "questionnaire",
    "session": "questionnaire_session.json",
    "variations": true,
    "skip": [
      {
        "test": "fields",
        "page": 1,
        "region": [
          55,
          865,
          1035,
          50
        ],
        "reason": "the four answers to circle (\"Not difficult\" ... \"Extremely difficult\", \"(circle one)\"): Auto Detect makes no circle toggles, and words to circle are printed words like any others, with nothing drawn around them"
      }
    ]
  },
  {
    "name": "Physiotherapy referral (lines typed as underscores and dots)",
    "folder": "typed-form",
    "session": "typed_form_session.json",
    "variations": true,
    "variationSkip": [
      {
        "variation": "2.5× size",
        "page": 1,
        "test": "fields",
        "region": [
          575,
          630,
          70,
          55
        ],
        "reason": "the blank after \"Number of visits requested: ......\": at 2.5× OCR reads \"requested\" without its colon, and the dots are shorter than a line pass 1 finds, so nothing makes a field of them (a short line is taken only after a colon: taking one after any word would take short lines and dots that are no blanks)"
      }
    ],
    "skip": [
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          150,
          725,
          340,
          45
        ],
        "reason": "a signature line: Auto Detect makes no signatures, and its line is the same in ink and words as a fill-in line after a label (\"Signature: ____\"), so it is found as a text field"
      }
    ]
  },
  {
    "name": "Special Authority request (boxes for each character, captions under lines)",
    "folder": "character-boxes",
    "session": "character_boxes_session.json",
    "variations": true,
    "skip": [
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          50,
          930,
          560,
          70
        ],
        "reason": "a signature line: Auto Detect makes no signatures, and its line is the same in ink and words as a fill-in line after a label (\"Prescriber signature: ____\"), so it is found as a text field"
      }
    ]
  },
  {
    "name": "Medication review (units after lines, a date in three parts, a table with a tick box column)",
    "folder": "medication-review",
    "session": "medication_review_session.json",
    "variations": true,
    "skip": [
      {"test": "tags", "page": 1, "region": [880, 835, 345, 40], "reason": "\"Pharmacy phone\" is tagged phone: OSCAR 12 has no tags for a pharmacy, and telling its details from the patient's would need an owner made for this form (eForms are rarely a pharmacy's medication review)"},
      {"test": "tags", "page": 1, "region": [165, 1110, 445, 40], "reason": "\"Reviewed by\" gets no current_user: a reviewer is named only on a review form such as this one, and taking \"reviewed by\" for the clinician would be a word added for one form"},
      {"test": "tags", "page": 1, "region": [780, 1110, 230, 40], "reason": "\"Date of review\" gets no today: a review date is often the next or last one (\"Review date\", \"Next review\"), so taking it for the form's own date would be right here and wrong on many forms"},
      {
        "test": "tags",
        "page": 1,
        "region": [
          790,
          145,
          280,
          45
        ],
        "reason": "the date of birth in three parts (\"Date of birth: ____ / ____ / ____\", \"YYYY  MM  DD\" printed under them): dob_year, dob_month and dob_day could be told only from the captions under a row of blanks, by a check made for this one layout, not worth its complexity; the year and month parts are tagged dobc2, the day part nothing"
      }
    ]
  },
  {
    "name": "Home care referral (colour, shaded cells to write in, white headings on dark bars, radio buttons, a dashed box)",
    "folder": "home-care",
    "session": "home_care_session.json",
    "variations": true
  },
  {
    "name": "Fax referral at 100 dpi (a specialist's own form: the referring practitioner's details in a box, tick boxes after their words, small print)",
    "folder": "fax-referral",
    "session": "fax_referral_session.json",
    "variations": true,
    "skip": [
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          100,
          700,
          330,
          50
        ],
        "reason": "a signature line: Auto Detect makes no signatures, and its line is the same in ink and words as a fill-in line after a label (\"Signature: ____\"), so it is found as a text field"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          40,
          560,
          770,
          100
        ],
        "reason": "\"Relevant history and medications\" is tagged druglist_line: the field asks for the patient's medications as well as their history, and the drug list is as good an answer as none"
      }
    ]
  },
  {
    "name": "Wound flow sheet (landscape, a grid with a column for each visit)",
    "folder": "wound-flowsheet",
    "session": "wound_flowsheet_session.json",
    "variations": true,
    "skip": [
      {
        "test": "dates",
        "page": 1,
        "region": [
          390,
          205,
          1210,
          55
        ],
        "reason": "the \"Date\" row's six cells get no label, so nothing says they hold dates: the row heading is far to their left, and while labels are given, the blank rest of the heading's own cell (dropped later as a heading's cell) stands between it and the first cell; the others have the first cell between. Taking row headings across a row would be a feature of its own, and a date field only adds a calendar"
      }
    ]
  },
  {
    "name": "Consent to release information (blanks inside sentences, captions under them)",
    "folder": "consent-release",
    "session": "consent_release_session.json",
    "variations": true,
    "skip": [
      {
        "test": "dates",
        "page": 1,
        "region": [
          261,
          726,
          236,
          44
        ],
        "reason": "\"This consent expires on ____\": a blank inside a sentence is a date only by the words before it (\"on\", \"as of\", \"from\", \"to\", \"until\"), and those words come far more often before blanks that aren't dates (\"Comments on ____\", \"Referred to ____\", \"Transfer from ____\"), so a check that took them would make other forms' blanks date fields"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          55,
          870,
          570,
          65
        ],
        "reason": "a signature line: Auto Detect makes no signatures, and its line is the same in ink as a fill-in line with its caption under it (\"Signature of patient\"), so it is found as a text field"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          55,
          980,
          570,
          65
        ],
        "reason": "a signature line: Auto Detect makes no signatures, and its line is the same in ink as a fill-in line with its caption under it (\"Signature of witness\"), so it is found as a text field"
      }
    ]
  },
  {
    "name": "New-patient health history (dot leaders to tick boxes, typed [ ] and ( ), a table ruled across)",
    "folder": "health-history",
    "session": "health_history_session.json",
    "variations": true,
    "skip": [
      {
        "test": "ticks",
        "page": 1,
        "region": [
          200,
          430,
          410,
          120
        ],
        "reason": "the tick boxes typed as characters (\"[ ] Yes\", \"( ) Never\"): their ink is a bracket pair or a pair of round brackets, the same as \"[1]\" or \"(a)\" in print, so a check that took them would take bracketed letters and numbers too; read as words they would need OCR, which pass 1 can't use"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          140,
          215,
          300,
          125
        ],
        "reason": "the dot leaders from each condition out to its tick boxes (\"High blood pressure ........ ☐ Yes ☐ No\"): a dotted line after words is drawn in as the line it stands for, and a line after a label is a blank; here it only leads the eye to the boxes, which the ink can't tell from a dotted blank (left column)"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          705,
          165,
          330,
          180
        ],
        "reason": "the dot leaders from each condition out to its tick boxes (\"High blood pressure ........ ☐ Yes ☐ No\"): a dotted line after words is drawn in as the line it stands for, and a line after a label is a blank; here it only leads the eye to the boxes, which the ink can't tell from a dotted blank (right column; the first, after \"Stroke\", also takes the heading's words over it)"
      }
    ],
    "variationSkip": [
      {
        "variation": "0.7× size",
        "boxes": ["smoke_yes", "smoke_no", "alcohol_yes", "alcohol_no", "exercise_never", "exercise_sometimes", "exercise_most"],
        "reason": "the tick boxes typed as characters (\"[ ] Yes\", \"( ) Never\"): their ink is a bracket pair or a pair of round brackets, the same as \"[1]\" or \"(a)\" in print, so a check that took them would take bracketed letters and numbers too; read as words they would need OCR, which pass 1 can't use"
      },
      {
        "variation": "1.5× size",
        "boxes": ["smoke_yes", "smoke_no", "alcohol_yes", "alcohol_no", "exercise_never", "exercise_sometimes", "exercise_most"],
        "reason": "the tick boxes typed as characters (\"[ ] Yes\", \"( ) Never\"): their ink is a bracket pair or a pair of round brackets, the same as \"[1]\" or \"(a)\" in print, so a check that took them would take bracketed letters and numbers too; read as words they would need OCR, which pass 1 can't use"
      },
      {
        "variation": "2× size",
        "boxes": ["smoke_yes", "smoke_no", "alcohol_yes", "alcohol_no", "exercise_never", "exercise_sometimes", "exercise_most"],
        "reason": "the tick boxes typed as characters (\"[ ] Yes\", \"( ) Never\"): their ink is a bracket pair or a pair of round brackets, the same as \"[1]\" or \"(a)\" in print, so a check that took them would take bracketed letters and numbers too; read as words they would need OCR, which pass 1 can't use"
      },
      {
        "variation": "2.5× size",
        "boxes": ["smoke_yes", "smoke_no", "alcohol_yes", "alcohol_no", "exercise_never", "exercise_sometimes", "exercise_most"],
        "reason": "the tick boxes typed as characters (\"[ ] Yes\", \"( ) Never\"): their ink is a bracket pair or a pair of round brackets, the same as \"[1]\" or \"(a)\" in print, so a check that took them would take bracketed letters and numbers too; read as words they would need OCR, which pass 1 can't use"
      },
      {
        "variation": "3× size",
        "boxes": ["smoke_yes", "smoke_no", "alcohol_yes", "alcohol_no", "exercise_never", "exercise_sometimes", "exercise_most"],
        "reason": "the tick boxes typed as characters (\"[ ] Yes\", \"( ) Never\"): their ink is a bracket pair or a pair of round brackets, the same as \"[1]\" or \"(a)\" in print, so a check that took them would take bracketed letters and numbers too; read as words they would need OCR, which pass 1 can't use"
      },
      {
        "variation": "faint print",
        "boxes": ["smoke_yes", "smoke_no", "alcohol_yes", "alcohol_no", "exercise_never", "exercise_sometimes", "exercise_most"],
        "reason": "the tick boxes typed as characters (\"[ ] Yes\", \"( ) Never\"): their ink is a bracket pair or a pair of round brackets, the same as \"[1]\" or \"(a)\" in print, so a check that took them would take bracketed letters and numbers too; read as words they would need OCR, which pass 1 can't use"
      }
    ]
  },
  {
    "name": "Return to work (labels above lines, blanks after a tick box's words, a table ruled across, a stamp box)",
    "folder": "return-to-work",
    "session": "return_to_work_session.json",
    "variations": true,
    "skip": [
      {
        "test": "dates",
        "page": 1,
        "region": [
          298,
          494,
          176,
          44
        ],
        "reason": "\"Fit for full duties as of ____\": a blank inside a sentence is a date only by the words before it (\"on\", \"as of\", \"from\", \"to\", \"until\"), and those words come far more often before blanks that aren't dates (\"Comments on ____\", \"Referred to ____\", \"Transfer from ____\"), so a check that took them would make other forms' blanks date fields"
      },
      {
        "test": "dates",
        "page": 1,
        "region": [
          345,
          534,
          373,
          44
        ],
        "reason": "\"from ____ to ____\" (modified duties): a blank inside a sentence is a date only by the words before it (\"on\", \"as of\", \"from\", \"to\", \"until\"), and those words come far more often before blanks that aren't dates (\"Comments on ____\", \"Referred to ____\", \"Transfer from ____\"), so a check that took them would make other forms' blanks date fields"
      },
      {
        "test": "dates",
        "page": 1,
        "region": [
          273,
          574,
          176,
          44
        ],
        "reason": "\"Unfit for work until ____\": a blank inside a sentence is a date only by the words before it (\"on\", \"as of\", \"from\", \"to\", \"until\"), and those words come far more often before blanks that aren't dates (\"Comments on ____\", \"Referred to ____\", \"Transfer from ____\"), so a check that took them would make other forms' blanks date fields"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          632,
          312,
          276,
          44
        ],
        "reason": "\"DATE OF ASSESSMENT\" gets no today: \"Date of …\" names another event's date (\"Date seen\", \"Date of injury\"), and only the form's own dates (signed, sent, referral) are today; telling an assessment from a past event would need a list of words for this form"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          55,
          1035,
          590,
          65
        ],
        "reason": "a signature line: Auto Detect makes no signatures, and its line is the same in ink as a fill-in line with its caption under it (\"Physician signature\"), so it is found as a text field"
      }
    ]
  },
  {
    "name": "Immunization record (rows shown by alternate shading, lines down only)",
    "folder": "immunization-record",
    "session": "immunization_record_session.json",
    "variations": true,
    "skip": [
      {
        "test": "dates",
        "page": 1,
        "region": [
          374,
          214,
          192,
          572
        ],
        "reason": "the \"Date given\" column's cells get no label: the column heading is white letters in the dark heading bar, which OCR doesn't read (it reads dark print on paper), so nothing says the cells hold dates"
      }
    ]
  },
  {
    "name": "PHC & VCH cardiology referral (a fillable PDF's page as a picture: tick boxes against table lines, light placeholder text)",
    "folder": "cardiology-referral",
    "session": "cardiology_referral_session.json",
    "variations": true,
    "skip": [
      {
        "test": "tags",
        "page": 1,
        "region": [
          222,
          1036,
          408,
          54
        ],
        "reason": "\"Has this patient been seen by a Cardiologist before? Name: ____\" gets patient_name: the label is only \"Name:\", the patient's on most forms; that it is the cardiologist's is said only by the question on the row above, which a check would have to read as a sentence about whose details follow"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          726,
          1036,
          242,
          54
        ],
        "reason": "the \"Date: ____\" after the cardiologist's name (\"Has this patient been seen by a Cardiologist before?\") gets today: a bare \"Date:\" beside a name OSCAR fills is the form's date on most forms; that this one is an earlier visit's is said only by the question on the row above"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          1090,
          584,
          334,
          54
        ],
        "reason": "\"Alternate phone number\" gets phone (home): OSCAR 12 has home, work and cell phones, and \"alternate\" names none of them, so no check can tell which it is, or that it isn't the home phone"
      },
      {
        "test": "fields",
        "page": 1,
        "region": [
          170,
          1814,
          1226,
          54
        ],
        "reason": "the line under \"We require the following additional information…: ____\" is 3 px over the box's thick bottom edge: on the canvas the two are one band of ink, taken for a bar's bottom edge. Splitting a band where its rows' ends step in was tried: it still didn't give this line a field, and it moved fields on the bounceback and health-history forms"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          414,
          454,
          1096,
          52
        ],
        "reason": "the blank after the heading \"PATIENT INFORMATION:\": a caps label ending in a colon, with blank page to the form's edge, as \"PATIENT'S NAME:\" and \"MIDWIFE:\" are labels on other forms; it is no bolder by its strokes than those (measured), so nothing on the page says it's a heading"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          382,
          1280,
          140,
          48
        ],
        "reason": "the blank after the heading \"PREVIOUS INVESTIGATIONS:\" in the table's heading row: a caps label ending in a colon, as \"PATIENT'S NAME:\" is on other forms, and no bolder by its strokes (measured)"
      }
    ],
    "variationSkip": [
      {
        "variation": "0.7× size",
        "test": "extraFields",
        "page": 1,
        "region": [
          1284,
          1036,
          146,
          62
        ],
        "reason": "the blank after \"Is this a Re-referral? ☐ No ☐ Yes\", up to the box's right side: a blank after a row of options, which the eForm leaves out; it is about two and a half written lines wide, right at the width a labelled row's blank needs to be a field, so a resized copy can tip it over (the page itself doesn't)"
      },
      {
        "variation": "1.5× size",
        "test": "extraFields",
        "page": 1,
        "region": [
          1284,
          1036,
          146,
          62
        ],
        "reason": "the blank after \"Is this a Re-referral? ☐ No ☐ Yes\", up to the box's right side: a blank after a row of options, which the eForm leaves out; it is about two and a half written lines wide, right at the width a labelled row's blank needs to be a field, so a resized copy can tip it over (the page itself doesn't)"
      },
      {
        "variation": "0.7× size",
        "boxes": ["not_done_exercise_tolerance_test", "done_mibi", "attached_mibi", "not_done_mibi"],
        "reason": "the box sits right under its row's line, a pixel of paper between them on the page itself (where it is found); resizing the page blurs that gap away, so the box's top is part of the line, as a letter hanging under a line is (the D of \"Family MD\" over its cell's line), and on the larger copies the blur widens a side so the box is no longer square on the ink map. isRealBox's check for a line over a box needs a row of paper between the two: without one it can't tell this box from letters under a line"
      },
      {
        "variation": "1.5× size",
        "boxes": ["done_exercise_tolerance_test", "attached_exercise_tolerance_test", "done_mibi", "attached_mibi"],
        "reason": "the box sits right under its row's line, a pixel of paper between them on the page itself (where it is found); resizing the page blurs that gap away, so the box's top is part of the line, as a letter hanging under a line is (the D of \"Family MD\" over its cell's line), and on the larger copies the blur widens a side so the box is no longer square on the ink map. isRealBox's check for a line over a box needs a row of paper between the two: without one it can't tell this box from letters under a line"
      },
      {
        "variation": "2× size",
        "boxes": ["done_exercise_tolerance_test", "attached_exercise_tolerance_test", "done_mibi", "attached_mibi"],
        "reason": "the box sits right under its row's line, a pixel of paper between them on the page itself (where it is found); resizing the page blurs that gap away, so the box's top is part of the line, as a letter hanging under a line is (the D of \"Family MD\" over its cell's line), and on the larger copies the blur widens a side so the box is no longer square on the ink map. isRealBox's check for a line over a box needs a row of paper between the two: without one it can't tell this box from letters under a line"
      },
      {
        "variation": "2.5× size",
        "boxes": ["done_exercise_tolerance_test", "attached_exercise_tolerance_test", "done_mibi", "attached_mibi"],
        "reason": "the box sits right under its row's line, a pixel of paper between them on the page itself (where it is found); resizing the page blurs that gap away, so the box's top is part of the line, as a letter hanging under a line is (the D of \"Family MD\" over its cell's line), and on the larger copies the blur widens a side so the box is no longer square on the ink map. isRealBox's check for a line over a box needs a row of paper between the two: without one it can't tell this box from letters under a line"
      },
      {
        "variation": "3× size",
        "boxes": ["done_exercise_tolerance_test", "attached_exercise_tolerance_test", "done_mibi", "attached_mibi"],
        "reason": "the box sits right under its row's line, a pixel of paper between them on the page itself (where it is found); resizing the page blurs that gap away, so the box's top is part of the line, as a letter hanging under a line is (the D of \"Family MD\" over its cell's line), and on the larger copies the blur widens a side so the box is no longer square on the ink map. isRealBox's check for a line over a box needs a row of paper between the two: without one it can't tell this box from letters under a line"
      }
    ]
  },
  {
    "name": "Donation after MAiD admission orders (pre-printed orders: options ticked, short blanks in sentences)",
    "folder": "maid-donation-admission",
    "session": "maid_donation_admission_session.json",
    "variations": true
  },
  {
    "name": "Heart Function Clinic referral (shaded bars, a grey IH USE ONLY box, an information page)",
    "folder": "heart-function-clinic",
    "session": "heart_function_clinic_session.json",
    "variations": true
  },
  {
    "name": "Falls Prevention Mobile and Virtual Clinic referral (a dense table with grey bars, an information page)",
    "folder": "falls-prevention-referral",
    "session": "falls_prevention_referral_session.json",
    "variations": true
  },
  {
    "name": "North Okanagan Eating Disorder Program referral (underscore blanks, circles to pick a site)",
    "folder": "eating-disorder-referral",
    "session": "eating_disorder_referral_session.json",
    "variations": true
  },
  {
    "name": "Burnaby Maternity Clinic referral (fillable PDF whose fields have no names, and a page with none)",
    "folder": "burnaby-maternity-referral",
    "eform": "burnaby_maternity_referral.html",
    "images": [
      "burnaby_maternity_referral_page1.png",
      "burnaby_maternity_referral_page2.png",
      "burnaby_maternity_referral_page3.png",
      "burnaby_maternity_referral_page4.png"
    ],
    "pdf": "Burnaby_Maternity_Clinic_Referral.pdf"
  }
];
