# HRMS employee portal — reference pack

**Start here.** This folder is the discovery record for rebuilding the company's employee portal. It explains what the accessible system does, which business rules are confirmed, and which questions still need decisions.

The immediate goal is **feature and behavior parity with a new visual design**, fully responsive on mobile, tablet, and desktop. HR/Admin portal work is deferred. This is a discovery record; it is not application source code or a final implementation plan.

The portal was reviewed on **25 November 2026**. No future access to the original portal is assumed. Preserve this pack as an offline reference for understanding, implementing, and reviewing the recorded functionality.

## 1. Quick start

1. Extract the complete ZIP if you received an archive. Keep its folder structure intact.
2. Read this README to understand the files and evidence labels.
3. Open [functional-specification.html](functional-specification.html) in a browser. This is the main functional document.
4. Open [index.html](index.html) alongside it to inspect screenshots and supporting evidence.
5. Read [user-confirmed-rules.json](user-confirmed-rules.json) for the requirements explicitly supplied by the user.
6. Use the evidence labels to distinguish confirmed behavior from unverified details.

The HTML files work locally and do not require a development server, installation, or a running HRMS. A text editor can open the `.txt`, `.md`, and `.json` files. Keep the HTML files with their sibling folders; copying only an HTML file will break its relative image and evidence links.

**Suggested reading order:** start with specification sections 1–3 for scope, evidence, and shared behavior. Read section 12 for location-based punching, sections 17–18 for notifications, and sections 26–27 for known gaps and acceptance coverage. Then open the relevant module sections as needed.

## 2. What this pack contains

The record contains:

- 28 specification sections covering 14 observed routes.
- 175 labeled entries covering observations, rules, guide descriptions, requirements, and unknowns. This does **not** mean 175 independently verified features.
- 75 screenshots: 50 from the detailed review and 25 from the initial walkthrough.
- 49 detailed screen-text records and 47 rendered-control metadata records.
- User-confirmed scope, office hours, attendance reminders, and location-based punch-in requirement.

The original portal's backend source, database, hidden configuration, production API contracts, and Admin Portal were not inspected. Some employee modules contained no records. Their empty views cannot establish every populated-state behavior.

## 3. Folder structure

```text
hrms-detailed-audit/
├── README.md                       Start here: file guide and usage instructions
├── functional-specification.html   Main readable functional document
├── functional-specification.txt    Plain-text counterpart of the document
├── index.html                     Screenshot gallery and evidence browser
├── user-confirmed-rules.json       Requirements explicitly stated by the user
├── feature-register.json           Structured specification entries
├── evidence-manifest.json          Capture inventory and route coverage
├── session-capture-log.json        Capture-session history
├── file-checksums.sha256           Integrity fingerprints for packaged files
├── screenshots/                   50 detailed-review JPG images
├── evidence/                      Screen text and control-attribute evidence
└── initial-reference/             Earlier walkthrough, including 25 images
```

The shareable archive is named **hrms-complete-record.zip** and is saved beside this folder in `outputs/`. Extracting it creates a `hrms-detailed-audit/` folder. The archive does not contain itself.

## 4. File-by-file instructions

| File or folder | Purpose | When to use it |
|---|---|---|
| [README.md](README.md) | Explains the files, usage instructions, evidence labels, and documented gaps. | Understanding or navigating the reference pack. |
| [functional-specification.html](functional-specification.html) | Main document with a table of contents and labeled entries. Covers fields, actions, workflows, policy text, states, dependencies, and limitations. | Requirements discussion, module planning, implementation, and review. |
| [functional-specification.txt](functional-specification.txt) | Plain-text version of the same functional content. | Searching, quoting feature IDs in tasks, or supplying context to a coding assistant. It is not a second set of requirements. |
| [index.html](index.html) | Gallery linking screenshots, screen text, and control attributes. Also includes expandable control tables. | Checking what a control actually exposed or finding evidence for a specification entry. |
| [user-confirmed-rules.json](user-confirmed-rules.json) | Structured statements supplied by the user, including scope and attendance reminder timings. | Checking explicit business intent before making assumptions from screenshots. This is a requirements record, not application configuration. |
| [feature-register.json](feature-register.json) | Structured list of entries with `id`, `status`, `section`, `section_title`, and `description`. | Filtering by module/status, referencing work items, and identifying unresolved behavior. It is not a ready-made project backlog or database schema. |
| [evidence-manifest.json](evidence-manifest.json) | Lists routes, capture paths, image dimensions, available metadata, and status counts. | Locating related artifacts, checking evidence coverage, or automating documentation lookup. |
| [session-capture-log.json](session-capture-log.json) | Historical capture attempts and some viewport-fallback notes. | Investigating how evidence was collected. Attempts, repeated names, or incomplete captures may appear. Use the manifest and actual files for the final inventory. |
| [file-checksums.sha256](file-checksums.sha256) | SHA-256 fingerprint for each other packaged file. | Comparing a shared/extracted copy with the packaged record or detecting later edits. It does not validate the business rules. |
| [screenshots/](screenshots/) | Detailed-review screenshots, including forms, menu choices, filters, dark mode, corrections, and notification history. | Seeing visible controls and states. Use the gallery's descriptive captions rather than interpreting filenames alone. |
| [evidence/](evidence/) | Detailed text and JSON snapshots. | Resolving questions such as required attributes, date limits, accepted file extensions, dropdown values, and displayed messages. |
| [initial-reference/](initial-reference/) | Original 25 screenshots, initial notes/checklist, and original gallery. | Additional evidence, particularly explicit mobile/tablet/desktop references. The later specification takes precedence over the earlier checklist where they differ. |

### Understanding files inside `evidence/`

Most captures share a base name across three artifacts:

```text
screenshots/30-signup-detailed.jpg
evidence/30-signup-detailed.txt
evidence/30-signup-detailed.json
```

The JPG shows the captured screen. The TXT preserves the page's accessible text structure. The JSON preserves rendered controls and attributes such as input type, placeholder, `required`, `disabled`, `min`, `max`, `accept`, dropdown options, and link targets.

These artifacts complement one another. A screenshot may not show every option in a closed dropdown, while its metadata can list those options. A DOM snapshot can contain background navigation beneath an open dialog; this does not establish that the background was usable in that state.

Important limits:

- Browser attributes do not prove server-side validation. For example, `required=false` on a custom select's companion element does not establish that the business field is optional.
- A declared `accept` extension does not prove uploaded files are securely validated by the server.
- JSON evidence is descriptive; do not import it as live production settings or employee records.
- Captures 48–49 preserve live accessibility text rather than the usual DOM/JSON pair. Capture 50 is a scrolling screenshot.

### Understanding `initial-reference/`

This folder contains `01`–`25` JPG captures, its original `index.html`, `build-checklist.txt`, and `authentication-notes.txt`.

It is historical evidence. For example, the initial checklist left registration role choices uncertain; the later review verified that the inspected role menu offered **Employee only**. Use the detailed specification for the resolved finding.

## 5. How to interpret confidence and resolve conflicts

| Label | Meaning | How to use it |
|---|---|---|
| `OBSERVED` | A screen, control, attribute, message, or interaction was seen directly. | Use as evidence of that specific state, without assuming unseen behavior. |
| `CONFIRMED` | The user explicitly supplied the behavior. | Treat as stated business intent. Later clarifications should be recorded as decisions. |
| `GUIDE` | The portal's built-in help describes it. | Preserve the described capability, but do not claim its production transaction or delivery was tested. |
| `UNVERIFIED` | Access/data/safe inspection did not establish the behavior. | Turn it into a decision or acceptance question. Do not implement an arbitrary guess as a discovered requirement. |
| `REQUIREMENT` | A requirement for the new system, including derived coverage expectations. | Include in planning, while checking whether it is user-supplied intent or proposed acceptance coverage. |

Later confirmed requirements can change the baseline for the new build. Keep those changes separate from the historical evidence to distinguish **what the old system showed** and **what the new system should do**.

Do not silently edit screenshots or historical observations to make them agree with a new decision. The detailed specification supersedes the initial checklist for this review. When evidence itself seems inconsistent, preserve the discrepancy and keep its intended behavior marked as unresolved.

## 6. Confirmed scope and business rules

- Reproduce the employee-facing features and workflows, then add new features later.
- Create a new visual design; do not copy the existing interface.
- Support mobile, tablet, and desktop throughout the application.
- Keep location-based punch-in in scope. Its exact location-checking policy is not yet established.
- Office hours: **10:00 AM–6:00 PM**.
- On working days, an employee who has not punched in by **11:00 AM** receives an individual reminder.
- At **6:30 PM**, employees who have not punched out receive a reminder.
- Admin Portal discovery/build work is deferred; no further access to it is assumed.

The office timezone, holiday/approved-leave exemptions, all-day absence handling, and repeated/multiple-session reminder behavior still need explicit decisions. Do not treat the computer's timezone or a screenshot timestamp as proof of company policy.

## 7. Notification scope

The reviewed notification history contained five event categories:

| Category | What was visible |
|---|---|
| Missing punch-in | “Haven't punched in yet?” reminders with 11:00 AM examples. |
| Missing punch-out | “Don't forget to punch out!” reminders with 6:30 PM examples. |
| Birthdays | Alerts naming an employee whose birthday is that day; 9:00 AM examples were visible. The universal scheduling/audience rule was not proven. |
| New holiday added | Holiday name, date, and office-closed information. |
| Holiday tomorrow | Reminder that a holiday/office closure is the following day; a 6:00 PM example was visible. |

The guide additionally describes leave-submission alerts to HR/Admin and leave-decision alerts to the employee, including email/WhatsApp and employee in-app alerts. External delivery was not tested.

Payslip, asset, correction-decision, and cancellation-decision notifications were **not established** by this review. Do not describe them as existing features without a later decision or additional evidence.

## 8. Existing issues and basic gaps

There is no evidence-based basis to say that the entire current HRMS is missing a particular backend or Admin feature. The items below separate visible problems, controls absent from inspected views, and gaps in our knowledge.

### A. Observed inconsistencies worth correcting in the replacement

| Finding | Why it matters | Reference |
|---|---|---|
| Attendance summaries say “Last 30 days” but change with the selected historical month. | The date scope of a metric must be clear and consistent with its calculation. | `ATTEND-07`, `GAP-02` |
| Leave types differ between Apply Leave, request filters, and calendar legend. | Users and calculations need a defined relationship between requestable, historic, and display-only leave types. | `REQUEST-10`, `CAL-05`, `GAP-01` |
| Some rows show Full Day while punch times/hours are missing. | A missing timestamp alone cannot establish attendance status; reconciliation rules need definition. | `ATTEND-06`, `GAP-03` |
| Profile editing accepts department/designation as free text, while sign-up uses dropdown lists. | Organization data and employee editing authority need a deliberate rule. This does not by itself prove unauthorized changes are possible. | `PROFILE-04`, `GAP-04` |
| Identical holiday-added notifications appear more than once. | Duplicate behavior needs investigation and a clear policy; its cause was not proven. | `NOTIFY-07`, `GAP-06` |
| Current holiday closures and historical punch-in reminders do not fully align. | Working-day reminder rules must be explicit. Historical settings may have differed. | `SCHEDULE-06` |
| `/profile` retains a Dashboard header; some quota wording is duplicated. | Labels and help should identify the correct feature clearly. | `SHELL-05`, `GAP-07` |
| Some narrow-screen dashboard edges looked crowded/clipped. | The new system needs device-level verification, not just a responsive layout declaration. | `RESP-04` |

### B. Basic controls not visible in the inspected employee views

These are potential usability improvements to discuss, not proven omissions across every role or screen:

- The notification panel showed no explicit mark-all-read, clear-all, preferences, or View all action. Read/unread persistence and unread counts remain unverified.
- The expanded request filters showed no clear-all action.
- No year selector was visible on the reviewed leave-balance and holiday views.

These are candidate improvements, not confirmed requirements for the first release.

### C. Important information missing from the record, not necessarily the product

- Exact location policy: position recording versus geofence, office coordinates/sites, radius, accuracy, permission errors, remote work, and punch-out location checks.
- Attendance policy: lateness, half-day/full-day thresholds, breaks, multiple sessions, overnight work, missed punches, and approved corrections.
- Leave policy details: accrual/proration, quota versus carry-forward, Monday/Friday restrictions described by the guide, pending reservations, overlaps, partial days, and cancellation edge cases.
- Populated request details, correction statuses, payslips, assets, and report exports; this account lacked records for these views.
- Role permissions, company/department visibility, integration configuration, migration source/exports, and delivery failures.
- Full loading/success/error behavior for actions that were not submitted.

These items should become explicit business decisions or planned validation work. They must not be filled with plausible-sounding claims about the old system.

## 9. Capture caveats and verification

Some original names describe the intended attempt rather than the actual result:

- Initial captures `01`–`03` contain “desktop” in their filenames but are narrow screenshots.
- `19-calendar-empty-selected-day` contains populated November 25 details.
- `24-directory-employee-details` did not open an employee detail view.
- Date-draft captures `06` and `08` do not prove Monday rejection or a valid complete date range.
- `04-notifications-dark` did not retain an open notification panel in its DOM snapshot; use 48–50 and the initial notification image.
- `41-guide-dark-complete` was captured in light mode.
- Some captures use a viewport screenshot fallback; their text evidence can contain more content than fits in the image.

The detailed gallery and specification call out these cases. A filename alone is not an acceptance-test result.

Packaging checks verified that local HTML references resolve, all 75 images have readable JPEG frame dimensions, feature IDs are unique, the expected route coverage is present, and the ZIP integrity check passes. Selected screenshots were visually inspected. These checks verify the artifact package, not every production workflow or hidden rule in the original HRMS.

No leave request, correction, registration, password-reset email, profile update, upload, payroll operation, or attendance punch was submitted as part of the review.

## 10. Keeping the pack usable

- Keep or transfer the complete archive or extracted folder so relative links and evidence stay together.
- Keep one unchanged discovery copy. Put later requirements decisions and implementation tracking alongside it in your chosen project workspace.
- This pack contains documentation and evidence. Application source code and credentials are not included.
- The checksum list records file contents at packaging time. Editing a file intentionally will change its fingerprint. Repackage and regenerate checksums for a new shared version instead of presenting modified files as the original evidence.
- A SHA-256 match checks file integrity against this pack's recorded list; it does not establish independent authenticity of a business rule.
- The latest complete ZIP should include this README. If receiving a loose folder, start here and open the main specification and gallery from the same folder.
