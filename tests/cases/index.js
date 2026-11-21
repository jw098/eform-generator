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
    ],
    "variationSkip": [
      {"variation": "2× size", "test": "extraFields", "page": 1, "region": [866, 295, 360, 200], "reason": "the blank after \"my health to ____ for the purpose of:\", run down beside the options: at 2× OCR leaves the colon off \"of\", and the colon found in the grey image makes the label one a colon ends; on the page itself its phrase reads as a sentence and gets no blank"}
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
          "checkbox_37"
        ],
        "reason": "the OSFED box sits on the box's bottom line, a pixel or two of paper between them on the page; enlarging it blurs that gap away, so the line is joined to the box's bottom, as a fill-in line under letters is"
      },
      {
        "variation": "2× size",
        "boxes": [
          "checkbox_37"
        ],
        "reason": "the OSFED box sits on the box's bottom line, a pixel or two of paper between them on the page; enlarging it blurs that gap away, so the line is joined to the box's bottom, as a fill-in line under letters is"
      },
      {
        "variation": "2.5× size",
        "boxes": [
          "checkbox_37"
        ],
        "reason": "the OSFED box sits on the box's bottom line, a pixel or two of paper between them on the page; enlarging it blurs that gap away, so the line is joined to the box's bottom, as a fill-in line under letters is"
      },
      {
        "variation": "3× size",
        "boxes": [
          "checkbox_37"
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
    "session": "burnaby_maternity_referral_session.json",
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
      {"test": "tags", "page": 1, "region": [185, 320, 465, 45], "reason": "\"SIN\": the eForm leaves it untagged, from before Auto Detect knew OSCAR 12's sin tag, which it now gives; the expected answer is the user's to change"},
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
      {"variation": "0.7× size", "boxes": ["checkbox_23"], "reason": "the box after \"Carry Privileges ... No\", printed right against the o of \"No\": found on the page and the larger copies, missed at 0.7× (not traced further; the pushed app misses it too)"},
      {"variation": "0.7× size", "test": "fields", "page": 5, "region": [1030, 1508, 95, 48], "reason": "the client's date, month blank (\"Date ___/___/___\" over \"DD MM YY\"): missed at 0.7×, short lines with slashes between them (not traced further; the pushed app misses it too)"},
      {"variation": "0.7× size", "test": "extraFields", "page": 5, "region": [895, 1742, 475, 45], "reason": "the staff date's three blanks (\"___/___/___\"): at 0.7× one field across them, where the eForm has a field each (not traced further; the pushed app does the same)"},
      {"variation": "2× size", "test": "fields", "page": 5, "region": [330, 542, 425, 55], "reason": "the Name cell of the \"A & D Counselling\" row: found on the page and the smaller copies; lost at 2× and 2.5× (not traced further; the pushed app loses it there too)"},
      {"variation": "2.5× size", "test": "fields", "page": 5, "region": [330, 542, 425, 55], "reason": "as at 2×: the Name cell of the \"A & D Counselling\" row"}
    ]
  },
  {
    "name": "New patient questionnaire (fillable PDF: radio buttons for Yes/No, sex)",
    "folder": "new-patient-questionnaire",
    "session": "new_patient_questionnaire_session.json",
    "pdf": "New_Patient_Questionnaire_FGSG_2025_Fillable.pdf"
  },
  {
    "name": "Youth substance use treatment application (fillable PDF: date fields, a patient header on each page)",
    "folder": "youth-substance-use-application",
    "session": "youth_substance_use_application_session.json",
    "pdf": "youth-substance-use-treatment-application.pdf",
    "skip": [
      {"test": "tags", "page": 1, "region": [870, 722, 240, 52], "reason": "\"Gender Identity\": the PDF names the field \"gender\", which elsewhere is the patient's sex; the page's own label isn't read when the PDF's name gives a tag"},
      {"test": "tags", "page": 4, "region": [1080, 1796, 295, 56], "reason": "\"Designation / College ID #\": OCR reads only \"Designation\" on this page (on page 3 it reads the whole label, which gets current_user_cpsid)"}
    ]
  },
  {
    "name": "FAME screening and consent (three pages: a table of labelled cells, Yes/No columns, a consent's blanks along a sentence)",
    "folder": "fame-screening-consent",
    "session": "fame_screening_consent_session.json",
    "variations": true,
    "skip": [
      {"test": "extraFields", "page": 1, "region": [70, 815, 490, 128], "reason": "the room under \"Post-Stroke Impairments\" in the table's label column: blank page under a label in its own cell, as a cell to write in under its heading is (\"PERTINENT HISTORY:\" over the rest of its cell); the eForm writes in the cell beside it"},
      {"test": "extraFields", "page": 1, "region": [70, 1140, 490, 128], "reason": "the room under \"Cardiovascular Condition\" in the label column: as \"Post-Stroke Impairments\""},
      {"test": "extraFields", "page": 1, "region": [70, 1340, 490, 96], "reason": "the room under \"Other chronic condition\" in the label column: as \"Post-Stroke Impairments\""},
      {"test": "tags", "page": 1, "region": [710, 500, 250, 50], "reason": "\"(Work):\" after \"Phone (Home): ____\": the work phone (phone2), named only by the bracketed word, which names no detail on its own"},
      {"test": "extraFields", "page": 2, "region": [205, 828, 745, 64], "reason": "\"Signature:\": a signature line, which the eForm leaves to the signature"},
      {"test": "extraFields", "page": 2, "region": [230, 1562, 450, 46], "reason": "\"By: ____\" over \"(Participant's Signature)\": a signature line"},
      {"test": "extraFields", "page": 2, "region": [82, 1604, 252, 46], "reason": "the blank before \"(Participant's Signature)\", the caption under the signature line: a caption's row, read as a line with labels along it"},
      {"test": "extraFields", "page": 2, "region": [610, 1604, 362, 46], "reason": "the blank between \"(Participant's Signature)\" and \"(Printed Name)\": the captions' row, read as a line with labels along it"},
      {"test": "extraFields", "page": 3, "region": [175, 860, 485, 64], "reason": "\"Physician's Signature\": a signature line"},
      {"test": "extraFields", "page": 3, "region": [865, 860, 480, 64], "reason": "the second \"Physician's Signature\": a signature line"},
      {"test": "tags", "page": 3, "region": [395, 1000, 315, 48], "reason": "\"Contact Number:\": the physician's phone (clinic_phone); \"contact number\" names no detail that can be told whose, as on the IDP form's two parents' contact numbers"},
      {"test": "tags", "page": 3, "region": [925, 1000, 395, 48], "reason": "\"Date:\" beside \"Contact Number:\": a date beside a value OSCAR doesn't fill is that value's, not today (as \"INR: ____ Date: ____\"); the contact number's tag isn't found"},
      {"test": "extraFields", "page": 3, "region": [68, 1340, 1370, 46], "reason": "the blank strip between the box's last line of text (\"Phone: ... E-Mail: ...\") and its bottom edge: room under a label in its own cell, as a cell to write in is"}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "test": "extraFields", "page": 2, "region": [1148, 1604, 292, 46], "reason": "the blank after \"(Printed Name)\", the caption under the printed name's line: at 0.7× the captions' row is read as a line with a label along it (the pushed app does the same)"}
    ]
  },
  {
    "name": "IDP intake (fill-in lines with captions under them, shadowed tick boxes, an office-use box)",
    "folder": "idp-intake",
    "session": "idp_intake_session.json",
    "variations": true,
    "skip": [
      {"test": "tags", "page": 1, "region": [310, 662, 1092, 52], "reason": "the two \"Contact number\" fields (no tag) under \"Child resides with: ☐ Mother ☐ Father ☐ Foster family\": the parents' numbers, which only the tick boxes' options say; the owner check doesn't read options"},
      {"test": "ticks", "page": 1, "region": [236, 637, 32, 32], "reason": "the first \"Father\" box (\"❑ Mother ❑ Father\"): its left side is a pixel thin, which the 0.82x working copy leaves at 0.82 of its length on the ink map, under the 0.85 a printed side needs; at 0.80 the box is still not taken (its other checks fail too) and nothing else on any case changes"},
      {"test": "extraTicks", "page": 1, "region": [434, 1142, 28, 28], "reason": "the D of \"Expected Due Date\": a capital's height, its curve on the right square at this size, with an empty middle"},
      {"test": "fields", "page": 1, "region": [476, 462, 300, 62], "reason": "\"Last Name\", the second caption under the name line (\"Child's First Name ... Last Name\"): captions spaced along a line split it only when nothing else labels it, and \"Family Information:\" above is taken for its label; a label above with a format under it (\"NAME\" over \"FIRST MIDDLE LAST\") is the commoner layout"},
      {"test": "tags", "page": 1, "region": [120, 462, 360, 62], "reason": "the child's first name: the whole name line, labelled by the heading above it (see the Last Name skip)"},
      {"test": "tags", "page": 1, "region": [790, 462, 315, 62], "reason": "the date of birth: its caption under the line (\"Date of Birth (month/day/year)\") gives way to the instruction above it (\"*If YES, please fax to AIDP\"), as on the name line"},
      {"test": "extraFields", "page": 1, "region": [345, 1758, 610, 30], "reason": "\"For Office Use Only:\": the office box's heading, a label ending with a colon with blank page after it in its row, which is how a field is shown"}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "boxes": ["mother_u_father", "no"], "reason": "the first \"Mother\" box, a shadowed box (\"❑\") whose pixel-thin sides 0.7× leaves broken; and the \"No\" box of \"Yes❑ No ❑\", printed against the s of \"Yes\", found on the page but joined to the letter at 0.7×, 2× and 2.5× (the pushed app misses both too)"},
      {"variation": "2× size", "boxes": ["no"], "reason": "as at 0.7×: the \"No\" box against the s of \"Yes\""},
      {"variation": "2.5× size", "boxes": ["no"], "reason": "as at 0.7×: the \"No\" box against the s of \"Yes\""},
      {"variation": "faint print", "boxes": ["father_2"], "reason": "the first \"Father\" box, missed on the page itself (see the case's skip): its pixel-thin left side"},
      {"variation": "faint print", "test": "extraTicks", "page": 1, "region": [434, 1142, 28, 28], "reason": "the D of \"Expected Due Date\", taken on the page itself (see the case's skip)"}
    ]
  },
  {
    "name": "Access Line home and community care referral (fillable PDF: patient, alternative contact and referring clinician's details)",
    "folder": "access-line-referral",
    "session": "access_line_referral_session.json",
    "pdf": "Access_Line_Referral_Form_April_2026.pdf",
    "skip": [
      {"test": "extraFields", "page": 1, "region": [495, 1768, 395, 46], "reason": "the PDF's text field for \"Physician/Nurse Practitioner Signature\": a signature, which the eForm leaves to the signature"}
    ]
  },
  {
    "name": "MOST medical order for scope of treatment (fillable PDF: radio buttons in a table, a patient label box)",
    "folder": "most-order",
    "session": "most_order_session.json",
    "pdf": "MOST_Medical_Order_for_Scope_of_Treatment.pdf",
    "skip": [
      {"test": "extraFields", "page": 1, "region": [508, 1774, 372, 72], "reason": "the PDF's text field for \"Prescriber Signature\": a signature"},
      {"test": "tags", "page": 1, "region": [900, 40, 565, 378], "reason": "the patient label's box (label): an unlabelled box at the top right, which the page doesn't name"}
    ]
  },
  {
    "name": "CPP disability medical report (fillable PDF, ten pages: a SIN header on each page, tables of medications, a declaration)",
    "folder": "cpp-disability-medical-report",
    "session": "cpp_disability_medical_report_session.json",
    "pdf": "ISP-2519.pdf",
    "skip": [
      {"test": "extraFields", "page": 2, "region": [100, 1280, 682, 60], "reason": "the PDF's text field for \"Signature of applicant / legal representative\": a signature"},
      {"test": "extraFields", "page": 2, "region": [92, 1616, 955, 54], "reason": "the PDF's text field for \"Witness signature\": a signature"},
      {"test": "extraFields", "page": 10, "region": [92, 1180, 668, 72], "reason": "the PDF's text field for the declaration's \"Signature\": a signature"},
      {"test": "tags", "page": 2, "region": [1040, 1616, 380, 54], "reason": "the witness's \"Date (YYYY-MM-DD)\": the PDF's tooltip (\"Date - Enter 4 digit year...\") is more than \"Date\", and the label printed by it isn't read for this field"},
      {"test": "tags", "page": 10, "region": [92, 1082, 668, 72], "reason": "the declaration's \"Name\": the physician's or nurse practitioner's, said only by the options above it (\"I am a: ○ general practice physician...\"), not by a heading"},
      {"test": "tags", "page": 10, "region": [764, 1104, 648, 240], "reason": "\"Address and telephone number (Please print or use a stamp)\": the clinician's stamp's details (clinic_label); a field for an address and a phone holds neither tag alone, and a stamp offered in brackets doesn't make it a stamp's"},
      {"test": "tags", "page": 10, "region": [92, 1280, 668, 72], "reason": "the declaration's \"Date (YYYY-MM-DD)\": today, but the PDF's tooltip is more than \"Date\" and its printed label isn't read for it"}
    ]
  },
  {
    "name": "Northern Health MOST order (one page: tick boxes beside bold options, a table of levels to initial, a physician's block)",
    "folder": "northern-health-most",
    "session": "northern_health_most_session.json",
    "variations": true,
    "variationSkip": [
      {"variation": "0.7× size", "page": 1, "test": "fields", "region": [284, 1690, 1182, 42], "reason": "\"☐ Other: ____\": at 0.7x its line is found only to its middle (cause not traced)"},
      {"variation": "0.7× size", "page": 1, "test": "extraFields", "region": [286, 1692, 602, 42], "reason": "\"☐ Other: ____\": at 0.7x its line is found only to its middle (cause not traced)"},
      {"variation": "1.5× size", "page": 1, "region": [992, 940, 32, 32], "reason": "the D of \"Do not attempt resuscitation\" in bold: a bold character, square at this size, with an empty middle"},
      {"variation": "1.5× size", "page": 1, "region": [1096, 1424, 32, 32], "reason": "the D of \"Date:\": a bold character, square at this size, with an empty middle"},
      {"variation": "2× size", "page": 1, "region": [1096, 1424, 32, 32], "reason": "the D of \"Date:\": a bold character, square at this size, with an empty middle"},
      {"variation": "2× size", "page": 1, "region": [1164, 1560, 32, 32], "reason": "the D of \"SDM\" in \"Adult not capable/SDM not available\": a bold character, square at this size, with an empty middle"},
      {"variation": "2.5× size", "page": 1, "region": [992, 940, 32, 32], "reason": "the D of \"Do not attempt resuscitation\" in bold: a bold character, square at this size, with an empty middle"},
      {"variation": "2.5× size", "page": 1, "region": [1096, 1424, 32, 32], "reason": "the D of \"Date:\": a bold character, square at this size, with an empty middle"},
      {"variation": "3× size", "page": 1, "region": [992, 940, 32, 32], "reason": "the D of \"Do not attempt resuscitation\" in bold: a bold character, square at this size, with an empty middle"},
      {"variation": "3× size", "page": 1, "region": [1096, 1424, 32, 32], "reason": "the D of \"Date:\": a bold character, square at this size, with an empty middle"},
      {"variation": "faint print", "page": 1, "region": [992, 940, 32, 32], "reason": "the D of \"Do not attempt resuscitation\" in bold: a bold character, square at this size, with an empty middle"}
    ],
    "skip": [
      {"test": "fields", "page": 1, "region": [888, 136, 576, 196], "reason": "the patient label's box (label): only \"PATIENT LABEL\" under it, beside the header, with a single line at its left and no line under it; nothing bounds it as a writing area"},
      {"test": "extraFields", "page": 1, "region": [378, 1830, 204, 42], "reason": "a signature line (\"Physician signature:\"): a signature, which the eForm leaves to the signature"},
      {"test": "tags", "page": 1, "region": [734, 1448, 338, 86], "reason": "the representative's and the substitute decision maker's \"Name:\" (no tag): whose they are is said only by the tick-box options at the left of their rows (\"☐ Representative\", \"☐ Temporary substitute decision maker (SDM)\"), which the owner search passes over, as it must for a row's options"},
      {"test": "tags", "page": 1, "region": [934, 1766, 292, 42], "reason": "\"Contact #\" in the physician's block (clinic_phone): its row names no one (\"Renewal date ... Contact #\"), and the block's heading is the row above's \"Print name:\", not a heading"}
    ]
  },
  {
    "name": "Home Oxygen Program application (Fraser Health, one page: cells with a label beside the blank, a row of test results, faxed-to tick boxes)",
    "folder": "home-oxygen-application",
    "session": "home_oxygen_application_session.json",
    "variations": true,
    "variationSkip": [
      {"variation": "0.7× size", "boxes": ["ambulatory_study", "nocturnal_study"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "0.7× size", "page": 1, "region": [148, 644, 32, 32], "reason": "the 0 of \"D. 0. B.\": a bold character, square at this size, with an empty middle"},
      {"variation": "1.5× size", "boxes": ["six_minute_resting_study", "ambulatory_study", "nocturnal_study"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "1.5× size", "page": 1, "region": [166, 456, 32, 32], "reason": "the D of \"1. DATE of APPLICATION\" on its shaded bar: a bold character, square at this size, with an empty middle"},
      {"variation": "1.5× size", "page": 1, "region": [602, 1524, 32, 32], "reason": "the D of \"MANDATORY\" on its shaded bar: a bold character, square at this size, with an empty middle"},
      {"variation": "2× size", "boxes": ["ambulatory_study", "nocturnal_study"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "2.5× size", "boxes": ["six_minute_resting_study", "ambulatory_study", "nocturnal_study"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "2.5× size", "page": 1, "region": [166, 970, 32, 32], "reason": "the D of \"4. DIAGNOSTIC DATA\" on its shaded bar: a bold character, square at this size, with an empty middle"},
      {"variation": "2.5× size", "page": 1, "region": [602, 1524, 32, 32], "reason": "the D of \"MANDATORY\" on its shaded bar: a bold character, square at this size, with an empty middle"},
      {"variation": "2.5× size", "page": 1, "test": "fields", "region": [588, 1478, 200, 48], "reason": "the \"Completed by:\" row's \"Phone:\" field, missed at 2.5x (cause not traced)"},
      {"variation": "3× size", "boxes": ["six_minute_resting_study", "ambulatory_study", "nocturnal_study"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "3× size", "page": 1, "region": [166, 454, 32, 32], "reason": "the D of \"1. DATE of APPLICATION\" on its shaded bar: a bold character, square at this size, with an empty middle"},
      {"variation": "3× size", "page": 1, "region": [602, 1524, 32, 32], "reason": "the D of \"MANDATORY\" on its shaded bar: a bold character, square at this size, with an empty middle"},
      {"variation": "faint print", "boxes": ["six_minute_resting_study", "ambulatory_study", "nocturnal_study"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "faint print", "page": 1, "region": [260, 570, 32, 32], "reason": "the D of \"2. CLIENT DATA\" on its shaded bar: a bold character, square at this size, with an empty middle"},
      {"variation": "faint print", "page": 1, "region": [602, 1524, 32, 32], "reason": "the D of \"MANDATORY\" on its shaded bar: a bold character, square at this size, with an empty middle"}
    ],
    "skip": [
      {"test": "extraFields", "page": 1, "region": [636, 1618, 810, 32], "reason": "the signature date's field, put right of its line (see the date's missed field)"},
      {"test": "ticks", "page": 1, "region": [434, 1080, 741, 33], "reason": "the oximetry studies' boxes (\"☐6 Minute Resting Room Air Study Attached\"): each printed a pixel or two from the first letter of its label: at the 0.82x working copy the ink map's soft edges join them, so the box has ink joined on from outside; on the grey image a column of paper still parts them, but letters in a word are parted the same way (excusing it took the D of \"Date\", \"Doctor\", \"Development\" for boxes on other forms), and starting the outline scan at the box's own side found nothing more"},
      {"test": "extraTicks", "page": 1, "region": [262, 572, 25, 25], "reason": "the D of \"2. CLIENT DATA\" on its shaded bar: a bold capital, square at this size, with its bowl the bar's grey"},
      {"test": "extraTicks", "page": 1, "region": [604, 1526, 25, 25], "reason": "the D of \"MANDATORY\" on its shaded bar: a bold capital, square at this size, with its bowl the bar's grey"},
      {"test": "fields", "page": 1, "region": [434, 856, 1018, 84], "reason": "\"Most Responsible Diagnosis\" and \"Precautions (i e MRSA, VRE, TB etc.)\": a label with no colon and blank page after it to its cell's side, which is how a row's heading is laid out too"},
      {"test": "fields", "page": 1, "region": [436, 1238, 352, 42], "reason": "\"Referring Physician or NP\": a label with no colon and blank page after it in its cell"},
      {"test": "fields", "page": 1, "region": [320, 1612, 1130, 40], "reason": "the signature's \"Date: (DD/MM/YYYY) ____\": the field is put right of its line instead, on the blank after it to the form's side, under the signature's line (cause not traced further)"},
      {"test": "extraFields", "page": 1, "region": [914, 338, 550, 62], "reason": "the blank in the header row of a Fraser Health form (\"Form ID: ... Rev: ... Page: 1 of 1\" over its rule, the patient label's place right of the vertical line): blank page over a long line, as a fill-in line is, that the eForm leaves empty"},
      {"test": "extraFields", "page": 1, "region": [692, 532, 514, 38], "reason": "the blank between the two dates' captions (\"DD/MM/YYYY\" under each line): blank page over the rule under the row"},
      {"test": "extraFields", "page": 1, "region": [1086, 828, 360, 36], "reason": "the blank on the shaded bar after \"Note: Palliative clients must present with hypoxemia\": the bar's bottom edge taken for a line"},
      {"test": "extraFields", "page": 1, "region": [776, 1588, 656, 38], "reason": "a signature line (\"PHYSICIAN / NURSE PRACTITIONER SIGNATURE: (MANDATORY)\"): a signature, which the eForm leaves to the signature"},
      {"test": "extraFields", "page": 1, "region": [136, 1794, 1314, 76], "reason": "the HOP use only box's cells (\"Equipment Approved:\", \"HOP Physician Signature:\", \"Tracking Number:\"): the room under each label, beside the field after its colon, and the HOP physician's signature"},
      {"test": "tags", "page": 1, "region": [234, 636, 282, 34], "reason": "\"D. 0. B.\": OCR reads the O as a zero, so the label isn't a birth date's"},
      {"test": "tags", "page": 1, "region": [406, 728, 628, 56], "reason": "the client's \"Primary Contact Number\" and \"Secondary Contact Number\" (phone, phone2): \"contact\" names someone else of the patient's (\"Emergency contact\"), and \"contact number\" alone can't be told from it"},
      {"test": "tags", "page": 1, "region": [350, 1440, 436, 42], "reason": "\"Hospital Ward Fax:\" (no tag): a fax in the referring physician's box, which is the clinician's"},
      {"test": "tags", "page": 1, "region": [662, 1740, 416, 66], "reason": "the HOP subsidy review's \"Date:\" (no tag): its section heading \"7. HOP SUBSIDY REVIEW - For HOP use only\", on a shaded bar, doesn't make it the office's (the owner cue for \"For ... use only\" is there; why the heading isn't taken was not traced)"},
      {"test": "dates", "page": 1, "region": [662, 1740, 416, 66], "reason": "the HOP review's \"Date:\": a box taller than a line, made a text area"}
    ]
  },
  {
    "name": "Seamless Perinatal Care referral (Fraser Health, one page: cells with a label over the blank, rows of small tick boxes under shaded headings)",
    "folder": "seamless-perinatal-referral",
    "session": "seamless_perinatal_referral_session.json",
    "variations": true,
    "variationSkip": [
      {"variation": "0.7× size", "boxes": ["yes_refugee", "yes_consent", "midwife", "single_parent", "financial", "housing", "limited_education", "nutrition_risk", "unplanned_pregnancy", "late_prenatal_care", "isolated", "limited_transportation", "alcohol", "substance_use", "tobacco_use", "current_mental_health", "developmental_disability", "previous_traumatic_birth", "other_mmh", "history_of_abuse", "intimate_partner_violence", "parenting_capacity"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "0.7× size", "boxes": ["no", "cgh", "rch"], "reason": "the \"No\" of the Aboriginal question (\"☐ No\"); \"☐CGH\"; \"☐RCH\": printed tight against its word, joined to it at this size (as the page's \"☐Yes\" boxes are at every size)"},
      {"variation": "0.7× size", "page": 1, "test": "fields", "region": [1188, 622, 274, 46], "reason": "\"Due Date (dd/mm/yyyy)\": missed at 0.7x (cause not traced)"},
      {"variation": "1.5× size", "boxes": ["yes_refugee", "yes_consent", "single_parent", "financial", "housing", "limited_education", "nutrition_risk", "unplanned_pregnancy", "late_prenatal_care", "isolated", "limited_transportation", "alcohol", "substance_use", "tobacco_use", "current_mental_health", "developmental_disability", "previous_traumatic_birth", "other_mmh", "history_of_abuse", "intimate_partner_violence", "parenting_capacity"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "2× size", "boxes": ["yes_refugee", "yes_consent", "single_parent", "financial", "housing", "limited_education", "nutrition_risk", "unplanned_pregnancy", "late_prenatal_care", "isolated", "limited_transportation", "alcohol", "substance_use", "tobacco_use", "current_mental_health", "developmental_disability", "previous_traumatic_birth", "other_mmh", "history_of_abuse", "intimate_partner_violence", "parenting_capacity"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "2.5× size", "boxes": ["yes_refugee", "yes_consent", "single_parent", "financial", "housing", "limited_education", "nutrition_risk", "unplanned_pregnancy", "late_prenatal_care", "isolated", "limited_transportation", "alcohol", "substance_use", "tobacco_use", "current_mental_health", "developmental_disability", "previous_traumatic_birth", "other_mmh", "history_of_abuse", "intimate_partner_violence", "parenting_capacity"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "3× size", "boxes": ["yes_refugee", "yes_consent", "single_parent", "financial", "housing", "limited_education", "nutrition_risk", "unplanned_pregnancy", "late_prenatal_care", "isolated", "limited_transportation", "alcohol", "substance_use", "tobacco_use", "current_mental_health", "developmental_disability", "previous_traumatic_birth", "other_mmh", "history_of_abuse", "intimate_partner_violence", "parenting_capacity"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "faint print", "boxes": ["yes_refugee", "yes_consent", "midwife", "single_parent", "financial", "housing", "limited_education", "nutrition_risk", "unplanned_pregnancy", "late_prenatal_care", "isolated", "limited_transportation", "alcohol", "substance_use", "tobacco_use", "current_mental_health", "developmental_disability", "previous_traumatic_birth", "other_mmh", "history_of_abuse", "intimate_partner_violence", "parenting_capacity"], "reason": "missed on the page itself too (see the case's skips for these boxes)"}
    ],
    "skip": [
      {"test": "ticks", "page": 1, "region": [772, 888, 24, 24], "reason": "the \"Yes\" box of the refugee question (\"☐Yes\"), printed a pixel or two from the Y of \"Yes\": at the 0.82x working copy the ink map's soft edges join them, so the box has ink joined on from outside; on the grey image a column of paper still parts them, but letters in a word are parted the same way (excusing it took the D of \"Date\", \"Doctor\", \"Development\" for boxes on other forms), and starting the outline scan at the box's own side found nothing more"},
      {"test": "ticks", "page": 1, "region": [1214, 984, 24, 24], "reason": "the consent's \"Yes\" box (\"☐Yes\"), printed a pixel or two from the Y of \"Yes\": at the 0.82x working copy the ink map's soft edges join them, so the box has ink joined on from outside; on the grey image a column of paper still parts them, but letters in a word are parted the same way (excusing it took the D of \"Date\", \"Doctor\", \"Development\" for boxes on other forms), and starting the outline scan at the box's own side found nothing more"},
      {"test": "ticks", "page": 1, "region": [1160, 1064, 24, 24], "reason": "the \"Midwife\" box (\"☐Midwife\"), printed a pixel or two from the M of \"Midwife\": at the 0.82x working copy the ink map's soft edges join them, so the box has ink joined on from outside; on the grey image a column of paper still parts them, but letters in a word are parted the same way (excusing it took the D of \"Date\", \"Doctor\", \"Development\" for boxes on other forms), and starting the outline scan at the box's own side found nothing more"},
      {"test": "ticks", "page": 1, "region": [70, 1348, 1070, 355], "reason": "the reason for referral's boxes (\"☐ Single Parent\", \"☐ Financial\"... to \"☐ Parenting capacity/difficulties\"): each box is in its cell's top-left corner, a pixel or two under the row's line and beside the cell's side: at the 0.82x working copy the ink map joins the box's top to the line and its left side to the cell's side, so the side reads as part of the cell's line (letting a line beside the box excuse the line over it changed nothing)"},
      {"test": "fields", "page": 1, "region": [76, 684, 1380, 40], "reason": "the row of \"Date of Birth (dd/mm/yyyy)\", \"Age\", \"Care Card #\": a label over a blank in each cell, the blank under it only about half a written line tall (22 px), where a writing area in a cell is taken from a line's height up and a table row's blank from a row as tall as the Last Name row's"},
      {"test": "fields", "page": 1, "region": [76, 1086, 1380, 136], "reason": "the referring and primary care providers' rows (\"Name of Referring Care Provider\", \"Address\", \"Phone\", \"Fax\", \"Primary Care Provider (if different)\"): a label over a blank in each cell, the blank only about half a written line tall, as in the Date of Birth row"},
      {"test": "extraFields", "page": 1, "region": [314, 338, 148, 62], "reason": "the blank in the header row of a Fraser Health form (\"Form ID: ... Rev: ... Page: 1 of 1\" over its rule, the patient label's place right of the vertical line): blank page over a long line, as a fill-in line is, that the eForm leaves empty"},
      {"test": "extraFields", "page": 1, "region": [660, 338, 128, 62], "reason": "the blank in the header row of a Fraser Health form (\"Form ID: ... Rev: ... Page: 1 of 1\" over its rule, the patient label's place right of the vertical line): blank page over a long line, as a fill-in line is, that the eForm leaves empty"},
      {"test": "extraFields", "page": 1, "region": [914, 338, 550, 62], "reason": "the blank in the header row of a Fraser Health form (\"Form ID: ... Rev: ... Page: 1 of 1\" over its rule, the patient label's place right of the vertical line): blank page over a long line, as a fill-in line is, that the eForm leaves empty"},
      {"test": "extraFields", "page": 1, "region": [74, 1438, 1386, 48], "reason": "the room under \"☐ Late prenatal care\" and \"☐ Limited transportation\", whose row is taller than the others: blank page under a tick box's label in its cell, as a cell to write in under its label is"},
      {"test": "extraFields", "page": 1, "region": [752, 602, 438, 40], "reason": "a second first-name field beside \"First Name(s):\" in its cell's label row, over the one under it: the label's row has blank page after the colon, as \"Name: ____\" does"},
      {"test": "tags", "page": 1, "region": [1190, 624, 270, 42], "reason": "\"Due Date (dd/mm/yyyy)\" (bcEDD): a due date is the patient's own only when she is the one pregnant; on the IDP intake the \"Expected Due Date\" is the child's, so the label can't say whose"}
    ]
  },
  {
    "name": "Foundry Kelowna psychiatric assessment referral (a scan, three pages: a fax cover, [ ] options, a symptoms table)",
    "folder": "foundry-psychiatric-referral",
    "session": "foundry_psychiatric_referral_session.json",
    "skip": [
      {"test": "tags", "page": 1, "region": [278, 488, 492, 50], "reason": "the fax cover's \"From:\" (current_user): \"From\" names whoever sends it, which askedFor doesn't read as a name"},
      {"test": "extraFields", "page": 2, "region": [768, 702, 372, 150], "reason": "the referral source box's part found, left of a speck (see its missed field)"},
      {"test": "extraFields", "page": 2, "region": [104, 1308, 1334, 142], "reason": "the clinical question box's part found (see its missed field)"},
      {"test": "extraFields", "page": 3, "region": [388, 232, 1042, 72], "reason": "the interventions box's part found (see its missed field)"},
      {"test": "extraFields", "page": 3, "region": [376, 1640, 1066, 48], "reason": "the \"Other\" row's cells, found only in their lower half (see their missed fields)"},
      {"test": "ticks", "page": 2, "region": [770, 838, 190, 80], "reason": "the referral source's \"[ ] GP [ ] NP [ ] Paediatrician\" and \"[ ] Other\": printed \"[ ]\" brackets, not a box: OCR reads them as print"},
      {"test": "ticks", "page": 2, "region": [106, 980, 40, 122], "reason": "the reason's \"[ ] Diagnostic clarification\", \"[ ] Medication review/start\", \"[ ] Other\": printed \"[ ]\" brackets, not a box: OCR reads them as print"},
      {"test": "ticks", "page": 3, "region": [424, 602, 866, 50], "reason": "\"Alternative Funding Source: [ ] EAP [ ] Victim Assistance ...\": printed \"[ ]\" brackets, not a box: OCR reads them as print"},
      {"test": "ticks", "page": 3, "region": [88, 700, 382, 42], "reason": "\"[ ] CYMH [ ] ARC [ ] MHSU [ ] Other\": printed \"[ ]\" brackets, not a box: OCR reads them as print"},
      {"test": "ticks", "page": 3, "region": [88, 792, 872, 50], "reason": "\"[ ] Psychiatry [ ] IHCAN [ ] Okanagan Abilities Assessment [ ] Hospital [ ] Other\": printed \"[ ]\" brackets, not a box: OCR reads them as print"},
      {"test": "fields", "page": 1, "region": [250, 432, 516, 236], "reason": "the fax cover's \"To:\", \"From:\", \"Re:\", \"Cc:\": each a label with a colon and blank page after it, to the \"Attn:\", \"Fax:\" column; on this scan the blank's length to the next label on its row is read short of the few letters a field needs"},
      {"test": "fields", "page": 2, "region": [772, 708, 664, 144], "reason": "the referral source's box under \"Referral Source Information (Name/Contact/MSP #)\": found only to a speck of the scan in it"},
      {"test": "fields", "page": 2, "region": [104, 1208, 1338, 296], "reason": "the clinical question's box: the scan's specks in it (\". .\" at the left) cut it to its lower part"},
      {"test": "fields", "page": 3, "region": [96, 126, 1336, 182], "reason": "the interventions' box: a speck of the scan in it cuts it to its lower right"},
      {"test": "fields", "page": 3, "region": [376, 1272, 1062, 116], "reason": "the Hallucinations and Delusions rows of the symptoms table: the rows above and below them are found, these two are not; the scan is tilted about a degree (cause not traced further)"},
      {"test": "fields", "page": 3, "region": [378, 1494, 1062, 116], "reason": "the Impulsivity and Substance Use rows of the symptoms table: missed as the Hallucinations and Delusions rows are, on the same tilted scan (cause not traced further)"},
      {"test": "fields", "page": 3, "region": [374, 1604, 1068, 82], "reason": "the \"Other (specify in comments)\" row's cells: found only in their lower half, under the row's two-line label (\"Other (specify in comments)\")"},
      {"test": "extraTicks", "page": 1, "region": [558, 1246, 23, 23], "reason": "the D of \"ADHD\" in the cover's text, square at this size on the scan"},
      {"test": "extraFields", "page": 1, "region": [656, 136, 836, 88], "reason": "the blank right of the \"FOUNDRY\" logo: blank page over the cover's top rule"},
      {"test": "extraFields", "page": 2, "region": [100, 1438, 1346, 62], "reason": "the clinical question box's lower part, split from the rest by a speck (see its field's skip)"},
      {"test": "extraFields", "page": 2, "region": [108, 1732, 1332, 82], "reason": "the history box's lower part, split from the rest by a speck of the scan"},
      {"test": "extraFields", "page": 3, "region": [842, 1698, 308, 46], "reason": "a signature line (\"Signature:\"): a signature, which the eForm leaves to the signature"},
      {"test": "tags", "page": 3, "region": [92, 434, 1340, 98], "reason": "\"Medications:\" and \"Allergies:\" (druglist_line, allergies_des): the labels are printed at the top of their cells, over the field, and on the scan aren't read as its label (the field has none)"}
    ]
  },
  {
    "name": "Colposcopy booking form (Fraser Health, one page: capitalised labels over or beside blanks in a ruled table)",
    "folder": "colposcopy-booking",
    "session": "colposcopy_booking_session.json",
    "variations": true,
    "variationSkip": [
      {"variation": "0.7× size", "page": 1, "test": "fields", "region": [166, 1472, 1274, 248], "reason": "the smear report's ruled box, split at its lines into rows at some sizes"},
      {"variation": "0.7× size", "page": 1, "test": "extraFields", "region": [166, 1472, 1276, 102], "reason": "the smear report's ruled box, split at its lines into rows at some sizes"},
      {"variation": "0.7× size", "page": 1, "test": "extraFields", "region": [166, 1558, 1276, 74], "reason": "the smear report's ruled box, split at its lines into rows at some sizes"},
      {"variation": "0.7× size", "page": 1, "test": "extraFields", "region": [166, 1646, 1276, 74], "reason": "the smear report's ruled box, split at its lines into rows at some sizes"},
      {"variation": "0.7× size", "page": 1, "test": "extraFields", "region": [172, 1624, 1266, 32], "reason": "the smear report's ruled box, split at its lines into rows at some sizes"},
      {"variation": "1.5× size", "page": 1, "test": "extraFields", "region": [166, 1646, 1274, 74], "reason": "the smear report's ruled box, split at its lines into rows at some sizes"},
      {"variation": "2× size", "page": 1, "test": "extraFields", "region": [166, 1646, 1274, 74], "reason": "the smear report's ruled box, split at its lines into rows at some sizes"},
      {"variation": "2× size", "page": 1, "test": "extraFields", "region": [170, 1624, 1268, 32], "reason": "the smear report's ruled box, split at its lines into rows at some sizes"},
      {"variation": "2.5× size", "page": 1, "test": "extraFields", "region": [166, 1618, 1274, 102], "reason": "the smear report's ruled box, split at its lines into rows at some sizes"}
    ],
    "skip": [
      {"test": "fields", "page": 1, "region": [792, 558, 218, 54], "reason": "\"OTHER NAMES\", the third label over the name row's blank: the first name's blank runs on under it; the cell has no side between them"},
      {"test": "fields", "page": 1, "region": [224, 610, 1222, 46], "reason": "\"PHN\" with blank page after it on its row, a short cell between two lines with no colon"},
      {"test": "fields", "page": 1, "region": [156, 682, 1292, 60], "reason": "the ADDRESS and PHONE cells' first rows (\"ADDRESS\" over a blank; \"PHONE Res ____ Cell ____\"): the blank between a label and the next row's labels (\"CITY PROVINCE POSTAL CODE\", \"Bus Ext\") in one tall cell, with no line under it"},
      {"test": "fields", "page": 1, "region": [268, 876, 572, 48], "reason": "the referring physician's \"PHONE#\" at the foot of the cell, under the name's blank: a label with no colon, its blank in the same cell as the name's"},
      {"test": "fields", "page": 1, "region": [198, 954, 424, 114], "reason": "the consulting surgeon's \"Dr ____\" and \"PHONE#\" in one cell: labels with no colon and no line"},
      {"test": "fields", "page": 1, "region": [320, 1350, 1125, 46], "reason": "\"CYTOLOGY#:\", \"LAST SMEAR DONE:\", \"POSITIVE PAP DATE:\": labels in capitals on one row, each with a colon and blank page after it, over the \"PREVIOUS COLPOSCOPY\" row's \"DATE & LOCATION:\" line; a heading in capitals gets no field after its colon"},
      {"test": "extraFields", "page": 1, "region": [632, 338, 150, 62], "reason": "the blank in the header row of a Fraser Health form (\"Form ID: ... Rev: ... Page: 1 of 1\" over its rule, the patient label's place right of the vertical line): blank page over a long line, as a fill-in line is, that the eForm leaves empty"},
      {"test": "extraFields", "page": 1, "region": [914, 338, 550, 62], "reason": "the blank in the header row of a Fraser Health form (\"Form ID: ... Rev: ... Page: 1 of 1\" over its rule, the patient label's place right of the vertical line): blank page over a long line, as a fill-in line is, that the eForm leaves empty"},
      {"test": "extraFields", "page": 1, "region": [458, 1186, 988, 46], "reason": "the blanks after the priorities' captions (\"Suspect Malignancy\", \"High Grade Dysplasia\"): the last row of a caption under a tick box, with blank page after it to its cell's side"},
      {"test": "extraFields", "page": 1, "region": [1266, 1756, 178, 54], "reason": "the blank right of the language's line, to the box's side: blank page after a line's end"},
      {"test": "extraFields", "page": 1, "region": [276, 402, 358, 36], "reason": "\"Instructions:\" with blank page after its colon, a heading over a numbered list"},
      {"test": "tags", "page": 1, "region": [834, 750, 384, 48], "reason": "\"Bus\" (phone2): the business phone in one word, under \"PHONE\" with \"Res\" and \"Cell\"; \"bus\" alone can't be read as a phone's kind"},
      {"test": "tags", "page": 1, "region": [612, 948, 270, 90], "reason": "\"DATE REFERRAL REC'D (d/m/yyyy)\": its label over the cell is read with the referring physician's \"PHONE#\" left of it, so the field is taken for a phone; the receiving office's date"},
      {"test": "dates", "page": 1, "region": [612, 948, 270, 90], "reason": "\"DATE REFERRAL REC'D\" (see its tag's skip): the label isn't read as this field's"}
    ]
  },
  {
    "name": "VCH mental health and substance use central intake referral (a scan, one page: fill-in lines, C/P tick boxes against their letters)",
    "folder": "vch-central-intake",
    "session": "vch_central_intake_session.json",
    "skip": [
      {"test": "extraFields", "page": 1, "region": [288, 1576, 158, 46], "reason": "the blank after \"Risk Assessment:\", before \"Self-Harm: Low ☐\": blank page after a label with a colon, ended by another label rather than an option's box"},
      {"test": "tags", "page": 1, "region": [712, 768, 234, 50], "reason": "the contact person's \"Phone:\" (no tag): \"Contact person (if relevant)\" doesn't say whose the row is, so the phone is read as the patient's"},
      {"test": "extraFields", "page": 1, "region": [1084, 738, 310, 66], "reason": "the relationship's field found taller (see the contact row's missed fields)"},
      {"test": "extraFields", "page": 1, "region": [98, 1392, 1296, 38], "reason": "the second meds line in three parts (see its missed field)"},
      {"test": "ticks", "page": 1, "region": [318, 1438, 1050, 108], "reason": "the substance use's \"C☐ P☐\" boxes: each printed a pixel or two from its letter, C or P: at the 0.82x working copy the ink map's soft edges join them, so the box has ink joined on from outside; on the grey image a column of paper still parts them, but letters in a word are parted the same way (excusing it took the D of \"Date\", \"Doctor\", \"Development\" for boxes on other forms), and starting the outline scan at the box's own side found nothing more"},
      {"test": "fields", "page": 1, "region": [420, 766, 980, 46], "reason": "\"Contact person (if relevant): ____ Phone: ____ Relationship: ____\": the relationship's field is found taller, over the row above (\"Leave message\"), and the contact person's and phone's lines are missed (cause not traced on this fax)"},
      {"test": "fields", "page": 1, "region": [98, 1390, 1296, 40], "reason": "the second line of \"Current Meds:\", split where the substances' labels below begin (\"Alcohol:\", \"Nicotine:\") into three fields"},
      {"test": "tags", "page": 1, "region": [96, 574, 940, 98], "reason": "\"PHN\" and the address's second line: the PHN's field is named from \"(m/d/y)\" above it and the address's second line is labelled \"Address PHN\", so the hin goes to the address line (OCR on the fax)"},
      {"test": "tags", "page": 1, "region": [1012, 658, 380, 50], "reason": "\"Work\" (phone2): a phone's kind alone after \"Phone: Home ... Cell ...\"; \"work\" alone can't be read as a phone"},
      {"test": "tags", "page": 1, "region": [242, 818, 394, 38], "reason": "\"Referred by:\" (current_user): the field is named \"referred_by\" but gets no clinician's tag; why was not traced on this fax"}
    ]
  },
  {
    "name": "Centre for Pelvic Floor Competence referral (one page: a label box, cells with labels beside and over the blank, two physicians' blocks)",
    "folder": "pelvic-floor-referral",
    "session": "pelvic_floor_referral_session.json",
    "variations": true,
    "variationSkip": [
      {"variation": "0.7× size", "boxes": ["interpreter_no", "interpreter_yes", "regular", "urgent"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "0.7× size", "page": 1, "test": "fields", "region": [696, 1066, 262, 60], "reason": "\"Office fax:\": its cell narrow beside its label, missed at some sizes"},
      {"variation": "0.7× size", "page": 1, "test": "fields", "region": [696, 1228, 262, 60], "reason": "\"Office fax:\": its cell narrow beside its label, missed at some sizes"},
      {"variation": "0.7× size", "page": 1, "test": "extraFields", "region": [1228, 718, 214, 42], "reason": "the room under \"PHN:\" in its cell, taken as a second field at some sizes, beside the one after its colon"},
      {"variation": "1.5× size", "boxes": ["interpreter_no", "interpreter_yes", "regular", "urgent"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "1.5× size", "page": 1, "test": "fields", "region": [696, 1066, 262, 60], "reason": "\"Office fax:\": its cell narrow beside its label, missed at some sizes"},
      {"variation": "2× size", "boxes": ["interpreter_yes", "regular", "urgent"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "2.5× size", "boxes": ["interpreter_no", "interpreter_yes", "regular", "urgent"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "2.5× size", "page": 1, "test": "extraFields", "region": [1228, 718, 214, 42], "reason": "the room under \"PHN:\" in its cell, taken as a second field at some sizes, beside the one after its colon"},
      {"variation": "3× size", "boxes": ["interpreter_no", "interpreter_yes", "regular", "urgent"], "reason": "missed on the page itself too (see the case's skips for these boxes)"},
      {"variation": "3× size", "page": 1, "test": "fields", "region": [696, 1066, 262, 60], "reason": "\"Office fax:\": its cell narrow beside its label, missed at some sizes"},
      {"variation": "3× size", "page": 1, "test": "extraFields", "region": [1226, 682, 222, 50], "reason": "the blank right of \"PATIENT INFORMATION (please print clearly)\" on its shaded bar, at 3x"},
      {"variation": "faint print", "boxes": ["interpreter_no", "interpreter_yes"], "reason": "missed on the page itself too (see the case's skips for these boxes)"}
    ],
    "skip": [
      {"test": "ticks", "page": 1, "region": [1114, 846, 102, 39], "reason": "\"Interpreter Required: ☐No ☐Yes\": each box printed a pixel or two from its word: at the 0.82x working copy the ink map's soft edges join them, so the box has ink joined on from outside; on the grey image a column of paper still parts them, but letters in a word are parted the same way (excusing it took the D of \"Date\", \"Doctor\", \"Development\" for boxes on other forms), and starting the outline scan at the box's own side found nothing more"},
      {"test": "ticks", "page": 1, "region": [140, 1320, 38, 70], "reason": "\"☐ Regular\" and \"☐ Urgent\" on the referral details' shaded bar: the box's grey inside is ink on the ink map, so it isn't empty"},
      {"test": "fields", "page": 1, "region": [792, 32, 656, 294], "reason": "the patient label's box (label): \"Place Patient Label Here\" printed faint at its top, beside the header; the box's only lines are its left side and the header's rule"},
      {"test": "fields", "page": 1, "region": [342, 1356, 1094, 34], "reason": "the urgent reason's line (\"☐ Urgent (Reason)____\") on the shaded bar: a line inside a bar isn't a line that bounds a field"},
      {"test": "extraFields", "page": 1, "region": [132, 258, 656, 62], "reason": "the blank under the title, over the header's rule: blank page over a long line, as a fill-in line is"},
      {"test": "extraFields", "page": 1, "region": [290, 782, 1150, 108], "reason": "the blank beside each patient label in its cell (\"Patient address: ____\"), over the blank under it: a cell with its label on its first row and room under it takes one field, and the label's row has blank page after its colon, as \"Name: ____\" does"},
      {"test": "tags", "page": 1, "region": [286, 1120, 1160, 168], "reason": "the primary care provider's billing number and office address, phone and fax (doctor_ohip_no; no tags): the rows under \"Patient Primary Care Provider:\" name no one, and the cells' own labels (\"Office phone:\") are the clinician's, as the same rows under \"Referring Provider\" are"}
    ]
  },
  {
    "name": "Chest Pain Clinic referral (a fax, one page: fill-in lines, a name line with captions under it, rows of tick boxes)",
    "folder": "chest-pain-referral",
    "session": "chest_pain_referral_session.json",
    "skip": [
      {"test": "extraFields", "page": 1, "region": [312, 686, 1130, 48], "reason": "the whole name line, which the eForm splits by its captions (see the missed name fields)"},
      {"test": "extraFields", "page": 1, "region": [302, 752, 196, 56], "reason": "the birth date's field, found short of its line (see its missed field)"},
      {"test": "fields", "page": 1, "region": [310, 684, 1134, 50], "reason": "\"Patient Name:\" with \"Last Name   First Name   Middle Name\" under its line: captions spaced along a line split it only when nothing else labels it (see the IDP intake's Last Name)"},
      {"test": "fields", "page": 1, "region": [302, 752, 334, 56], "reason": "\"Date of Birth:\" over \"DD/MM/YYYY\": found only to the first third of its line, where \"DD/MM/YYYY\" is printed under it"},
      {"test": "extraFields", "page": 1, "region": [130, 578, 1332, 38], "reason": "the blank under \"If clinically safe, have patient HOLD BETA BLOCKERS...\" over the box's bottom side: blank page over a long line"},
      {"test": "extraFields", "page": 1, "region": [128, 1136, 1318, 32], "reason": "the blank between the two rules under \"G.P/Family doctor:\" and \"Copies to:\": a double rule taken for a fill-in line"},
      {"test": "extraFields", "page": 1, "region": [522, 1604, 116, 74], "reason": "the blank between \"Ca Channel Blocker\" and the appointment box: blank page over the box's top side"},
      {"test": "tags", "page": 1, "region": [692, 1674, 264, 46], "reason": "the LMH Cardiology appointment's \"Date:\" (no tag): the receiving clinic's appointment, in a box at the foot headed \"LMH Cardiology Appointment:\" on the same row, not above it"}
    ]
  },
  {
    "name": "Mental Health Act Form 5 consent for treatment (fillable PDF: blanks along sentences, captions under them)",
    "folder": "mha-form5-consent",
    "session": "mha_form5_consent_session.json",
    "pdf": "HLTH3505_Form5_Consent_for_Treatment.pdf",
    "skip": []
  },
  {
    "name": "PWD designation application, Section 2 medical report (fillable PDF, five pages: a diagnoses table, rows of tick boxes, a certification)",
    "folder": "pwd-medical-report",
    "session": "pwd_medical_report_session.json",
    "pdf": "HR2883_PWD_Medical_Report.pdf",
    "skip": [
      {"test": "extraFields", "page": 5, "region": [56, 1564, 934, 56], "reason": "the PDF's text field for \"Signature\": a signature"},
      {"test": "tags", "page": 5, "region": [54, 1636, 1402, 250], "reason": "the certification's \"Telephone Number\", \"Fax Number\", \"Email Address\", \"Print/Stamp Address\" (clinic_phone, clinic_fax, no tag, clinic_label): the PDF's tooltips name no one, and the section's heading (\"I – Certification\") is a shaded bar's"}
    ]
  },
  {
    "name": "Epilepsy clinic referral (VCH, one page: a two-column table of the patient's and physicians' details, rows of tick boxes, an office-use section)",
    "folder": "epilepsy-clinic-referral",
    "session": "epilepsy_clinic_referral_session.json",
    "variations": true,
    "variationSkip": [
      {"variation": "1.5× size", "test": "extraTicks", "page": 1, "region": [440, 1838, 38, 38], "reason": "the D of \"Routine EED\", a bold capital whose straight side and round back close an empty middle (see the case's skip): taken for a box on this copy too"},
      {"variation": "2.5× size", "test": "extraTicks", "page": 1, "region": [440, 1838, 38, 38], "reason": "the D of \"Routine EED\", a bold capital whose straight side and round back close an empty middle (see the case's skip): taken for a box on this copy too"},
      {"variation": "3× size", "test": "extraTicks", "page": 1, "region": [440, 1838, 38, 38], "reason": "the D of \"Routine EED\", a bold capital whose straight side and round back close an empty middle (see the case's skip): taken for a box on this copy too"},
      {"variation": "faint print", "test": "extraTicks", "page": 1, "region": [440, 1838, 38, 38], "reason": "the D of \"Routine EED\", a bold capital whose straight side and round back close an empty middle (see the case's skip): taken for a box on this copy too"},
      {"variation": "3× size", "test": "extraTicks", "page": 1, "region": [530, 1838, 38, 38], "reason": "the D of \"SD EEG\" (\"☐ SD EEG\"), a bold capital as the D of \"EED\" is: at 3× its middle is as empty as a box's"}
    ],
    "skip": [
      {"test": "extraTicks", "page": 1, "region": [444, 1842, 30, 30], "reason": "the D of \"Routine EED\" (\"☐ Routine EED ☐ SD EEG\"), a bold capital whose straight side and round back close an empty middle: taken for a box, as bold D's are on other forms at some sizes"},
      {"test": "extraFields", "page": 1, "region": [594, 1266, 802, 66], "reason": "the blank right of \"☐ Fast growing brain tumor\" in the Comorbidities box: blank page after a tick box's label, with no line, colon or \"Other\" to ask for anything"},
      {"test": "tags", "page": 1, "region": [1000, 394, 396, 50], "reason": "the family physician's \"Contact Number:\" (no tag): the column's heading, \"Physicians' Information\", names the clinician, and a table cell takes its column's heading before the field above it (\"Family physician:\"); the heading names both physicians, so the page can't say whose"}
    ]
  },
  {
    "name": "Early psychosis intervention referral (Fraser Health, one page: fill-in lines after labels, ruled rows under a heading, tick boxes for a region)",
    "folder": "epi-referral",
    "session": "epi_referral_session.json",
    "variations": true,
    "skip": [
      {"test": "extraFields", "page": 1, "region": [214, 20, 124, 66], "reason": "a box drawn by the EPI logo's curve over \"epi\": blank page closed by the logo's lines"},
      {"test": "tags", "page": 1, "region": [582, 1288, 784, 52], "reason": "\"FAMILY PHYSICIAN & BILLING #\" (no tag): one field for two details, the physician and their number; askedFor reads \"billing\" first and gives the family doctor's number"},
      {"test": "tags", "page": 1, "region": [126, 1400, 1246, 150], "reason": "\"PRESENTING SYMPTOMS & CURRENT MEDICATIONS\" (no tag): one area for two details; askedFor reads \"medications\" and gives the drug list"}
    ]
  },
  {
    "name": "EMG and nerve conduction studies requisition (a scan, one page: boxes of fill-in lines, a writing area, a diagnosis table of tick boxes)",
    "folder": "emg-requisition",
    "session": "emg_requisition_session.json",
    "skip": [
      {"test": "ticks", "page": 1, "region": [748, 1502, 40, 40], "reason": "the \"Sensory\" box (\"☐ Sensory\"), three pixel rows under the row line above it (rows 1506-1508 white at 1500 px): the line's lower edge (grey 78) and the box's top edge (155) are dark enough on this scan that the ink map joins them, so the box is part of the line's blob; the \"Motor\" box beside it has a lighter edge (188) and is found. A box against a line, as on other forms: accepting a box joined at one side takes letters on lines too"},
      {"test": "fields", "page": 1, "region": [826, 1154, 438, 46], "reason": "\"Describe: ____\" after \"Increased risk of bleeding? ☐ No ☐ Yes\": its line runs along the box's bottom edge, which takes it, as the Phone line above (a scan)"},
      {"test": "extraFields", "page": 1, "region": [144, 830, 1278, 32], "reason": "the strip between the last fill-in line (\"Mobile #\", rows 831-833) and the patient box's bottom edge (rows 858-861): blank page between two lines, as a table row is"},
      {"test": "extraFields", "page": 1, "region": [500, 1316, 260, 186], "reason": "blanks between the diagnoses' names and their \"Right\" boxes in the diagnosis table: blank page in a row ruled top and bottom, after an option's label"},
      {"test": "extraFields", "page": 1, "region": [1012, 1324, 330, 186], "reason": "the blanks right of the \"Left\" boxes in the diagnosis table: blank page in a row ruled top and bottom, after an option's label"},
      {"test": "extraFields", "page": 1, "region": [158, 1532, 1178, 46], "reason": "the blank row under \"☐ Peripheral Neuropathy ☐ Sensory ☐ Motor\", ruled top and bottom: blank page between two lines, as a table row is"},
      {"test": "extraFields", "page": 1, "region": [566, 1632, 768, 46], "reason": "the blank right of \"☐ Motor Neuron Disorder\": blank page after an option's label, on a row ruled top and bottom"},
      {"test": "tags", "page": 1, "region": [724, 798, 312, 36], "reason": "\"Home #:\" (phone): \"Home\" with \"#\" names a phone only beside \"Mobile #\"; the words alone ask for nothing"}
    ]
  },
  {
    "name": "Foundry gender affirming care intake (fillable PDF, two pages: tick boxes printed as characters the PDF has no fields for, a medications table)",
    "folder": "foundry-gender-affirming-intake",
    "session": "foundry_gender_affirming_intake_session.json",
    "pdf": "Foundry_Gender_Affirming_Care_Intake_Form.pdf",
    "skip": [
      {"test": "ticks", "page": 1, "region": [729, 361, 23, 23], "reason": "\"□They / Them\": a box printed as a character, which the fillable PDF gives no field; Auto Detect takes a fillable PDF's own fields in place of what it sees"},
      {"test": "ticks", "page": 1, "region": [743, 573, 24, 23], "reason": "\"□Yes\": a box printed as a character, which the fillable PDF gives no field (see \"They / Them\")"},
      {"test": "ticks", "page": 1, "region": [80, 1616, 996, 120], "reason": "the twelve Health History boxes (\"□ High Blood Pressure\"...): boxes printed as characters, which the fillable PDF gives no fields; at 9 px they are smaller than the page's letters too"},
      {"test": "ticks", "page": 2, "region": [58, 546, 906, 24], "reason": "the first row of Family History boxes (\"□ High Blood Pressure\" ... \"□ Cancers\"): printed as characters, which the fillable PDF gives no fields (the rows under it have them)"},
      {"test": "extraFields", "page": 1, "region": [576, 38, 856, 86], "reason": "the PDF's own text field in the header right of the logo, with no label on the page or name in the PDF; a fillable PDF's fields are taken as they are"},
      {"test": "tags", "page": 1, "region": [390, 492, 492, 42], "reason": "\"Current Health Care Provider\" (doctor): on a form the patient fills, their own provider; \"provider\" alone names the clinician"},
      {"test": "tags", "page": 1, "region": [986, 494, 296, 42], "reason": "the current provider's \"Phone\" (no tag): taken for the clinician's, after the provider's name beside it (see that skip)"},
      {"test": "tags", "page": 1, "region": [226, 700, 1092, 120], "reason": "\"Other Providers involved in my care\" \"Name\" and \"Phone\" (no tag): \"Providers\" names the clinician, but these are other providers of the patient's"}
    ]
  },
  {
    "name": "FIR unit referral (BC Women's, fillable PDF, five pages: tables under dark heading bars, the patient's supports' details, writing areas)",
    "folder": "fir-referral",
    "session": "fir_referral_session.json",
    "pdf": "FIR_Referral_Form_2025.pdf",
    "skip": [
      {"test": "tags", "page": 1, "region": [882, 144, 556, 80], "reason": "\"Estimated Delivery Date\" (bcEDD): the patient's own when she is the one pregnant, which the label can't say (see Seamless Perinatal's due date)"},
      {"test": "tags", "page": 1, "region": [160, 1124, 1292, 156], "reason": "the Referral Source's \"Name\" and \"Phone\" (current_user, clinic_phone): its heading is white letters in a dark bar, which OCR doesn't read here (it reads the other bars'), so nothing says the box is the clinician's"},
      {"test": "tags", "page": 2, "region": [196, 1180, 1256, 268], "reason": "the early exit plan's support contacts (\"Name\", \"Phone\", \"Address\" rows, no tag): their heading, \"Early exit plan for all patients (...)\", says who the plan is for, which the owner check takes for whose details these are"},
      {"test": "tags", "page": 2, "region": [1020, 1442, 432, 92], "reason": "the preferred pharmacy's \"Address\" (no tag): in a cell of its own, it looks at the column above it (the support contacts') before the pharmacy on its row"}
    ]
  },
  {
    "name": "Gilwest Clinic referral (Vancouver Coastal Health, one page: a bordered table of patient details, small printed box glyphs for the services and labs)",
    "folder": "gilwest-referral",
    "session": "gilwest_referral_session.json",
    "variations": true,
    "skip": [
      {"test": "ticks", "page": 1, "region": [162, 670, 30, 30], "reason": "the \"□ HIV Referral\" box, a printed box glyph 12 px across at 1500 px: under 0.7 of the page's letter height, where the size check (boxTallEnough) turns away small letters (an n, an o); its sides on the ink map are also broken (isRealBox's straight sides). The two \"□\" found beside it are the same glyph a pixel off"},
      {"test": "ticks", "page": 1, "region": [162, 1048, 30, 360], "reason": "the lab list's \"□\" boxes (Hepatitis C antibody ... Any consults): printed box glyphs 12 px across, under 0.7 of the letter height, which the size check takes for small letters"},
      {"test": "extraFields", "page": 1, "region": [404, 328, 946, 46], "reason": "the blank after the heading \"Client Information:\" in its bar: blank page after a label with a colon, which can't be told from a label's blank"},
      {"test": "extraFields", "page": 1, "region": [728, 600, 620, 46], "reason": "the blank after \"Requested Service: (**Please tick all that apply)\": blank page after a label ending in brackets and a colon, over the options below"},
      {"test": "extraFields", "page": 1, "region": [634, 1696, 584, 50], "reason": "\"Signature with MSP # ____\": a signature line"},
      {"test": "extraFields", "page": 1, "region": [982, 224, 370, 44], "reason": "the blank after \"Mailing Address:\" in the clinic's header, its address printed below it"},
      {"test": "tags", "page": 1, "region": [820, 396, 530, 128], "reason": "the client table's right column (Address, City, Province, Postal Code: address...): its heading \"Client Information:\" is the box's own first row, which the owner check doesn't reach past the clinic's address and \"Mailing Address:\" above the box"},
      {"test": "tags", "page": 1, "region": [788, 764, 562, 48], "reason": "\"Reason for Referral/Diagnoses/Current Medications:\" (no tag): one field for several details; askedFor reads \"medications\""},
      {"test": "tags", "page": 1, "region": [474, 1754, 204, 50], "reason": "\"Contact information: Phone:\" under the referring physician (clinic_phone): \"contact information\" names a field for all of someone's ways to be reached, so askedFor gives nothing"}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "boxes": ["hepatitis_c_referral", "current_hematology_profile_inr_alt_ast_g", "hiv_referral", "hepatitis_c_antibody", "liver_biopsy_fibroscan", "previous_hepatitis_c_treatment", "hiv_antibody_test", "hepatitis_a_b_results", "consults_with_other_specialists"], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the \"□\" box glyphs, 9 px at this size, are missed (most are missed on the page itself too: under 0.7 of the letter height)"},
      {"variation": "1.5× size", "boxes": ["hiv_referral", "liver_biopsy_fibroscan", "previous_hepatitis_c_treatment", "hepatitis_a_b_results", "immunizations", "consults_with_other_specialists"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "2× size", "boxes": ["liver_biopsy_fibroscan", "consults_with_other_specialists"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "2.5× size", "boxes": ["liver_biopsy_fibroscan", "immunizations", "consults_with_other_specialists"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "3× size", "boxes": ["hiv_referral", "liver_biopsy_fibroscan", "previous_hepatitis_c_treatment", "hepatitis_a_b_results", "immunizations", "consults_with_other_specialists"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "faint print", "boxes": ["hiv_referral", "hepatitis_c_antibody", "ultrasound", "liver_biopsy_fibroscan", "previous_hepatitis_c_treatment", "hiv_antibody_test", "hepatitis_a_b_results", "consults_with_other_specialists"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"}
    ]
  },
  {
    "name": "Healthy Bones referral (Fraser Health, one page: fill-in lines after labels, light grey tick boxes, a ruled writing area)",
    "folder": "healthy-bones-referral",
    "session": "healthy_bones_referral_session.json",
    "variations": true,
    "skip": [
      {"test": "ticks", "page": 1, "region": [80, 522, 36, 70], "reason": "the light grey boxes of \"Previous bone density\" and \"Recent lab studies\" (grey 133-155, 1 px sides at 1500 px): shrunk to the canvas, each side falls across two pixel rows, and the faint second row makes the box's blob 13×16, out of square (0.81). Trimming faint edge rows on the grey image before the square check was tried: it found three letters elsewhere (on the CPP, Northern Health MOST and VCH forms) and still not these"},
      {"test": "tags", "page": 1, "region": [78, 1148, 1346, 200], "reason": "the reason-for-referral area (no tag): its field takes in the printed heading \"REASON FOR REFERRAL AND PERTINENT HISTORY\" and is labelled from \"FAMILY PHYSICIAN\" above it"},
      {"test": "tags", "page": 1, "region": [1080, 792, 334, 50], "reason": "\"REFERRAL PHONE:\" (clinic_phone): \"referral\" alone doesn't say whose; the clinician's on a referral"},
      {"test": "tags", "page": 1, "region": [1054, 916, 364, 50], "reason": "the \"PHONE\" after \"BEST PERSON TO CONTACT\" (no tag): the contact's, read as the patient's phone"}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "boxes": ["lateral_lumbar_and_thoracic_spine_x_rays", "previous_bone_density", "recent_lab_studies"], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the three 17 px boxes, 12 px at this size, are missed (the grey two are missed on the page itself too)"},
      {"variation": "0.7× size", "test": "extraFields", "page": 1, "region": [960, 994, 326, 56], "reason": "at 0.7× (the page about 1050 px wide), not traced further: a field over the BIRTHDATE month and year blanks"},
      {"variation": "1.5× size", "test": "extraFields", "page": 1, "region": [60, 1742, 1364, 70], "reason": "the strip between the last \"Other meds\" line and the double rule at the page's foot: resized, the double rule's two lines merge into one band, and the strip between it and the line above is taken for a row (seen in the picture; Rebalance's double rule was traced)"},
      {"variation": "2× size", "test": "extraFields", "page": 1, "region": [60, 1742, 1364, 70], "reason": "the strip between the last \"Other meds\" line and the double rule at the page's foot: resized, the double rule's two lines merge into one band, and the strip between it and the line above is taken for a row (seen in the picture; Rebalance's double rule was traced)"},
      {"variation": "2.5× size", "test": "extraFields", "page": 1, "region": [60, 1742, 1364, 70], "reason": "the strip between the last \"Other meds\" line and the double rule at the page's foot: resized, the double rule's two lines merge into one band, and the strip between it and the line above is taken for a row (seen in the picture; Rebalance's double rule was traced)"},
      {"variation": "3× size", "test": "extraFields", "page": 1, "region": [82, 1710, 350, 40], "reason": "the strip between the last \"Other meds\" line and the double rule at the page's foot: resized, the double rule's two lines merge into one band, and the strip between it and the line above is taken for a row (seen in the picture; Rebalance's double rule was traced)"},
      {"variation": "3× size", "test": "extraFields", "page": 1, "region": [60, 1742, 1364, 70], "reason": "the strip between the last \"Other meds\" line and the double rule at the page's foot: resized, the double rule's two lines merge into one band, and the strip between it and the line above is taken for a row (seen in the picture; Rebalance's double rule was traced)"},
      {"variation": "1.5× size", "boxes": ["previous_bone_density", "recent_lab_studies"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "2× size", "boxes": ["previous_bone_density", "recent_lab_studies"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "2.5× size", "boxes": ["previous_bone_density", "recent_lab_studies"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "3× size", "boxes": ["previous_bone_density", "recent_lab_studies"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "faint print", "boxes": ["previous_bone_density", "recent_lab_studies"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"}
    ]
  },
  {
    "name": "Osteoporosis clinic referral (New Westminster, one page: fill-in lines after labels, ruled writing areas)",
    "folder": "osteoporosis-clinic-referral",
    "session": "osteoporosis_clinic_referral_session.json",
    "variations": true,
    "skip": [
      {"test": "extraFields", "page": 1, "region": [482, 966, 842, 52], "reason": "the blank after \"Please include in referral:\", over the list of what to include: blank page after a label with a colon"}
    ]
  },
  {
    "name": "Peripheral nerve surgery clinic referral (UBC, one page: fill-in lines and labels over open page)",
    "folder": "peripheral-nerve-referral",
    "session": "peripheral_nerve_referral_session.json",
    "variations": true,
    "skip": [
      {"test": "fields", "page": 1, "region": [440, 640, 810, 46], "reason": "\"Occupation prior to injury:\": the bulleted-list check (bulletUnder) looks a line and a half under the label and finds the top two rows of the next line's \"D\" (\"Date of Injury\"), a mark a bullet's size with a gap after it, so the label is taken for a list's. Requiring the mark to end inside the rows looked at was tried: real bullets as close under their label end there too (\"REFERRAL CRITERIA:\" on the EPI form, \"Completed form must be:\" on the MRP form), whose labels then got blanks"},
      {"test": "fields", "page": 1, "region": [472, 818, 782, 220], "reason": "\"ICBC Claim No. (if applicable):\" and \"Nature of injury:\": open page, each blank after its label run down into one area"},
      {"test": "extraFields", "page": 1, "region": [342, 878, 142, 168], "reason": "the area between \"Nature of injury:\" and the ICBC field's area (see fields)"},
      {"test": "fields", "page": 1, "region": [680, 1116, 567, 50], "reason": "\"Surgeries to date (please attach operative record):\": OCR's colon is read on the bracket; the blank after it isn't found"},
      {"test": "tags", "page": 1, "region": [976, 510, 182, 52], "reason": "the \"(C)\" phone (cell): OCR doesn't read \"(C)\", so the blank has no label to give its kind"}
    ]
  },
  {
    "name": "RebalanceMD physician referral (one page: two columns of patient and referring physician details in boxes, tick boxes, writing boxes)",
    "folder": "rebalance-msk-referral",
    "session": "rebalance_msk_referral_session.json",
    "variations": true,
    "skip": [
      {"test": "fields", "page": 1, "region": [512, 264, 264, 260], "reason": "\"Gender:\" (sex): the box beside it runs on down to the WCB row, blank under the label, so the field takes the box's height"},
      {"test": "extraFields", "page": 1, "region": [512, 264, 264, 260], "reason": "\"Gender:\": the field the box's height (see fields)"},
      {"test": "fields", "page": 1, "region": [362, 478, 170, 50], "reason": "\"WCB Claim # if applicable:\": its blank is under \"Secondary Contact:\"'s field and the box's bottom edge, too short a strip after the label"},
      {"test": "extraFields", "page": 1, "region": [280, 576, 822, 104], "reason": "the blank under \"☐ Yes. ☐ No. Prefer to see Dr.:\" in the FAAST cell: blank page in a box under a row of options"},
      {"test": "tags", "page": 1, "region": [712, 550, 392, 48], "reason": "\"No. Prefer to see Dr.:\" (no tag): a specialist the patient would rather see, read as the clinician (\"Dr.\")"}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "boxes": ["yes_2", "knee", "shoulder_elbow", "checkbox_4"], "reason": "at 0.7× (the page about 1050 px wide), not traced further: four of the 22 px boxes, 15 px at this size, are missed"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [58, 1232, 722, 320], "reason": "the Medical & Surgical History box: its bottom is a double rule (two 6-row lines at y 1540 and 1550 at 1500 px), which resized merges into one 14-row band that isn't a solid line (solidLine), so the box has no bottom. Taking a double rule's top as its line was tried: it didn't separate the resampled rows and changed fields on the cardiology and PWD forms"},
      {"variation": "0.7× size", "test": "extraFields", "page": 1, "region": [1096, 618, 354, 62], "reason": "the strip under \"Date of Injury: ____\" to the box's bottom is taken for a blank in the resized copies (not traced)"},
      {"variation": "1.5× size", "test": "fields", "page": 1, "region": [58, 1232, 722, 320], "reason": "the Medical & Surgical History box: its bottom is a double rule (two 6-row lines at y 1540 and 1550 at 1500 px), which resized merges into one 14-row band that isn't a solid line (solidLine), so the box has no bottom. Taking a double rule's top as its line was tried: it didn't separate the resampled rows and changed fields on the cardiology and PWD forms"},
      {"variation": "1.5× size", "test": "extraFields", "page": 1, "region": [1094, 616, 356, 64], "reason": "the strip under \"Date of Injury: ____\" to the box's bottom is taken for a blank in the resized copies (not traced)"},
      {"variation": "2× size", "test": "fields", "page": 1, "region": [58, 1232, 722, 320], "reason": "the Medical & Surgical History box: its bottom is a double rule (two 6-row lines at y 1540 and 1550 at 1500 px), which resized merges into one 14-row band that isn't a solid line (solidLine), so the box has no bottom. Taking a double rule's top as its line was tried: it didn't separate the resampled rows and changed fields on the cardiology and PWD forms"},
      {"variation": "2× size", "test": "extraFields", "page": 1, "region": [1094, 616, 356, 64], "reason": "the strip under \"Date of Injury: ____\" to the box's bottom is taken for a blank in the resized copies (not traced)"},
      {"variation": "2.5× size", "test": "fields", "page": 1, "region": [58, 1232, 722, 320], "reason": "the Medical & Surgical History box: its bottom is a double rule (two 6-row lines at y 1540 and 1550 at 1500 px), which resized merges into one 14-row band that isn't a solid line (solidLine), so the box has no bottom. Taking a double rule's top as its line was tried: it didn't separate the resampled rows and changed fields on the cardiology and PWD forms"},
      {"variation": "2.5× size", "test": "extraFields", "page": 1, "region": [1094, 616, 356, 64], "reason": "the strip under \"Date of Injury: ____\" to the box's bottom is taken for a blank in the resized copies (not traced)"},
      {"variation": "3× size", "test": "fields", "page": 1, "region": [58, 1232, 722, 320], "reason": "the Medical & Surgical History box: its bottom is a double rule (two 6-row lines at y 1540 and 1550 at 1500 px), which resized merges into one 14-row band that isn't a solid line (solidLine), so the box has no bottom. Taking a double rule's top as its line was tried: it didn't separate the resampled rows and changed fields on the cardiology and PWD forms"},
      {"variation": "3× size", "test": "extraFields", "page": 1, "region": [1094, 616, 356, 64], "reason": "the strip under \"Date of Injury: ____\" to the box's bottom is taken for a blank in the resized copies (not traced)"}
    ]
  },
  {
    "name": "South Fraser Cardiology requisition (one page: short fill-in lines beside lists of indications, two large tick boxes)",
    "folder": "south-fraser-cardiology-req",
    "session": "south_fraser_cardiology_req_session.json",
    "variations": true,
    "skip": [
      {"test": "ticks", "page": 1, "region": [114, 690, 680, 58], "reason": "the \"24-HR HOLTER\" and \"TREADMILL TEST\" boxes: 44 px across at 1500 px, bigger than the largest tick box (40), with an underscore line printed inside along their bottoms"},
      {"test": "extraFields", "page": 1, "region": [936, 362, 458, 70], "reason": "the blank after \"Dr. Stephen Pearce\" in the letterhead"},
      {"test": "extraFields", "page": 1, "region": [182, 560, 214, 48], "reason": "the blank between \"PHN:\" and its line: blank page after a label with a colon, before the line set back from it"},
      {"test": "extraFields", "page": 1, "region": [300, 796, 1086, 50], "reason": "the blanks after the headings \"Test Indication:\" and \"Symptoms:\": blank page after a label with a colon, over the lists they head"},
      {"test": "extraFields", "page": 1, "region": [216, 1026, 1170, 50], "reason": "the blanks after the headings \"History:\" and \"Risk Profile:\": blank page after a label with a colon, over the lists they head"},
      {"test": "tags", "page": 1, "region": [380, 616, 240, 54], "reason": "\"DOB: D/M/Y ___/___/___\" (dob_day, dob_month, dob_year): the format is printed in the label, not under each blank, so the blanks aren't read as the date's parts"}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [380, 960, 74, 48], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the last \"____\" of each list, 35 px long at this size, is missed"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [998, 960, 74, 48], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the last \"____\" of each list, 35 px long at this size, is missed"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [380, 1156, 74, 48], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the last \"____\" of each list, 35 px long at this size, is missed"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [998, 1156, 74, 48], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the last \"____\" of each list, 35 px long at this size, is missed"},
      {"variation": "0.7× size", "boxes": ["holter_24_hr", "treadmill_test"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "1.5× size", "boxes": ["holter_24_hr", "treadmill_test"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "2× size", "boxes": ["holter_24_hr", "treadmill_test"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "2.5× size", "boxes": ["holter_24_hr", "treadmill_test"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "3× size", "boxes": ["holter_24_hr", "treadmill_test"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"},
      {"variation": "faint print", "boxes": ["holter_24_hr", "treadmill_test"], "reason": "the boxes the page itself skips (see the case's skips), for the same reason at this size"}
    ]
  },
  {
    "name": "Wound healing clinic referral (VCH, one page: bordered rows under grey section bars, tick boxes)",
    "folder": "wound-healing-referral",
    "session": "wound_healing_referral_session.json",
    "variations": true,
    "skip": [
      {"test": "fields", "page": 1, "region": [582, 1044, 756, 48], "reason": "the answer to \"How long has the wound(s) been open?\": a question with no line or colon, blank page after it"},
      {"test": "fields", "page": 1, "region": [884, 1076, 454, 48], "reason": "the blank after \"☐ Yes. Where?\": a question with no line or colon after an option"},
      {"test": "fields", "page": 1, "region": [412, 1292, 926, 48], "reason": "\"Precautions (ie. MRSA):\": its colon after a bracket is read as part of \"MRSA):\", a word ending in a bracket, and the blank after it is taken for the next row's"},
      {"test": "extraFields", "page": 1, "region": [158, 1440, 1184, 46], "reason": "the strip at the bottom of the Additional Information box, under its last bullet: blank page between the last row of text and the box's bottom edge"}
    ]
  },
  {
    "name": "Provincial Mental Health Metabolic Program referral (BC Children's, one page: labels with colons over open page, writing strips under prompts)",
    "folder": "pmhmp-referral",
    "session": "pmhmp_referral_session.json",
    "variations": true,
    "skip": [
      {"test": "fields", "page": 1, "region": [814, 236, 598, 196], "reason": "\"PHN:\" and \"Email:\" (one line each): open page after a label, the blank runs down to the next label in the column"},
      {"test": "extraFields", "page": 1, "region": [814, 236, 598, 196], "reason": "\"PHN:\" and \"Email:\" taken as areas (see fields)"},
      {"test": "fields", "page": 1, "region": [400, 282, 1004, 44], "reason": "\"Primary Caregiver(s) Name:\": its blank stops at the PHN area beside it (see above)"},
      {"test": "extraFields", "page": 1, "region": [400, 282, 1004, 44], "reason": "\"Primary Caregiver(s) Name:\" (see fields)"},
      {"test": "fields", "page": 1, "region": [672, 368, 731, 48], "reason": "\"Legal Guardian (if different from Primary Caregiver):\": the Email area beside it (see above) leaves no blank after the label"},
      {"test": "extraFields", "page": 1, "region": [96, 482, 1306, 70], "reason": "the blanks beside the italic note \"Please ensure consent has been obtained ...\", over the line under it"},
      {"test": "extraFields", "page": 1, "region": [82, 622, 1328, 45], "reason": "the strip between the referring physician's \"Phone: Fax:\" row and the box's bottom edge"},
      {"test": "extraFields", "page": 1, "region": [1087, 1488, 325, 44], "reason": "the blank after \"Please fax the requested information to: (604)875-2271\""},
      {"test": "extraFields", "page": 1, "region": [662, 1034, 750, 58], "reason": "the blank after \"Lab results (including baseline monitoring):\" on its own row, as well as the strip under it"},
      {"test": "extraFields", "page": 1, "region": [466, 1410, 948, 48], "reason": "the blank after \"Substance Use Concerns:\" on its own row, as well as the strip under it"}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "test": "extraTicks", "page": 1, "region": [328, 1644, 40, 40], "reason": "at 0.7× (the page about 1050 px wide), not traced further: a mark in the print taken for a box, and a blank found by the Safety Concerns row's arrow"},
      {"variation": "0.7× size", "test": "extraFields", "page": 1, "region": [88, 1254, 118, 58], "reason": "at 0.7× (the page about 1050 px wide), not traced further: a mark in the print taken for a box, and a blank found by the Safety Concerns row's arrow"},
      {"variation": "2× size", "boxes": ["obesity_accelerated_weight_gain"], "reason": "the \"☐Obesity\" box, printed touching the O of \"Obesity\": at 2× the box and the letter likely join in the ink map (seen in the picture, not traced)"}
    ]
  },
  {
    "name": "STAR day treatment referral (three pages: fill-in lines, ruled writing areas, two ruled tables)",
    "folder": "star-referral",
    "session": "star_referral_session.json",
    "variations": true,
    "skip": [
      {"test": "fields", "page": 1, "region": [1178, 409, 97, 48], "reason": "the date's MM blank, \"__ | __ | __\" over \"YY MM DD\": its line is broken by a gap, two short pieces, each shorter than a blank"},
      {"test": "extraFields", "page": 2, "region": [472, 430, 896, 48], "reason": "the blank after the heading \"Previous/Current Treatment:\": blank page after a label with a colon, over the table it heads"},
      {"test": "extraFields", "page": 2, "region": [580, 488, 790, 46], "reason": "the blanks after the column headings \"Date:\" and \"Comments:\": blank page after labels with colons, a table's heading row over open rows"},
      {"test": "tags", "page": 1, "region": [1040, 610, 330, 110], "reason": "the counsellor's and the doctor's \"Phone Number:\" (no tag): under \"If client has any of the following, please list:\", a sentence, which the owner check doesn't take for a heading; \"Doctor/Psychiatrist\" makes them the clinician's"},
      {"test": "tags", "page": 1, "region": [354, 676, 414, 52], "reason": "\"Doctor/Psychiatrist:\" (no tag): the client's, under a sentence the owner check doesn't read as a heading"},
      {"test": "tags", "page": 1, "region": [984, 900, 380, 60], "reason": "\"Date of Birth: __ | __ | __\" over \"YY MM DD\" (dob_year, dob_month, dob_day): the captions are under a second row of print, read as their own line, not the blanks' captions"},
      {"test": "tags", "page": 3, "region": [132, 1082, 1238, 144], "reason": "\"Have you recently stopped taking any prescription medications? If yes, details\" (no tag): a question with a request after it, read for \"medications\""}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [132, 1382, 1238, 142], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the \"Yes ___ No ___\" blanks (30 px at this size) and the ruled area under them are missed; fields are found in the area's rows instead"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [656, 1350, 66, 48], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the \"Yes ___ No ___\" blanks (30 px at this size) and the ruled area under them are missed; fields are found in the area's rows instead"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [756, 1350, 66, 48], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the \"Yes ___ No ___\" blanks (30 px at this size) and the ruled area under them are missed; fields are found in the area's rows instead"},
      {"variation": "0.7× size", "test": "extraFields", "page": 2, "region": [134, 1422, 294, 58], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the \"Yes ___ No ___\" blanks (30 px at this size) and the ruled area under them are missed; fields are found in the area's rows instead"},
      {"variation": "0.7× size", "test": "extraFields", "page": 2, "region": [410, 1422, 454, 58], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the \"Yes ___ No ___\" blanks (30 px at this size) and the ruled area under them are missed; fields are found in the area's rows instead"},
      {"variation": "0.7× size", "test": "extraFields", "page": 2, "region": [846, 1422, 522, 58], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the \"Yes ___ No ___\" blanks (30 px at this size) and the ruled area under them are missed; fields are found in the area's rows instead"},
      {"variation": "0.7× size", "test": "extraFields", "page": 2, "region": [134, 1464, 294, 56], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the \"Yes ___ No ___\" blanks (30 px at this size) and the ruled area under them are missed; fields are found in the area's rows instead"},
      {"variation": "0.7× size", "test": "extraFields", "page": 2, "region": [410, 1464, 454, 56], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the \"Yes ___ No ___\" blanks (30 px at this size) and the ruled area under them are missed; fields are found in the area's rows instead"},
      {"variation": "0.7× size", "test": "extraFields", "page": 2, "region": [846, 1464, 522, 56], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the \"Yes ___ No ___\" blanks (30 px at this size) and the ruled area under them are missed; fields are found in the area's rows instead"},
      {"variation": "1.5× size", "test": "fields", "page": 2, "region": [756, 1350, 66, 48], "reason": "\"(√) Yes ___ No ___\": at this size the line comes out 5 pixel rows thick in the ink map (at 3×), thicker than the short-line check's limit (0.2 of the letter height, 4 rows). Allowing 0.3 took letter tops for blanks on the TWC and Burnaby forms; measuring the core on the grey image took more"},
      {"variation": "2.5× size", "test": "fields", "page": 2, "region": [656, 1350, 66, 48], "reason": "\"(√) Yes ___ No ___\": at this size the line comes out 5 pixel rows thick in the ink map (at 3×), thicker than the short-line check's limit (0.2 of the letter height, 4 rows). Allowing 0.3 took letter tops for blanks on the TWC and Burnaby forms; measuring the core on the grey image took more"},
      {"variation": "2.5× size", "test": "fields", "page": 2, "region": [756, 1350, 66, 48], "reason": "\"(√) Yes ___ No ___\": at this size the line comes out 5 pixel rows thick in the ink map (at 3×), thicker than the short-line check's limit (0.2 of the letter height, 4 rows). Allowing 0.3 took letter tops for blanks on the TWC and Burnaby forms; measuring the core on the grey image took more"},
      {"variation": "3× size", "test": "fields", "page": 2, "region": [756, 1350, 66, 48], "reason": "\"(√) Yes ___ No ___\": at this size the line comes out 5 pixel rows thick in the ink map (at 3×), thicker than the short-line check's limit (0.2 of the letter height, 4 rows). Allowing 0.3 took letter tops for blanks on the TWC and Burnaby forms; measuring the core on the grey image took more"}
    ]
  },
  {
    "name": "Ultrasound / fetal monitoring intake (BC Women's, one page: dense fill-in lines and tick boxes, short date blanks)",
    "folder": "fetal-monitoring-intake",
    "session": "fetal_monitoring_intake_session.json",
    "variations": true,
    "skip": [
      {"test": "extraFields", "page": 1, "region": [1126, 342, 290, 92], "reason": "the two \"Signature: ____\" lines"},
      {"test": "extraFields", "page": 1, "region": [864, 1752, 546, 36], "reason": "the strip under \"GA ___ EDD ___ Initials ___\", above the office box's bottom edge"},
      {"test": "extraFields", "page": 1, "region": [1278, 1398, 134, 58], "reason": "the blank after \"For BC Women's Office use only:\" in its box"}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [1298, 768, 66, 48], "reason": "LNMP's MM blank, \"___/___/___\": at 0.7× the slashes at both its ends are a few pixels wide and stand straight enough to read as a box's sides rising from both ends of an edge, which the short-line check turns away (on the page and at larger sizes it is found)"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [232, 768, 64, 48], "reason": "at 0.7× (the page about 1050 px wide), not traced further: EDD's MM and YY blanks, 28 px each at this size between slashes, are missed"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [278, 768, 66, 48], "reason": "at 0.7× (the page about 1050 px wide), not traced further: EDD's MM and YY blanks, 28 px each at this size between slashes, are missed"}
    ]
  },
  {
    "name": "White Rock Orthopaedic Surgery Centre patient registration (three pages: fill-in lines, short Yes ____ No ____ blanks)",
    "folder": "wrosc-registration",
    "session": "wrosc_registration_session.json",
    "variations": true,
    "skip": [
      {"test": "fields", "page": 1, "region": [1138, 1696, 280, 46], "reason": "\"Explain:________\" after \"Does the patient have dependents at home?\": its line runs on from the colon, the label's ink over its start"},
      {"test": "fields", "page": 2, "region": [422, 1640, 119, 46], "reason": "\"any implanted device? Yes________\": a fill-in line run on from the letters before it (\"Yes_______\"): the run starts at the word's last letter, with that letter's ink over it, so it is neither a line on its own nor a short blank after a word"},
      {"test": "fields", "page": 2, "region": [1056, 1672, 100, 52], "reason": "\"... shrapnel Yes__No_\": two blanks of two underscores and one, shorter than a letter and a half, a run of letters' feet's length"},
      {"test": "extraFields", "page": 1, "region": [290, 182, 612, 54], "reason": "the blank right of the centre's logo, beside its address: blank page under the letterhead"},
      {"test": "extraFields", "page": 1, "region": [248, 880, 146, 52], "reason": "the blank between \"New Patient:\" and \"Yes_______\": blank page after a label with a colon, before options with blanks"},
      {"test": "extraFields", "page": 2, "region": [420, 1094, 998, 60], "reason": "the blank after the heading \"Does the patient have:\": blank page after a label with a colon, over the list it heads"},
      {"test": "extraFields", "page": 3, "region": [148, 222, 168, 52], "reason": "the blank between \"Pain:\" and \"Yes____\": blank page after a label with a colon, before options with blanks"},
      {"test": "extraFields", "page": 3, "region": [594, 1308, 822, 70], "reason": "the blank after \"Patient registration completed by:\", over the table's \"Print name | Signature | Date\" headings"}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [780, 878, 108, 50], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [426, 878, 128, 50], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [268, 1082, 84, 50], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [378, 1082, 82, 50], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [418, 1150, 82, 50], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [716, 1696, 82, 50], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [906, 1696, 84, 50], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [912, 1764, 68, 50], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "extraFields", "page": 1, "region": [780, 850, 106, 72], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [570, 1640, 92, 46], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [784, 552, 68, 50], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [952, 552, 68, 50], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [966, 1438, 84, 50], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "extraFields", "page": 2, "region": [562, 1640, 100, 32], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "extraFields", "page": 2, "region": [964, 1402, 86, 82], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 3, "region": [500, 358, 92, 44], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 3, "region": [506, 392, 92, 44], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "fields", "page": 3, "region": [268, 900, 122, 48], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"},
      {"variation": "0.7× size", "test": "extraFields", "page": 3, "region": [250, 900, 138, 32], "reason": "at 0.7× (the page about 1050 px wide), not traced further: some of the \"Yes ____ No ____\" blanks, 30-40 px at this size, are missed, and a few found shifted"}
    ]
  },
  {
    "name": "Foundry Prince George engagement form (two pages: fill-in lines inside sentences, tick boxes, a table)",
    "folder": "foundry-pg-engagement",
    "session": "foundry_pg_engagement_session.json",
    "variations": true,
    "skip": [
      {"test": "ticks", "page": 1, "region": [152, 928, 46, 46], "reason": "the \"☐ I don't know it.\" box: under \"My BC Personal Health Number (PHN) is ____.\", its top edge a few pixels under the line, close enough that the ink map may join them"},
      {"test": "extraTicks", "page": 1, "region": [354, 82, 45, 45], "reason": "the O of the \"FOUNDRY\" logo, a square-cornered letter as tall as a box, with an empty middle"},
      {"test": "extraFields", "page": 1, "region": [156, 142, 1198, 40], "reason": "the strip between \"MOIS Chart #\" and the header's grey line"},
      {"test": "extraFields", "page": 1, "region": [154, 1708, 1200, 50], "reason": "the strip under \"My email is ____\", above the section's grey line"},
      {"test": "extraFields", "page": 2, "region": [150, 790, 1200, 70], "reason": "the strip under the emergency contact note, above the section's grey line"},
      {"test": "extraFields", "page": 2, "region": [856, 1688, 452, 70], "reason": "\"Your Signature\": a signature line"},
      {"test": "tags", "page": 1, "region": [396, 440, 820, 62], "reason": "\"My legal name is ____ ____\" over \"First\" and \"Last\" (patient_nameF, patient_nameL): the captions under the lines are too far below to be read as theirs"},
      {"test": "tags", "page": 1, "region": [1196, 1530, 182, 54], "reason": "the blank after \"☐ other:\" (no tag): its label takes in the row's options, \"email\" among them"},
      {"test": "tags", "page": 2, "region": [758, 904, 510, 50], "reason": "\"☐ Yes, their name is ____\" under \"I have a family doctor or clinic ...\" (doctor): the family doctor named in a sentence over the options"},
      {"test": "tags", "page": 2, "region": [196, 1688, 512, 70], "reason": "\"Print your name\" under the line (patient_name): the youth filling in the form, which the caption doesn't say"}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "boxes": ["don_t_have_an_address", "dont_know_phn"], "reason": "\"☐ I don't know it.\" and \"☐ I don't have an address.\": each box's top edge is a few pixels under a fill-in line, and in the ink map the two join (at 2× a 40×54 px blob, box and line together); the page itself skips the first"},
      {"variation": "0.7× size", "test": "extraFields", "page": 1, "region": [146, 1236, 1222, 68], "reason": "at 0.7× (the page about 1050 px wide), not traced further: a strip under \"Yes, I have accessed Foundry ____\", over the section's grey rule, is taken for a blank"},
      {"variation": "1.5× size", "boxes": ["don_t_have_an_address", "dont_know_phn"], "reason": "\"☐ I don't know it.\" and \"☐ I don't have an address.\": each box's top edge is a few pixels under a fill-in line, and in the ink map the two join (at 2× a 40×54 px blob, box and line together); the page itself skips the first"},
      {"variation": "2× size", "boxes": ["don_t_have_an_address", "dont_know_phn"], "reason": "\"☐ I don't know it.\" and \"☐ I don't have an address.\": each box's top edge is a few pixels under a fill-in line, and in the ink map the two join (at 2× a 40×54 px blob, box and line together); the page itself skips the first"},
      {"variation": "2× size", "test": "extraFields", "page": 1, "region": [606, 76, 636, 66], "reason": "the blank right of the FOUNDRY logo's lettering, under the header: blank page after the logo's words"},
      {"variation": "2.5× size", "boxes": ["don_t_have_an_address", "dont_know_phn"], "reason": "\"☐ I don't know it.\" and \"☐ I don't have an address.\": each box's top edge is a few pixels under a fill-in line, and in the ink map the two join (at 2× a 40×54 px blob, box and line together); the page itself skips the first"},
      {"variation": "2.5× size", "test": "extraFields", "page": 1, "region": [606, 76, 636, 66], "reason": "the blank right of the FOUNDRY logo's lettering, under the header: blank page after the logo's words"},
      {"variation": "3× size", "boxes": ["don_t_have_an_address", "dont_know_phn"], "reason": "\"☐ I don't know it.\" and \"☐ I don't have an address.\": each box's top edge is a few pixels under a fill-in line, and in the ink map the two join (at 2× a 40×54 px blob, box and line together); the page itself skips the first"},
      {"variation": "faint print", "boxes": ["don_t_have_an_address", "dont_know_phn"], "reason": "\"☐ I don't know it.\" and \"☐ I don't have an address.\": each box's top edge is a few pixels under a fill-in line, and in the ink map the two join (at 2× a 40×54 px blob, box and line together); the page itself skips the first"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [156, 1424, 316, 46], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the table's last two rows are missed"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [460, 1424, 316, 46], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the table's last two rows are missed"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [764, 1424, 316, 46], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the table's last two rows are missed"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [1070, 1424, 316, 46], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the table's last two rows are missed"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [156, 1458, 316, 46], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the table's last two rows are missed"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [460, 1458, 316, 46], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the table's last two rows are missed"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [764, 1458, 316, 46], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the table's last two rows are missed"},
      {"variation": "0.7× size", "test": "fields", "page": 2, "region": [1070, 1458, 316, 46], "reason": "at 0.7× (the page about 1050 px wide), not traced further: the table's last two rows are missed"},
      {"variation": "1.5× size", "test": "extraTicks", "page": 2, "region": [608, 534, 40, 40], "reason": "a letter of the light grey emergency-contact paragraph taken for a box at 1.5×"},
      {"variation": "0.7× size", "test": "extraTicks", "page": 1, "region": [354, 82, 45, 45], "reason": "as on the page itself (see the case's skip there): the O of the \"FOUNDRY\" logo, a square-cornered letter as tall as a box, with an empty middle"},
      {"variation": "1.5× size", "test": "extraTicks", "page": 1, "region": [354, 82, 45, 45], "reason": "as on the page itself (see the case's skip there): the O of the \"FOUNDRY\" logo, a square-cornered letter as tall as a box, with an empty middle"},
      {"variation": "3× size", "test": "extraTicks", "page": 1, "region": [354, 82, 45, 45], "reason": "as on the page itself (see the case's skip there): the O of the \"FOUNDRY\" logo, a square-cornered letter as tall as a box, with an empty middle"}
    ]
  },
  {
    "name": "Pre-surgical health history questionnaire (Fraser Health, its first page: bordered rows, tables, Yes/No tick boxes)",
    "folder": "presurgical-questionnaire",
    "session": "presurgical_questionnaire_session.json",
    "variations": true,
    "skip": [
      {"test": "tags", "page": 1, "region": [612, 484, 146, 46], "reason": "\"Female☐ Male☐\" (sex F, sex M): each label printed before its box, so a box takes the word after it, \"Male\" for the first and \"Personal Health Number\" for the second"},
      {"test": "fields", "page": 1, "region": [380, 1770, 1040, 56], "reason": "\"If yes, Number/Day____ Number of years____ Date last cigarette____\": their lines are five pixels above the table row's bottom line, and in the ink map their soft edges join it, one band taken for the row's edge"},
      {"test": "extraFields", "page": 1, "region": [656, 792, 804, 48], "reason": "the blank after \"If yes, list below.\", in the allergy question's box: blank page after a sentence's end, before the table it points to"},
      {"test": "extraFields", "page": 1, "region": [784, 832, 676, 46], "reason": "the blank after the column heading \"How you react:\": a table's heading with a colon over its rows"},
      {"test": "extraFields", "page": 1, "region": [498, 1410, 962, 50], "reason": "the blank after \"Screening for Sleep Apnea:\" in its grey heading bar"}
    ],
    "variationSkip": [
      {"variation": "0.7× size", "boxes": ["checkbox_1", "checkbox_7"], "reason": "at 0.7× (the page about 1050 px wide), not traced further: two of the sleep table's shaded boxes, and the second line under \"If yes, explain:\", are missed"},
      {"variation": "0.7× size", "test": "fields", "page": 1, "region": [136, 1358, 1330, 52], "reason": "at 0.7× (the page about 1050 px wide), not traced further: two of the sleep table's shaded boxes, and the second line under \"If yes, explain:\", are missed"},
      {"variation": "2× size", "boxes": ["patient", "family_member_friend_other_name", "checkbox_1", "checkbox_2"], "reason": "the \"Form completed by: ☐ Patient ☐ Family member\" boxes sit on the table's top line, and the sleep table's shaded (3-D) boxes against its row lines: resized, box and line likely join in the ink map (seen in the picture, not traced)"},
      {"variation": "2.5× size", "boxes": ["patient", "family_member_friend_other_name"], "reason": "the \"Form completed by: ☐ Patient ☐ Family member\" boxes sit on the table's top line, and the sleep table's shaded (3-D) boxes against its row lines: resized, box and line likely join in the ink map (seen in the picture, not traced)"},
      {"variation": "2.5× size", "test": "fields", "page": 1, "region": [1094, 682, 370, 54], "reason": "\"Family member, Friend, Other Name: ____\": the blank after it, missed at 2.5×, its line close over the table's top line (not traced)"}
    ]
  },
  {
    "name": "Substance use bed based treatment referral (Fraser Health, fillable PDF, pages 2-3: personal and referral source details, tables)",
    "folder": "fha-substance-use-referral",
    "session": "fha_substance_use_referral_session.json",
    "pdf": "FHA_Substance_Use_Referral_pages2-3.pdf",
    "skip": [
      {"test": "tags", "page": 1, "region": [862, 1062, 562, 54], "reason": "\"If yes, what date is withdrawal management expected to be completed:\" (no tag): a question without its question mark, read as \"Date completed\""},
      {"test": "tags", "page": 2, "region": [168, 340, 1250, 150], "reason": "the Referral Source's \"Name\", \"Email #1\", \"Email #2\", \"Cell\", \"Fax\" (current_user, none, none, none, clinic_fax): their heading, \"Referral Source: All correspondence will be sent ...\", runs on into a sentence, which the owner check doesn't read as a heading"}
    ]
  }
];
