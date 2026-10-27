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
window.TEST_CASE_LIST = [
  {
    "name": "Referral form",
    "folder": "referral-form",
    "eform": "referral_form_3c1x42.html",
    "images": [
      "referral_form_3c1x42_page1.png"
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
    "skip": [
      {
        "test": "extraFields",
        "page": 1,
        "region": [740, 1070, 720, 50],
        "reason": "the blank beside the PRESENT COMPLAINT heading: fine as a field"
      },
      {
        "test": "extraFields",
        "page": 1,
        "region": [50, 1656, 980, 74],
        "reason": "the blank above the bottom boxes: fine as a field"
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
  }
];
