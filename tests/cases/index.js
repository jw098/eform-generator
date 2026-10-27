// The Auto Detect test cases: one file each in this folder, tests/cases/<file>.js.
// todo: a case's tests it doesn't pass yet, reported as "to do" rather than as failures, by
// key: ticks, fields, extraTicks, extraFields, tags (see tests/README.md).
window.TEST_CASE_LIST = [
  {
    "file": "referral-form"
  },
  {
    "file": "x-ray-requisition"
  },
  {
    "file": "mammography-requisition",
    "todo": {
      "extraFields": "two places that aren't fields (beside the PRESENT COMPLAINT heading, and above the bottom boxes)"
    }
  }
];
