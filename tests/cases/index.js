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
    "variations": true,
    "skip": [
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          85,
          412,
          670,
          50
        ],
        "reason": "the blank row under the three \"☐ Dr.\" options of REFERRAL TO's left column, the box closed by its bottom border, which the ink map joins to the grey PATIENT INFORMATION bar under it (a shaded bar's top closes the box above it, textFieldsFromLines): a blank after a list of options, which the eForm leaves out where the same layout, the right column's \"☐ Other: ____\", gets one"
      }
    ]
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
      {"test": "tags", "page": 1, "region": [780, 1110, 230, 40], "reason": "\"Date of review\" gets no today: a review date is often the next or last one (\"Review date\", \"Next review\"), so taking it for the form's own date would be right here and wrong on many forms"}
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
    "variations": true,
    "skip": [
      {
        "test": "extraTicks",
        "page": 1,
        "region": [
          455,
          492,
          40,
          40
        ],
        "reason": "the key's ☐ in \"• Mandatory  ☐ Optional: Prescriber check (✓) to initiate…\": a printed box the same in ink as the orders' boxes; only the sentence beside it says it is a key, not a box to tick"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          500,
          1795,
          400,
          70
        ],
        "reason": "the Prescriber Signature cell: a signature isn't a text field, and Auto Detect can't make one"
      }
    ],
    "variationSkip": [
      {
        "variation": "0.7× size",
        "page": 1,
        "region": [
          455,
          492,
          40,
          40
        ],
        "reason": "the key's ☐ in \"☐ Optional: Prescriber check (✓)…\", as on the page itself (the case's skip)"
      },
      {
        "variation": "1.5× size",
        "page": 1,
        "region": [
          455,
          492,
          40,
          40
        ],
        "reason": "the key's ☐ in \"☐ Optional: Prescriber check (✓)…\", as on the page itself (the case's skip)"
      },
      {
        "variation": "2× size",
        "page": 1,
        "region": [
          455,
          492,
          40,
          40
        ],
        "reason": "the key's ☐ in \"☐ Optional: Prescriber check (✓)…\", as on the page itself (the case's skip)"
      },
      {
        "variation": "2.5× size",
        "page": 1,
        "region": [
          455,
          492,
          40,
          40
        ],
        "reason": "the key's ☐ in \"☐ Optional: Prescriber check (✓)…\", as on the page itself (the case's skip)"
      },
      {
        "variation": "3× size",
        "page": 1,
        "region": [
          455,
          492,
          40,
          40
        ],
        "reason": "the key's ☐ in \"☐ Optional: Prescriber check (✓)…\", as on the page itself (the case's skip)"
      },
      {
        "variation": "faint print",
        "page": 1,
        "region": [
          455,
          492,
          40,
          40
        ],
        "reason": "the key's ☐ in \"☐ Optional: Prescriber check (✓)…\", as on the page itself (the case's skip)"
      }
    ]
  },
  {
    "name": "Heart Function Clinic referral (shaded bars, a grey IH USE ONLY box, an information page)",
    "folder": "heart-function-clinic",
    "session": "heart_function_clinic_session.json",
    "variations": true,
    "skip": [
      {
        "test": "extraTicks",
        "page": 1,
        "region": [
          796,
          34,
          30,
          30
        ],
        "reason": "the corner of the light grey \"P\" of \"Patient Name\" in the IH USE ONLY box, where the box's top and side lines meet it: a square of ink with an empty middle at that size"
      },
      {
        "test": "extraTicks",
        "page": 1,
        "region": [
          894,
          244,
          40,
          40
        ],
        "reason": "the light grey bold \"O\" of \"IH USE ONLY\": its squared-off outline is a box's in ink"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          812,
          1545,
          370,
          330
        ],
        "reason": "the Signature cells of both rows of Date | Time | Printed Name | Signature | Initials: a signature isn't a text field, and Auto Detect can't make one"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          1342,
          500,
          120,
          50
        ],
        "reason": "the blank after the \"Fax:\" heading of the column of fax numbers for each site: a column's heading over printed numbers, which a check would have to read as one"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          130,
          1810,
          1330,
          65
        ],
        "reason": "the second row of Date | Time | Printed Name | … under \"ACKNOWLEDGEMENT OF REFERRAL (To be completed by HF Clinic staff)\": the clinic staff's, with no tags; that is said only in brackets on the black bar, past the row \"Your patient will not be seen at the HFC. Reason ____\" just above, whose label names the patient, so the date gets today, the printed name patient_name and the college ID current_user_cpsid"
      },
      {
        "test": "extraFields",
        "page": 2,
        "reason": "an information page (the HFC triage flow chart and an acronym legend), with nothing to fill in: the blank in its boxes under their bullet lists, and between the boxes where the connectors run, is taken for writing areas and table cells (each is blank page closed by lines); a check would have to read the bullet lists as statements rather than labels"
      }
    ],
    "variationSkip": [
      {
        "variation": "0.7× size",
        "page": 1,
        "region": [
          796,
          34,
          30,
          30
        ],
        "reason": "the corner of the light grey \"P\" of \"Patient Name\" in the IH USE ONLY box, as on the page itself (the case's skip)"
      },
      {
        "variation": "1.5× size",
        "page": 1,
        "region": [
          796,
          34,
          30,
          30
        ],
        "reason": "the corner of the light grey \"P\" of \"Patient Name\" in the IH USE ONLY box, as on the page itself (the case's skip)"
      },
      {
        "variation": "2× size",
        "page": 1,
        "region": [
          796,
          34,
          30,
          30
        ],
        "reason": "the corner of the light grey \"P\" of \"Patient Name\" in the IH USE ONLY box, as on the page itself (the case's skip)"
      },
      {
        "variation": "3× size",
        "page": 1,
        "region": [
          796,
          34,
          30,
          30
        ],
        "reason": "the corner of the light grey \"P\" of \"Patient Name\" in the IH USE ONLY box, as on the page itself (the case's skip)"
      },
      {
        "variation": "faint print",
        "page": 1,
        "region": [
          796,
          34,
          30,
          30
        ],
        "reason": "the corner of the light grey \"P\" of \"Patient Name\" in the IH USE ONLY box, as on the page itself (the case's skip)"
      },
      {
        "variation": "0.7× size",
        "page": 1,
        "region": [
          894,
          244,
          40,
          40
        ],
        "reason": "the light grey bold \"O\" of \"IH USE ONLY\", as on the page itself (the case's skip)"
      },
      {
        "variation": "1.5× size",
        "page": 1,
        "region": [
          894,
          244,
          40,
          40
        ],
        "reason": "the light grey bold \"O\" of \"IH USE ONLY\", as on the page itself (the case's skip)"
      },
      {
        "variation": "2× size",
        "page": 1,
        "region": [
          894,
          244,
          40,
          40
        ],
        "reason": "the light grey bold \"O\" of \"IH USE ONLY\", as on the page itself (the case's skip)"
      },
      {
        "variation": "2.5× size",
        "page": 1,
        "region": [
          894,
          244,
          40,
          40
        ],
        "reason": "the light grey bold \"O\" of \"IH USE ONLY\", as on the page itself (the case's skip)"
      },
      {
        "variation": "3× size",
        "page": 1,
        "region": [
          894,
          244,
          40,
          40
        ],
        "reason": "the light grey bold \"O\" of \"IH USE ONLY\", as on the page itself (the case's skip)"
      },
      {
        "variation": "faint print",
        "page": 1,
        "region": [
          894,
          244,
          40,
          40
        ],
        "reason": "the light grey bold \"O\" of \"IH USE ONLY\", as on the page itself (the case's skip)"
      },
      {
        "variation": "0.7× size",
        "page": 1,
        "region": [
          798,
          164,
          30,
          30
        ],
        "reason": "the light grey \"P\" of \"PHN\" in the IH USE ONLY box, closed at 0.7× by the box's side line just left of it"
      }
    ]
  },
  {
    "name": "Falls Prevention Mobile and Virtual Clinic referral (a dense table with grey bars, an information page)",
    "folder": "falls-prevention-referral",
    "session": "falls_prevention_referral_session.json",
    "variations": true,
    "skip": [
      {
        "test": "ticks",
        "page": 1,
        "region": [
          416,
          1258,
          40,
          40
        ],
        "reason": "the box in the grey Alternative Contact bar (\"☐ Arrange appointment with the contact listed below\"): on the ink map a grey bar is ink, so a box in it is lost in the bar"
      },
      {
        "test": "ticks",
        "page": 1,
        "region": [
          143,
          1330,
          40,
          40
        ],
        "reason": "the box in the grey bar \"☐ MEDICATION LIST ATTACHED\": on the ink map a grey bar is ink, so a box in it is lost in the bar"
      },
      {
        "test": "fields",
        "page": 1,
        "region": [
          480,
          680,
          980,
          45
        ],
        "reason": "the date after \"Date of Referral (DD-MM-YYYY):\", written on the grey bar itself: on the ink map the bar is ink, not blank page"
      },
      {
        "test": "fields",
        "page": 1,
        "region": [
          240,
          780,
          350,
          50
        ],
        "reason": "\"Phone #:\" under Referee Name: the blank beside it in its cell, between the lines under Referee Name and over Fax #, isn't found (no field after its colon either); not traced further, as the table's other rows of this kind are found"
      },
      {
        "test": "fields",
        "page": 1,
        "region": [
          1366,
          745,
          90,
          95
        ],
        "reason": "the room after the two \"☐ Other:\" options at the table's right edge: about three letters wide, too narrow for a field after a colon"
      },
      {
        "test": "extraTicks",
        "page": 1,
        "region": [
          184,
          368,
          30,
          30
        ],
        "reason": "the I of \"Form ID:\" with the top of the D: bold capitals that close into a square at this size"
      },
      {
        "test": "extraTicks",
        "page": 1,
        "region": [
          124,
          676,
          50,
          50
        ],
        "reason": "the D of \"Date of Referral\" at the left end of a grey bar, closed by the table's side line"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          905,
          330,
          560,
          80
        ],
        "reason": "the blank top right of the page over the form's first line, beside the barcode and form number: an unlabelled space for a patient label, which the eForm leaves out"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          130,
          740,
          470,
          50
        ],
        "reason": "the second line of the Referee Name cell, under \"Referee Name: ____\": a cell two lines tall, taken for a field beside the label and one under it"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          900,
          835,
          560,
          45
        ],
        "reason": "the blanks after the wrapped option words \"Department\" and \"Clinic\" in the Site Type row, now that the grey bar under the row closes it: blanks after options, which the eForm leaves out"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          130,
          1525,
          1110,
          60
        ],
        "reason": "the foot of the cells \"☐ Stroke/ Brain Injury\" … \"☐ Anxiety/ Depression\", whose option words take two lines: blank page under an option, beside its second line"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          540,
          1220,
          110,
          45
        ],
        "reason": "after \"Same as Referee listed above, OR:\": the option's colon leads on to the next cell's Family Doctor name, not to a blank of its own"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          828,
          1600,
          220,
          50
        ],
        "reason": "after \"If cognitive impairments exist, complete the following if known or available:\": a sentence's colon over the MoCA and MMSE blanks"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          336,
          1760,
          140,
          40
        ],
        "reason": "after \"Please check one:\" in Clinical Frailty Score: an instruction's colon before the tick boxes in the next cells"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          770,
          930,
          690,
          130
        ],
        "reason": "the full address: its label \"(Full Address, must include city)\" names a city, which askedFor reads before address, and the section's owner is taken from the clinic's name in the header"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          856,
          1146,
          600,
          60
        ],
        "reason": "Email: the field is found but gets no tag; its label \"Email:\" wasn't traced to see why it isn't read as the field's"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          300,
          714,
          290,
          50
        ],
        "reason": "\"Referee Name\": the form calls the person making the referral the referee; the word means the one referred, so it gets the patient's name"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          210,
          820,
          380,
          50
        ],
        "reason": "\"Fax #:\" under Referee Name: nothing on its row or above in its cell says whose, so it gets no tag"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          376,
          1284,
          1080,
          55
        ],
        "reason": "Name & Relationship and Phone Number under the grey \"Alternative Contact\" bar: \"alternative contact\" names no one OSCAR has tags for, but the row above (Family Doctor) gives the name doctor and the clinic in the header gives the phone clinic_phone"
      },
      {
        "test": "extraFields",
        "page": 2,
        "reason": "an information page (\"DO NOT FAX THIS SIDE\": the Clinical Frailty Scale), with nothing to fill in: the blank part of each table row under its description, the header's blank top right, \"Email:\" in a sentence and the page's empty foot are taken for fields; a check would have to read the descriptions as statements rather than labels"
      }
    ],
    "variationSkip": [
      {
        "variation": "0.7× size",
        "boxes": [
          "arrange_appointment_with_the_contact",
          "medication_list_attached"
        ],
        "reason": "the boxes inside grey bars are lost in the bars on the ink map, as on the page itself (the case's skip)"
      },
      {
        "variation": "1.5× size",
        "boxes": [
          "arrange_appointment_with_the_contact",
          "medication_list_attached"
        ],
        "reason": "the boxes inside grey bars are lost in the bars on the ink map, as on the page itself (the case's skip)"
      },
      {
        "variation": "2× size",
        "boxes": [
          "arrange_appointment_with_the_contact",
          "medication_list_attached"
        ],
        "reason": "the boxes inside grey bars are lost in the bars on the ink map, as on the page itself (the case's skip)"
      },
      {
        "variation": "2.5× size",
        "boxes": [
          "arrange_appointment_with_the_contact",
          "medication_list_attached"
        ],
        "reason": "the boxes inside grey bars are lost in the bars on the ink map, as on the page itself (the case's skip)"
      },
      {
        "variation": "3× size",
        "boxes": [
          "arrange_appointment_with_the_contact",
          "medication_list_attached"
        ],
        "reason": "the boxes inside grey bars are lost in the bars on the ink map, as on the page itself (the case's skip)"
      },
      {
        "variation": "faint print",
        "boxes": [
          "arrange_appointment_with_the_contact",
          "medication_list_attached"
        ],
        "reason": "the boxes inside grey bars are lost in the bars on the ink map, as on the page itself (the case's skip)"
      },
      {
        "variation": "0.7× size",
        "page": 1,
        "region": [
          124,
          676,
          50,
          50
        ],
        "reason": "the D of \"Date of Referral\" at the left end of a grey bar, as on the page itself (the case's skip)"
      },
      {
        "variation": "1.5× size",
        "page": 1,
        "region": [
          124,
          676,
          50,
          50
        ],
        "reason": "the D of \"Date of Referral\" at the left end of a grey bar, as on the page itself (the case's skip)"
      },
      {
        "variation": "2× size",
        "page": 1,
        "region": [
          124,
          676,
          50,
          50
        ],
        "reason": "the D of \"Date of Referral\" at the left end of a grey bar, as on the page itself (the case's skip)"
      },
      {
        "variation": "2.5× size",
        "page": 1,
        "region": [
          124,
          676,
          50,
          50
        ],
        "reason": "the D of \"Date of Referral\" at the left end of a grey bar, as on the page itself (the case's skip)"
      },
      {
        "variation": "3× size",
        "page": 1,
        "region": [
          124,
          676,
          50,
          50
        ],
        "reason": "the D of \"Date of Referral\" at the left end of a grey bar, as on the page itself (the case's skip)"
      },
      {
        "variation": "faint print",
        "page": 1,
        "region": [
          124,
          676,
          50,
          50
        ],
        "reason": "the D of \"Date of Referral\" at the left end of a grey bar, as on the page itself (the case's skip)"
      },
      {
        "variation": "1.5× size",
        "page": 1,
        "region": [
          184,
          368,
          30,
          30
        ],
        "reason": "the I of \"Form ID:\" with the top of the D, as on the page itself (the case's skip)"
      },
      {
        "variation": "2× size",
        "page": 1,
        "region": [
          184,
          368,
          30,
          30
        ],
        "reason": "the I of \"Form ID:\" with the top of the D, as on the page itself (the case's skip)"
      },
      {
        "variation": "2.5× size",
        "page": 1,
        "region": [
          184,
          368,
          30,
          30
        ],
        "reason": "the I of \"Form ID:\" with the top of the D, as on the page itself (the case's skip)"
      },
      {
        "variation": "3× size",
        "page": 1,
        "region": [
          184,
          368,
          30,
          30
        ],
        "reason": "the I of \"Form ID:\" with the top of the D, as on the page itself (the case's skip)"
      },
      {
        "variation": "faint print",
        "page": 1,
        "region": [
          184,
          368,
          30,
          30
        ],
        "reason": "the I of \"Form ID:\" with the top of the D, as on the page itself (the case's skip)"
      },
      {
        "variation": "0.7× size",
        "page": 1,
        "region": [
          478,
          652,
          30,
          30
        ],
        "reason": "the bold O of \"DO NOT PROCEED\" at 0.7× (about 123 dpi): its squared outline and empty middle are a box's"
      },
      {
        "variation": "faint print",
        "page": 1,
        "region": [
          1330,
          1548,
          30,
          30
        ],
        "reason": "the small \"fy\" of \"(*specify)\" under the specify line, printed faint: it and the line close into a square"
      },
      {
        "variation": "0.7× size",
        "test": "fields",
        "page": 1,
        "region": [
          1290,
          1600,
          100,
          70
        ],
        "reason": "the MMSE blank \"MMSE: ____ (score)\" at 0.7×: the field is taken up to the cell's top line above it, too tall to match the one on its line"
      },
      {
        "variation": "0.7× size",
        "test": "extraFields",
        "page": 1,
        "region": [
          1290,
          1600,
          100,
          70
        ],
        "reason": "the MMSE blank at 0.7×, taken up to the cell's top line (the skip above)"
      }
    ]
  },
  {
    "name": "North Okanagan Eating Disorder Program referral (underscore blanks, circles to pick a site)",
    "folder": "eating-disorder-referral",
    "session": "eating_disorder_referral_session.json",
    "variations": true,
    "skip": [
      {
        "test": "ticks",
        "page": 1,
        "region": [
          150,
          1110,
          720,
          280
        ],
        "reason": "the three circles to pick a site (CHILD & YOUTH MENTAL HEALTH… VERNON, SALMON ARM; VERNON MENTAL HEALTH): 39 by 35 px, 41 px on the ink map, past the largest tick box Auto Detect takes (maxCb 32 + tolCb 8 px at 1500 px wide); a larger limit wasn't tried, as it would let in letters of large headings"
      },
      {
        "test": "fields",
        "page": 1,
        "region": [
          290,
          630,
          170,
          80
        ],
        "reason": "the page count beside \"Pages\" (no colon, nothing to write on, \"Including the cover page.\" printed after it): blank page in a ruled row that the label shares with printed text"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [
          200,
          340,
          1150,
          65
        ],
        "reason": "the blank under the title FAX REFERRAL SHEET, above the To/Company table's first line: blank page under a heading that is the form's title"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          870,
          485,
          480,
          75
        ],
        "reason": "the fax cover's Phone: the recipient's (To / Company / Fax / Phone); a cover sheet's lines are the receiver's only by the layout, so it gets the patient's phone"
      },
      {
        "test": "fields",
        "page": 2,
        "region": [
          994,
          1040,
          245,
          50
        ],
        "reason": "\"Other ____\" after the Female / Male / Trans / Non-binary tick boxes: its underscore line runs into the cell's bottom line just under it, so it isn't found as a line of its own"
      },
      {
        "test": "extraFields",
        "page": 2,
        "region": [
          130,
          860,
          1220,
          230
        ],
        "reason": "the blank under CLIENT INFORMATION and the rest of the Surname cell under \"Surname of client: ____\": the heading sits on the table's top line, and the cell's blank under its one fill-in line is taken for a writing area"
      },
      {
        "test": "extraFields",
        "page": 2,
        "region": [
          130,
          1255,
          800,
          60
        ],
        "reason": "the foot of the Current address cell, under its two underscore lines: the cell's blank under ruled lines is taken for one more"
      },
      {
        "test": "fields",
        "page": 2,
        "region": [
          484,
          1640,
          680,
          50
        ],
        "reason": "Highest weight: (excluding pregnancy) ____ and its When was this? ____: the underscores run into the table's bottom line just under them, so neither is found as a line of its own (the field found beside them, at the cell's end, is the next skip)"
      },
      {
        "test": "extraFields",
        "page": 2,
        "region": [
          1150,
          1645,
          200,
          45
        ],
        "reason": "the blank at the right end of the table's last row, after \"When was this? ____\", whose line merges with the table's bottom line (the skip above)"
      },
      {
        "test": "tags",
        "page": 2,
        "region": [
          140,
          780,
          700,
          100
        ],
        "reason": "the Office address area: its label is on the row just above its first ruled line and isn't read as the area's, so it has no tag"
      },
      {
        "test": "tags",
        "page": 2,
        "region": [
          140,
          1175,
          640,
          100
        ],
        "reason": "the Current address area: its label is on the row just above its first ruled line and isn't read as the area's, so it has no tag"
      },
      {
        "test": "tags",
        "page": 2,
        "region": [
          1015,
          1175,
          300,
          50
        ],
        "reason": "the care card number after \"Care card #: Yes ☐ ____\": the field's label is the option \"Yes\" beside it, and \"Care card #:\" is a line above"
      },
      {
        "test": "tags",
        "page": 2,
        "region": [
          1010,
          955,
          210,
          50
        ],
        "reason": "the Female and Male tick boxes, printed after their words (\"Female ☐   Male ☐\"): a tick box's label is read from the words after it, here the next option's, so neither gets the sex fill"
      },
      {
        "test": "ticks",
        "page": 3,
        "region": [
          240,
          889,
          45,
          45
        ],
        "reason": "the Diuretics box: on the canvas the descender of the g in \"purging\" just above it reaches its top through the ink map's soft edges, so it is a box with ink joined on. Counting only ink dark on the grey image was tried: it found the box but let in many letters"
      },
      {
        "test": "extraFields",
        "page": 3,
        "region": [
          1150,
          215,
          200,
          75
        ],
        "reason": "the blank right of \"In what period of time? ____\" in the box's first row: blank page beside a line's end, in a cell"
      },
      {
        "test": "extraFields",
        "page": 3,
        "region": [
          928,
          965,
          420,
          65
        ],
        "reason": "the blank after \"Binge eating … Yes ☐ No ☐\" on the next row, after \"How many days per week? ____\": blank page to the box's side"
      },
      {
        "test": "extraFields",
        "page": 3,
        "region": [
          134,
          1426,
          1210,
          50
        ],
        "reason": "the foot of the box under \"Current medications\"'s line: a cell's blank under its last ruled line"
      },
      {
        "test": "tags",
        "page": 3,
        "region": [
          148,
          1392,
          1130,
          45
        ],
        "reason": "the line under \"Current medications (please list type and dosage):\": its label is on the row above and isn't read as the line's (it has a bracketed aside after it), so no druglist_line"
      },
      {
        "test": "ticks",
        "page": 4,
        "region": [
          574,
          1363,
          45,
          75
        ],
        "reason": "the AN/R and Bulimia Nervosa boxes, stacked one right on the other: each has the other joined on to it. Allowing a box of the same size beyond was tried: it let in letters over underlines and in shaded columns on other forms"
      },
      {
        "test": "extraFields",
        "page": 4,
        "region": [
          134,
          396,
          1200,
          50
        ],
        "reason": "the foot of the psychiatric history box under its four ruled lines: a cell's blank under its last line"
      },
      {
        "test": "extraFields",
        "page": 4,
        "region": [
          134,
          954,
          1200,
          50
        ],
        "reason": "the foot of the self-harm box under its two ruled lines: a cell's blank under its last line"
      }
    ],
    "variationSkip": [
      {
        "variation": "0.7× size",
        "boxes": [
          "cymh_vernon",
          "vernon_mental_health",
          "cymh_salmon_arm"
        ],
        "reason": "the circles to pick a site are past the largest tick box Auto Detect takes, as on the page itself (the case's skip)"
      },
      {
        "variation": "1.5× size",
        "boxes": [
          "cymh_vernon",
          "vernon_mental_health",
          "cymh_salmon_arm"
        ],
        "reason": "the circles to pick a site are past the largest tick box Auto Detect takes, as on the page itself (the case's skip)"
      },
      {
        "variation": "2× size",
        "boxes": [
          "cymh_vernon",
          "vernon_mental_health",
          "cymh_salmon_arm"
        ],
        "reason": "the circles to pick a site are past the largest tick box Auto Detect takes, as on the page itself (the case's skip)"
      },
      {
        "variation": "2.5× size",
        "boxes": [
          "cymh_vernon",
          "vernon_mental_health",
          "cymh_salmon_arm"
        ],
        "reason": "the circles to pick a site are past the largest tick box Auto Detect takes, as on the page itself (the case's skip)"
      },
      {
        "variation": "3× size",
        "boxes": [
          "cymh_vernon",
          "vernon_mental_health",
          "cymh_salmon_arm"
        ],
        "reason": "the circles to pick a site are past the largest tick box Auto Detect takes, as on the page itself (the case's skip)"
      },
      {
        "variation": "faint print",
        "boxes": [
          "cymh_vernon",
          "vernon_mental_health",
          "cymh_salmon_arm"
        ],
        "reason": "the circles to pick a site are past the largest tick box Auto Detect takes, as on the page itself (the case's skip)"
      },
      {
        "variation": "1.5× size",
        "boxes": [
          "diuretics"
        ],
        "reason": "the Diuretics box has the descender of the g in \"purging\" joined to its top on the ink map, as on the page itself (the case's skip)"
      },
      {
        "variation": "2× size",
        "boxes": [
          "diuretics"
        ],
        "reason": "the Diuretics box has the descender of the g in \"purging\" joined to its top on the ink map, as on the page itself (the case's skip)"
      },
      {
        "variation": "2.5× size",
        "boxes": [
          "diuretics"
        ],
        "reason": "the Diuretics box has the descender of the g in \"purging\" joined to its top on the ink map, as on the page itself (the case's skip)"
      },
      {
        "variation": "3× size",
        "boxes": [
          "diuretics"
        ],
        "reason": "the Diuretics box has the descender of the g in \"purging\" joined to its top on the ink map, as on the page itself (the case's skip)"
      },
      {
        "variation": "faint print",
        "boxes": [
          "diuretics"
        ],
        "reason": "the Diuretics box has the descender of the g in \"purging\" joined to its top on the ink map, as on the page itself (the case's skip)"
      },
      {
        "variation": "0.7× size",
        "boxes": [
          "anorexia_nervosa_restricting_type",
          "bulimia_nervosa"
        ],
        "reason": "the AN/R and Bulimia Nervosa boxes are stacked one on the other, each joined to the other, as on the page itself (the case's skip); some sizes blur them apart"
      },
      {
        "variation": "2× size",
        "boxes": [
          "anorexia_nervosa_restricting_type",
          "bulimia_nervosa"
        ],
        "reason": "the AN/R and Bulimia Nervosa boxes are stacked one on the other, each joined to the other, as on the page itself (the case's skip); some sizes blur them apart"
      },
      {
        "variation": "2.5× size",
        "boxes": [
          "anorexia_nervosa_restricting_type",
          "bulimia_nervosa"
        ],
        "reason": "the AN/R and Bulimia Nervosa boxes are stacked one on the other, each joined to the other, as on the page itself (the case's skip); some sizes blur them apart"
      },
      {
        "variation": "faint print",
        "boxes": [
          "anorexia_nervosa_restricting_type",
          "bulimia_nervosa"
        ],
        "reason": "the AN/R and Bulimia Nervosa boxes are stacked one on the other, each joined to the other, as on the page itself (the case's skip); some sizes blur them apart"
      },
      {
        "variation": "1.5× size",
        "boxes": [
          "checkbox_11_1"
        ],
        "reason": "the OSFED box sits on the box's bottom line, a pixel or two of paper between them on the page; enlarging it blurs that gap away, so the line is joined to the box's bottom, as a fill-in line under letters is"
      },
      {
        "variation": "2× size",
        "boxes": [
          "checkbox_11_1"
        ],
        "reason": "the OSFED box sits on the box's bottom line, a pixel or two of paper between them on the page; enlarging it blurs that gap away, so the line is joined to the box's bottom, as a fill-in line under letters is"
      },
      {
        "variation": "2.5× size",
        "boxes": [
          "checkbox_11_1"
        ],
        "reason": "the OSFED box sits on the box's bottom line, a pixel or two of paper between them on the page; enlarging it blurs that gap away, so the line is joined to the box's bottom, as a fill-in line under letters is"
      },
      {
        "variation": "3× size",
        "boxes": [
          "checkbox_11_1"
        ],
        "reason": "the OSFED box sits on the box's bottom line, a pixel or two of paper between them on the page; enlarging it blurs that gap away, so the line is joined to the box's bottom, as a fill-in line under letters is"
      },
      {
        "variation": "0.7× size",
        "test": "extraFields",
        "page": 4,
        "region": [
          1166,
          1386,
          186,
          54
        ],
        "reason": "the blank right of the OSFED box at 0.7×, where the box's bottom line and the frame's run together: blank page to the frame's side"
      }
    ]
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
    "pdf": "Burnaby_Maternity_Clinic_Referral.pdf",
    "skip": [
      {
        "test": "extraTicks",
        "page": 4,
        "region": [
          736,
          1604,
          35,
          35
        ],
        "reason": "a square bullet in the PROGESTERONE box's WHEN? list: a filled square, the same in ink as a small box at this size"
      },
      {
        "test": "extraFields",
        "page": 4,
        "region": [
          170,
          700,
          1160,
          230
        ],
        "reason": "the blank parts of the guideline's three boxes (≥1 high risk, ≥2 moderate, ≥1 abnormal analyte) under their tick-box lists, and between them where the arrows run: an information page's boxes; a check would have to read the lists as options, not labels"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          280,
          994,
          400,
          80
        ],
        "reason": "\"English-speaking Contact's Name\": someone else's, but \"contact\" names no one OSCAR has tags for, and \"Contact\" alone is often the patient's (\"Contact number\"), so it gets the patient's name"
      },
      {
        "test": "tags",
        "page": 1,
        "region": [
          1018,
          996,
          386,
          80
        ],
        "reason": "\"English-speaking Contact's Phone\": someone else's, but \"contact\" names no one OSCAR has tags for, and \"Contact\" alone is often the patient's, so it gets the patient's phone"
      }
    ]
  },
  {
    "name": "Pre-op physician history (a two-column table of labelled rows, headings in cells)",
    "folder": "preop-physician-history",
    "session": "preop_physician_history_session.json",
    "variations": true,
    "skip": [
      {"test": "extraFields", "page": 1, "region": [755, 765, 690, 40], "reason": "the blank under \"MEDICATIONS\", a heading centred in its cell over the right column's rows: the eForm leaves it out, but the cell is a row of the table, its ink a label at its top, as \"CARDIAC\" is in the cell beside it, which has a field"},
      {"test": "extraFields", "page": 1, "region": [755, 1078, 690, 38], "reason": "the blank under \"PHYSICAL EXAMINATION\", a heading centred in its cell: as \"MEDICATIONS\", the same in ink as a labelled row"},
      {"test": "extraFields", "page": 1, "region": [72, 1695, 690, 75], "reason": "\"PHYSICIAN'S SIGNATURE\": a signature's cell, which the eForm leaves to the signature"}
    ]
  },
  {
    "name": "Request to change designated MRP (boxed cells with labels on top, grey section bars)",
    "folder": "mrp-change-request",
    "session": "mrp_change_request_session.json",
    "variations": true,
    "skip": [
      {"test": "extraFields", "page": 1, "region": [640, 335, 150, 65], "reason": "the blank over the header's rule between \"New: April 19, 2024\" and \"Page: 1 of 1\": the form's dates printed on the rule read as labels along a fill-in line"},
      {"test": "extraFields", "page": 1, "region": [905, 330, 560, 75], "reason": "the blank top right of the page over the form's first line, beside the form number: an unlabelled space for a patient label, which the eForm leaves out"},
      {"test": "extraFields", "page": 1, "region": [1010, 530, 445, 60], "reason": "the blank under \"Sex ☐ M ☐ F ☐ X\": a blank after a row of options, which the eForm leaves out, where the same layout of a cell's label over its blank gets a field in the cells beside it"},
      {"test": "extraFields", "page": 1, "region": [128, 1812, 1335, 46], "reason": "the blank last row of the instructions box, under \"E-mailed to Central Intake at ...\": the box's bottom edge closes it as a fill-in line"},
      {"test": "tags", "page": 1, "region": [575, 748, 445, 65], "reason": "\"First name\" under the grey bar \"Previous Resident's MRP Information\": the bar's words lie over the first column only, so the second looks up past them to \"First Name\" of the row above, the patient's; reading a bar's heading across the whole table would need the bar's extent in the owner check"},
      {"test": "tags", "page": 1, "region": [1010, 748, 445, 65], "reason": "\"MSP No.\" under \"Previous Resident's MRP Information\": as its row's \"First name\", the heading in the bar is over the first column only, so it is the patient's (hin)"},
      {"test": "tags", "page": 1, "region": [130, 872, 450, 80], "reason": "\"Name\" under \"Care Community Information\": a heading that names no one doesn't stop the look upward, which reaches the previous MRP's \"Last name\" and makes it the doctor's"},
      {"test": "tags", "page": 1, "region": [130, 966, 450, 80], "reason": "\"Postal Code\" under \"Care Community Information\": as \"Name\" above it, taken for the previous MRP's, whose postal code OSCAR has no tag for"},
      {"test": "tags", "page": 1, "region": [1010, 966, 445, 80], "reason": "\"Other Phone\": the resident's second phone, which OSCAR 12 has no tag for (phone2 is a work phone); \"phone\" is on it, as on \"Home Phone\""}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "test": "extraFields", "page": 1, "region": [495, 1688, 955, 45], "reason": "the blank after \"Completed form must be:\" in the instructions box, a colon with blank page after it: a field only at 0.7× (not traced further; the pushed app does the same)"}
    ]
  },
  {
    "name": "TWC assessment (five pages of fill-in lines, tables and boxes for numbers)",
    "folder": "twc-assessment",
    "session": "twc_assessment_session.json",
    "variations": true,
    "skip": [
      {"test": "fields", "page": 1, "region": [845, 385, 405, 40], "reason": "the three PHN blanks (\"PHN# ____ - ____ - ____\"): short lines with the \"DD  MM  YY\" captions of the birth date's blanks just above them, read as their labels, so the space between is no room to write; telling a row above's captions from a line's own label needs more than ink"},
      {"test": "fields", "page": 1, "region": [500, 715, 815, 80], "reason": "the five small boxes for numbers (\"Dependent Children (enter # of children in box)\"): about twice as wide as tall, too wide for a tick box and too short for lines that bound a field"},
      {"test": "fields", "page": 2, "region": [210, 918, 1225, 55], "reason": "\"Operations\": its label at the foot of its row, the line under it the medications table's top edge, and no line between the label and the row above to close a box over its blank"},
      {"test": "fields", "page": 5, "region": [960, 1512, 75, 45], "reason": "the first blank of the client's \"Date ___/___/___\": its line starts just right of \"Date\" and is read with it as the label's underline"},
      {"test": "extraFields", "page": 2, "region": [505, 212, 930, 45], "reason": "the blank right of \"Drug & Alcohol Recovery & Education Society\" over the header's rule: the rule runs under the society's name as a fill-in line would under a label"},
      {"test": "extraFields", "page": 2, "region": [285, 1020, 725, 40], "reason": "the blanks between the medication table's headings (\"Name ____ Condition Being Treated\"), over the table's top edge: the same as labels along a fill-in line"},
      {"test": "extraFields", "page": 5, "region": [570, 284, 725, 42], "reason": "the blanks between the professionals table's headings (\"Name ____ Agency / Office ____ Tel\"), over the table's top edge: the same as labels along a fill-in line"},
      {"test": "extraFields", "page": 3, "region": [70, 1162, 232, 60], "reason": "the suicide risk row is split at \"Suicide Risk\"'s end, its tick boxes' words over the rest: the eForm's one field across the row"},
      {"test": "extraFields", "page": 5, "region": [260, 1505, 540, 45], "reason": "\"Client Signature\": a signature line, which the eForm leaves to the signature"},
      {"test": "extraFields", "page": 5, "region": [240, 1740, 540, 45], "reason": "\"Staff Signature\": a signature line, which the eForm leaves to the signature"},
      {"test": "extraFields", "page": 5, "region": [950, 1785, 495, 45], "reason": "the \"Day  Month  Year\" captions under the staff date's blanks, read as labels with blank page after them"},
      {"test": "tags", "page": 1, "region": [240, 568, 420, 45], "reason": "\"Contact # 1\": a phone number named only by \"#\", which OCR and the label's words drop; \"contact\" alone names no one (seen, not traced)"},
      {"test": "tags", "page": 1, "region": [325, 386, 40, 40], "reason": "the \"M ☐\" of \"Gender ID\": the box's label is \"M\" and \"Gender ID\" is more than ten boxes' width to its left, where a sex is looked for (seen, not traced)"},
      {"test": "tags", "page": 2, "region": [715, 702, 700, 50], "reason": "\"Physician for pre-natal care ____ Tel ____\": a physician named by their role, which can't be told from the clinician's (\"Physician\", \"Prescribing physician\")"},
      {"test": "tags", "page": 2, "region": [870, 1548, 235, 45], "reason": "\"Prescribing Physician\": the methadone prescriber, named by the role that elsewhere names the referring clinician"},
      {"test": "tags", "page": 2, "region": [66, 1650, 1370, 40], "reason": "the second line of \"Allergies (drug, food, environmental – include reactions)\": the line above's continuation, with the label over it as well"},
      {"test": "tags", "page": 4, "region": [460, 1150, 170, 55], "reason": "the Method cell on the \"Misuse of other Prescription Meds\" row: its row's heading names medications, and a table cell takes it as its label"},
      {"test": "tags", "page": 4, "region": [60, 1465, 1390, 50], "reason": "\"Other Addictions (sex, food, gambling, etc)\": \"sex\" in the examples in brackets; the words in brackets are often what a field asks for (\"Phone (home)\"), so they are read"},
      {"test": "tags", "page": 5, "region": [330, 376, 425, 55], "reason": "\"Addictions Physician\": a physician named by their role, which can't be told from the clinician's"},
      {"test": "tags", "page": 5, "region": [90, 1260, 480, 60], "reason": "\"I ____, verify that ...\" with \"Print Name\" under it: the client's name, but the label read is \"I\""},
      {"test": "tags", "page": 5, "region": [895, 1742, 135, 45], "reason": "the staff date's first blank (\"Date ____/____/____\" over \"Day  Month  Year\"): its caption is taken for a field of its own, so it is the whole date, today"}
    ],
    "variationSkip": [
      {"variation": "2× size", "test": "fields", "page": 1, "region": [905, 922, 530, 45], "reason": "the Per Diem \"Other ____\" blank, with \"...into the TWC Program\" printed just over its start: found on the page and at the other sizes; at 2× and 2.5× it is lost (not traced further; the pushed app loses it there too)"},
      {"variation": "2.5× size", "test": "fields", "page": 1, "region": [905, 922, 530, 45], "reason": "as at 2×: the Per Diem \"Other ____\" blank under the end of \"...TWC Program\""},
      {"variation": "0.7× size", "boxes": ["checkbox_5_1"], "reason": "the box after \"Carry Privileges ... No\", printed right against the o of \"No\": found on the page and the larger copies, missed at 0.7× (not traced further; the pushed app misses it too)"},
      {"variation": "0.7× size", "test": "fields", "page": 5, "region": [1030, 1508, 95, 48], "reason": "the client's date, month blank (\"Date ___/___/___\" over \"DD MM YY\"): missed at 0.7×, short lines with slashes between them (not traced further; the pushed app misses it too)"},
      {"variation": "0.7× size", "test": "extraFields", "page": 5, "region": [895, 1742, 475, 45], "reason": "the staff date's three blanks (\"___/___/___\"): at 0.7× one field across them, where the eForm has a field each (not traced further; the pushed app does the same)"},
      {"variation": "2× size", "test": "fields", "page": 5, "region": [330, 542, 425, 55], "reason": "the Name cell of the \"A & D Counselling\" row: found on the page and the smaller copies; lost at 2× and 2.5× (not traced further; the pushed app loses it there too)"},
      {"variation": "2.5× size", "test": "fields", "page": 5, "region": [330, 542, 425, 55], "reason": "as at 2×: the Name cell of the \"A & D Counselling\" row"}
    ]
  },
  {
    "name": "New patient questionnaire (fillable PDF: radio buttons for Yes/No, sex)",
    "folder": "new-patient-questionnaire",
    "eform": "new_patient_questionnaire.html",
    "images": ["new_patient_questionnaire_page1.png"],
    "pdf": "New_Patient_Questionnaire_FGSG_2025_Fillable.pdf"
  },
  {
    "name": "Youth substance use treatment application (fillable PDF: date fields, a patient header on each page)",
    "folder": "youth-substance-use-application",
    "eform": "youth_substance_use_application.html",
    "images": ["youth_substance_use_application_page1.png", "youth_substance_use_application_page2.png", "youth_substance_use_application_page3.png", "youth_substance_use_application_page4.png"],
    "pdf": "youth-substance-use-treatment-application.pdf",
    "skip": [
      {"test": "tags", "page": 1, "region": [870, 722, 240, 52], "reason": "\"Gender Identity\": the PDF names the field \"gender\", which elsewhere is the patient's sex; the page's own label isn't read when the PDF's name gives a tag"},
      {"test": "tags", "page": 4, "region": [1080, 1796, 295, 56], "reason": "\"Designation / College ID #\": OCR reads only \"Designation\" on this page (on page 3 it reads the whole label, which gets current_user_cpsid)"}
    ]
  }
];
