// The Auto Detect test cases. Each is a folder here holding a finished eForm: its HTML and its
// page image(s), as the app's OSCAR package has them (unzip the package into the folder).
//   name    what the test results call it
//   folder  its folder in tests/cases
//   eform   the eForm's HTML file, in that folder
//   images  its page images, in that folder
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
        "reason": "the ruled row left of SIGNATURE OF REQUESTING PHYSICIAN, between the box above and the TELEPHONE REQUISITION TIME row: an empty row with no words in it or beside it, which the eForm leaves out. Its ink is a table row's with nothing printed in it, as a box left blank to write in is (a big box with its label printed outside it), so no rule can take it out without taking those"
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
        "reason": "the lower half of the MSP No box, beside Fax number: under MSP No's fill-in line and over the box's bottom rule, joined by the box's sides, so a row in ink; the eForm leaves it empty"
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
        "reason": "at 0.7× the page is about 70 dpi, below a PDF render (about 176), and each of these boxes sits a pixel or two over its row's rule with its label right beside it (\"☐Full time\", \"☐Yes ☐No\" in the work status table): in those pixels the same as a letter on a rule (the D of \"Family MD\" on the referral form), so finding them would bring letters back"
      },
      {
        "variation": "0.7× size",
        "boxes": [
          "Orientation2_Left",
          "Orientation4_Left"
        ],
        "reason": "at 0.7× the page is about 70 dpi, below a PDF render (about 176), and each of these boxes sits a pixel or two over its row's rule with its label right beside it (\"☐Left\" under ORIENTATION): in those pixels the same as a letter on a rule (the D of \"Family MD\" on the referral form), so finding them would bring letters back"
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
        "reason": "the PRACTITIONER INFORMATION heading row, right of the MSP/PRACTITIONER NUMBER column: the hairline under the row is light grey (about 150 of 255), which faint print takes to about 224, and only its part from that column's divider on still reads as a rule, so that part makes a row of its own, with no label in it, under the table's top rule"
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
  }
];
