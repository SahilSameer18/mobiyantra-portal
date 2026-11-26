# HRMS implementation discussion

Created: 25 November 2026

## Purpose

This is a living record of the discussion about the new HRMS: questions, answers, decisions, unresolved details, and the eventual implementation scope.

The downloaded ZIP and the portal discovery pack remain unchanged. This file is separate from the historical record. A later agreed requirement can differ from what the old portal did; record that difference explicitly.

For a self-contained page-by-page proposal to review with management, use [HRMS Feature Scope and User Flows](hrms-feature-scope-and-flows.md). It includes the page catalog, fields/actions, connected workflows, permission boundaries, pending decisions, and an unfilled management-approval checklist. Creating that document does not record management approval.

We will discuss one topic at a time. The question bank below is a discussion guide, not a request to answer everything at once. Unanswered questions remain open; suggestions and defaults are not confirmed decisions.

## Already confirmed by the user

| ID | Confirmed direction or rule | Qualification |
|---|---|---|
| C-01 | Build the employee-facing capabilities of the existing portal first, then add new features. | Detailed first-release boundaries remain to be agreed. |
| C-02 | Create a new visual design. | Existing screenshots are functional evidence. |
| C-03 | Support mobile, tablet, and desktop throughout the system. | Exact device/browser coverage remains to be agreed. |
| C-04 | Punch-in must be restricted to employees physically within the office area (office geofence). | Exact office coordinates, allowed radius, accuracy handling, and failure rules remain open. |
| C-05 | Office hours are 10:00 AM–6:00 PM for everyone. | Office timezone remains unspecified. |
| C-06 | On working days, employees who have not punched in by 11:00 AM receive an individual reminder. | Working-day calendar, timezone, and exemptions remain open. |
| C-07 | At 6:30 PM, employees who have not punched out receive a reminder. | Recipient edge cases and repeat/session rules remain open. |
| C-08 | Full HR/Admin Portal work is deferred until after the employee-facing build. | A way to support approval and published-data dependencies still needs a decision. |
| C-09 | No further original-portal access is assumed. | Resolve unknown rules through explicit requirements rather than invented observations. |
| C-10 | Keep this planning discussion separate from the downloaded archive. | Do not rebuild or update that ZIP as part of this discussion. |
| C-11 | Include all four companies: Wazirz Sm India Private Limited, Mobiyantra Private Limited, Riddlepay Private Limited, and Finastraa Technologies Private Limited. | Cross-company visibility, management, and policy differences remain open. |
| C-12 | Estimated total employee count: approximately 50–60 initially, growing to around 200 in the future. | Planning estimates across all four companies; growth timeframe and simultaneous usage are unspecified. |
| C-13 | All four companies operate from the same office. Employees work on-site; there are no remote or hybrid arrangements. | Office city/country, timezone, and location-checking configuration remain unspecified. |
| C-14 | IT department works Monday–Friday. All other departments work Monday–Saturday. | Department determines the normal working week, regardless of designation. Everyone works 10 AM–6 PM; holiday closures and exceptional days remain open. |
| C-15 | Preserve employee designations exactly as written in the existing employee records. | Do not rename, merge, or standardize titles based on the schedule discussion. |
| C-16 | Employees may punch out from anywhere. | No office geofence or location permission is required to authorize punch-out. Whether any optional location evidence is retained remains undecided. |
| C-17 | Allow one punch-in and one punch-out per employee per day. | Multiple attendance sessions within the same day are not allowed. Day boundary/timezone, missed punches, and correction rules remain open. |
| C-18 | Automatically punch out at 11:59 PM if an employee has punched in but not punched out. | The user requested nothing additional: do not add an auto-punch-out flagging or mandatory correction workflow. Office timezone and any separate hours-credit policy remain unspecified. |
| C-19 | No full-day/half-day classification rules are requested at this stage. | When asked about hours-based, arrival/departure-based, or combined classification, the user answered "nothing". Do not invent thresholds, deductions, or default classification rules. |
| C-20 | Admin approves leave requests. | No manager/HR approval step has been requested. Admin permissions and the supporting approval interface remain to be defined. |
| C-21 | Keep the existing two requestable leave types: Paid Leave and Permission Leave (unpaid). | Other historical filter/calendar labels do not add new requestable types. Basic policy is confirmed in C-22. |
| C-22 | Paid Leave accrues at one day per month; unused paid leave carries forward without expiry; Paid Leave cannot be taken on Mondays or Fridays. Permission Leave is unlimited and unpaid, including Mondays and Fridays. | User confirmed all four rules together. Accrual start/proration, opening balances, and other detailed edge cases are not established by this confirmation. Admin approval still applies. |
| C-23 | Admin manages one shared holiday calendar for all four companies. Days marked Office Closed are excluded from leave-day counts and attendance reminders. | A holiday listing without the Office Closed flag is not automatically a closure. Approved-leave reminder exemptions and exceptional working days remain unspecified. |
| C-24 | Employees may sign up themselves, but Admin approval is required before they can use the portal. | Pending/rejected registration handling and the supporting Admin approval interface remain to be specified. Registration must not grant active employee access automatically. |
| C-25 | Employees may edit their personal details and profile photo. Only Admin may change company, department, or designation. | The old profile exposes name, phone, date of birth, gender, and photo as personal controls. Email/authentication changes and other employment fields remain unspecified. Preserve existing designation text; do not rename titles automatically. |
| C-26 | Build from scratch using the MERN stack in JavaScript: MongoDB, Express, React, and Node.js. | No existing codebase is being reused. JavaScript is selected, not TypeScript. Starting code from scratch does not decide historical-data migration. |
| C-27 | The user plans the initial deployment on Vercel and Render free tiers, then hands the project to their sir for subsequent deployment work. | Plan React frontend on Vercel and Express/Node backend on Render. MongoDB hosting is Atlas (C-28). Persistent upload storage, scheduler provision, and later hosting configuration remain undecided. |
| C-28 | Use MongoDB Atlas to host the MongoDB database. | Atlas account/cluster configuration and service tier remain to be set up within the initial hosting constraints. No credentials have been supplied. |
| C-29 | There is no fixed deadline; build the system while learning. | Use a learning-paced implementation approach with explanations and incremental verification, rather than a deadline-driven delivery schedule. |
| C-30 | Admin uploads existing payslip PDFs; employees view/download their own published documents. | No payroll calculation or payslip-generation engine is included. Upload size, period metadata, replacements, and storage remain to be specified. |
| C-31 | Employees can request repairs and returns for their assigned company assets. | Admin handles both; confirmed workflow is in C-33. Asset data fields and photo-upload limits remain to be specified. |
| C-32 | Initially, operational notifications are delivered only inside the portal. | Email, WhatsApp, and browser/OS push notification delivery are deferred. Password-recovery delivery is a separate authentication requirement and remains to be resolved. |
| C-33 | Admin handles repair and return requests. Status flow: Pending → Approved or Rejected; Approved → Completed. Return assets stay assigned until Admin confirms receipt. Require a request description/reason; allow optional photos. Employees may cancel their own Pending requests. Admin must provide a rejection reason. | Cancellation ends the request as Cancelled. Exact asset fields and photo formats/count/size remain unspecified. No additional notification event is inferred. |
| C-34 | Use JWT authentication with cookies. | Replace the earlier express-session/connect-mongo proposal. Plan HttpOnly cookies; expiry, refresh/revocation, CSRF defenses, and deployed-origin behavior require implementation design. Signing secrets remain server-side. |
| C-35 | Do not use TanStack Query; defer React Hook Form. | Axios is subsequently selected in C-38. Manual form handling remains a proposal; do not install React Hook Form without a later decision. |
| C-36 | The proposed modular backend folder structure was accepted. | Frontend feature-folder proposal was rejected; the subsequent page-based alternative has not been explicitly approved. No application folders have been created. |
| C-37 | Use bcryptjs for password hashing and verification. | Replaces the earlier Argon2id recommendation. Use asynchronous hash/compare, reject passwords exceeding 72 UTF-8 bytes rather than silently truncating, and benchmark a work factor of at least 10. JWT with cookies remains selected. |
| C-38 | Use react-router-dom for frontend routing and Axios for API requests. | User-selected packages. Version compatibility note: react-router-dom exists on the v7 line; v8 removed that package. Keep router imports/dependencies on a consistent compatible major. Lucide React is selected in C-39. Sonner was observed installed in the client manifest on 26 November 2026; no additional toast behavior is implied. |

Policies described only by the old portal's help are not automatically confirmed requirements for the new system. The monthly paid-leave accrual, indefinite carry-forward, Monday/Friday restriction, and unlimited unpaid Permission Leave have now been explicitly confirmed by the user in C-22.
| C-39 | Use Lucide React for icons. | The latest user instruction supersedes the earlier exclusion and custom-SVG/alternative-library proposals. The original visual-identity preference in C-40 still applies. |
| C-40 | The portal should have an original, deliberate visual identity and avoid a generic template or common AI-generated aesthetic. | Typography, layout, color, spacing, and icon treatment should form a coherent design appropriate to the company workflows. A visual direction still requires review. |

## Discussion status

- Current topic: initial implementation and learning plan drafted in [hrms-implementation-plan.md](hrms-implementation-plan.md). Build MERN in JavaScript from scratch, use MongoDB Atlas, and initially deploy on Vercel/Render free tiers before handoff to the user's sir. There is no fixed deadline. Full Admin Portal work remains deferred. Remaining questions are grouped by the milestone where a decision becomes necessary; they do not block drafting the plan.
- Current answers: all four companies share one office with no remote/hybrid arrangements; estimated employee count is 50–60 initially and around 200 in the future. Everyone works 10 AM–6 PM. IT works Monday–Friday; all other departments work Monday–Saturday. Preserve employee designations exactly as written; do not rename or merge them. A shared portal with company as employee information remains a working assumption. Office timezone/location configuration, holiday exceptions, and access permissions remain open.
- Technology stack: MERN with JavaScript. Initial hosting: React frontend on Vercel, Express/Node backend on Render free tiers, and database on MongoDB Atlas. File hosting, scheduler, and detailed architecture remain undecided. No fixed deadline; development will proceed while learning. Later deployment is handled by the user's sir.
- Do not begin implementation until the relevant scope and business rules have been agreed.

## Batch 1 — company structure and operating context

| ID | Question | Answer / status |
|---|---|---|
| ORG-01 | The old portal lists Wazirz Sm India Private Limited, Mobiyantra Private Limited, Riddlepay Private Limited, and Finastraa Technologies Private Limited. Should the new HRMS serve these same four companies, a subset, or a different setup? | Confirmed: include all four companies. |
| ORG-02 | Approximately how many employees will use the system at launch, and what future scale should it support? | User estimate: 50–60 employees initially, around 200 in the future across all four companies. No growth timeframe specified. |
| ORG-03 | Which office locations, cities, and countries are in scope? Are there remote or hybrid employees? | Confirmed: one shared office for all four companies, with no remote or hybrid employees. City/country and timezone remain open. |
| ORG-04 | Do 10:00 AM–6:00 PM hours apply to everyone? Which days are working days for each company/department, including Saturday rules? | Confirmed: 10 AM–6 PM for everyone. IT department Monday–Friday; all other departments Monday–Saturday. Designation does not determine the weekly schedule. Holiday and exceptional-day treatment remains open. |
| ORG-05 | Should company data be separate? Who may view or manage employees across multiple companies? | Working assumption: one shared portal; company is employee/profile information rather than a separate portal or company-specific policy boundary. Role-based visibility and management permissions remain open. |

### Company references outside registration

Saved evidence shows **Wazirz Sm India Private Limited** in the Company field on My Profile (`evidence/26-profile-dark.txt` in the discovery pack). **Mobiyantra** also appears as the portal name/logo in navigation, authentication, and help. The saved records do not show Riddlepay or Finastraa outside registration. The Mobiyantra selections in registration-menu captures were draft selections made during inspection, not proof of the signed-in employee's company. These observations do not establish how company separation or shared access works.

### Working assumption — shared company setup

The user tentatively agreed ("I guess yes") to a shared portal with company stored as an employee attribute and common features/policies across all four companies. Treat this as the current planning assumption, subject to revision, rather than a verified fact about the old database or a final decision about every policy.

Final schedule clarification: IT department works Monday–Friday; all other departments work Monday–Saturday. Department alone determines the normal weekly calendar, regardless of employee designation. Keep every employee designation exactly as written; do not merge or rename Web Designer, UI/UX Designer, Software Developer, Software Developer Intern, or other labels. Attendance, leave-day counting, and reminder eligibility must use the agreed departmental calendar, with holiday exceptions still unresolved.

Company selection is intended to appear in the employee profile and be persisted with employee information. This does not grant every employee access to other employees' private records. Roles, visibility, and who may change the company field still require explicit decisions. Exact database structure has not been chosen.


Observed department labels: the employee directory listed Accounts, IT, Office Boy, and Management. Registration additionally listed Director. The confirmed schedule is IT Monday–Friday and every other department Monday–Saturday. Preserve existing employee designation labels independently of this schedule. Whether Director should be retained as a department remains unconfirmed.

## Question bank for subsequent discussion

### A. Roles, account creation, and organization data

| ID | Question | Answer / status |
|---|---|---|
| ACCESS-01 | Which roles are needed initially: employee, HR, administrator, reporting manager, or others? What may each role see and change? | Employee and Admin roles are confirmed by the agreed workflows. Admin approves registration and leave, manages the shared holiday calendar, and controls company/department/designation changes. Full permissions and any additional roles remain unspecified. |
| ACCESS-02 | Can employees register themselves, or must HR invite/create accounts? If registration is open, who verifies company membership and activates access? | Confirmed: employee self-registration followed by required Admin approval before portal access. No automatic activation on sign-up. |
| ACCESS-03 | What is the employee identifier, and can the same person belong to more than one company or change companies? | Open |
| ACCESS-04 | Which employee fields are required, and who controls company, department, designation, join date, manager, employment type, and active status? | Confirmed: only Admin can change company, department, and designation. Required fields and control of other employment fields remain unspecified. |
| ACCESS-05 | Which profile fields may employees edit directly, and which changes require HR approval? | Confirmed: employees may edit personal details and profile photo; company, department, and designation changes are Admin-only. Email/authentication changes remain unspecified. |
| ACCESS-06 | What happens when an employee leaves: disable login, retain records, hand over pending requests, and remove directory visibility? | Open |
| ACCESS-07 | Are employee search, contact details, attendance presence, calendar entries, and birthdays visible across departments or companies? | Open |

### B. Attendance and working-time rules

| ID | Question | Answer / status |
|---|---|---|
| ATT-01 | What is the official office timezone? Do any locations follow another timezone or schedule? | Open |
| ATT-02 | How are working days determined: company calendar, department calendar, employee shift, or a combination? Which holidays are office closures? | Confirmed: IT Monday–Friday, other departments Monday–Saturday. Admin manages a shared holiday calendar; Office Closed dates are excluded from attendance reminders and leave-day counts. Exceptional working days remain unspecified. |
| ATT-03 | Is only one punch-in/out session allowed per day, or are multiple sessions and breaks supported? | Confirmed: one punch-in and one punch-out per employee per day; no multiple daily attendance sessions. Break deductions and day-boundary rules remain open. |
| ATT-04 | What determines full day, half day, late, early departure, absent, work from home, and overtime? Does total duration or scheduled presence determine each status? | Full-day/half-day classification: no rules requested at this stage; user answered "nothing". Do not introduce thresholds or penalties. Other status requirements are not established; remote/hybrid work is already excluded. |
| ATT-05 | Is there a grace period? Does late arrival change attendance/pay, or only display a warning? | Open |
| ATT-06 | What happens if someone forgets to punch out, punches after midnight, works overnight, or works on a holiday/weekend? | Confirmed: automatic punch-out at 11:59 PM for an open daily session. User declined extra flagging/mandatory correction workflow. Office timezone, any separate hours-credit policy, overnight work, and holiday/weekend handling remain unspecified. |
| ATT-07 | Should breaks be deducted, and how are hours rounded and displayed? | Open |
| ATT-08 | How far back can employees request corrections? Can they correct one time, both times, or add a missing day? | Open |
| ATT-09 | Who approves corrections, what statuses/remarks are needed, and when do corrected hours and reports update? | Open |
| ATT-10 | Should attendance summaries represent the selected month or a rolling 30-day period? Which metrics and history range are required? | Open |

### C. Location-based punching

| ID | Question | Answer / status |
|---|---|---|
| GEO-01 | Does punching need to record location, enforce an office geofence, or do both? | Confirmed: enforce an office geofence for punch-in. What location data is retained remains open. |
| GEO-02 | What offices/sites and allowed radii apply? Can employees punch at any company office or only an assigned site? | One shared office is confirmed. The user does not know the appropriate radius; no distance is selected. Proposal: keep the radius configurable and choose it after on-site testing. Exact office coordinates remain open. |
| GEO-03 | Is location checked for punch-in only, punch-out too, or every session? | Confirmed: office geofence for punch-in; punch-out allowed from anywhere without an office-location check. |
| GEO-04 | What should happen for permission denial, blocked location, timeout, inaccurate GPS, unavailable location, and being outside the allowed area? | Open |
| GEO-05 | How do approved remote work, work from home, client visits, travel, and temporary exceptions work? Who authorizes exceptions? | Open |
| GEO-06 | Should employees see their detected location/eligibility before confirming a punch, or should a successful check record it immediately? | Open |
| GEO-07 | What location evidence must be stored, who can view it, and how long should it be retained? Are additional anti-abuse checks required? | Open |

### D. Leave policy and request lifecycle

| ID | Question | Answer / status |
|---|---|---|
| LEAVE-01 | Which leave types may employees request initially? Should historic/calendar labels map to the same types? | Confirmed: Paid Leave and Permission Leave (unpaid). No additional requestable types are agreed. Any historical-label mapping remains unresolved. |
| LEAVE-02 | Should paid leave accrue at one day per month? When does accrual start, and how are partial months, probation, and opening balances treated? | Confirmed: earn one paid-leave day per month. Accrual start, partial months, probation, and opening balances remain unspecified. |
| LEAVE-03 | Does unused leave carry forward indefinitely, expire, have a cap, or reset? Can carried balance be used beyond a monthly allowance? | Confirmed: unused paid leave carries forward without expiry. Any separate usage cap and other detailed balance rules remain unspecified. |
| LEAVE-04 | Should paid leave be disallowed on Mondays/Fridays, as the old guide states? Are there other date, notice-period, or consecutive-day restrictions? | Confirmed: Paid Leave cannot be taken on Mondays or Fridays. Other date/notice restrictions remain unspecified. |
| LEAVE-05 | Are permission/unpaid leave and WFH separate concepts? Is unpaid leave unlimited, and are there approval or payroll consequences? | Confirmed: Permission Leave is unlimited and unpaid, including Mondays and Fridays; Admin approves requests. Remote/hybrid work is excluded. Payroll treatment beyond unpaid status remains unspecified. |
| LEAVE-06 | Are half-day/hourly requests needed? How are weekends, office closures, cross-month requests, and overlapping dates counted? | Partly confirmed: Office Closed dates in the shared Admin-managed calendar are excluded from leave-day counts. Half-day/hourly leave, cross-month calculations, overlapping requests, and detailed weekend-counting behavior remain unspecified. No full-day/half-day attendance classification is requested (C-19); that does not itself decide partial-day leave. |
| LEAVE-07 | Who approves each request? Is approval single-step, manager-based, HR-based, company-specific, or something else? | Confirmed: Admin is the leave approver. No additional approval level has been requested. Supporting admin access/interface remains to be defined. |
| LEAVE-08 | Do pending requests reserve balance? What happens if several requests compete for the same balance? | Open |
| LEAVE-09 | Can requests be edited or withdrawn while pending? How do approved cancellation, partial cancellation, rejection remarks, and balance restoration work? | Open |
| LEAVE-10 | Which attachment formats, size limits, required-document rules, and access permissions should apply? | Open |
| LEAVE-11 | Which request fields/history, filters, sorting, and detail actions must be available? | Open |

### E. Notifications

| ID | Question | Answer / status |
|---|---|---|
| NOTIFY-01 | Which employees are exempt from attendance reminders because of approved leave, holidays, remote work, half days, or special schedules? | Confirmed: no attendance reminders on Office Closed dates in the shared holiday calendar. Working weeks are department-based; remote/hybrid arrangements are excluded. Approved-leave and other special exemptions remain unspecified. |
| NOTIFY-02 | At 6:30 PM, should reminders go only to employees with an open session, or also employees who never punched in? What happens with multiple sessions? | Open |
| NOTIFY-03 | Are reminders sent once or repeated? How should late/corrected attendance, delayed jobs, and duplicate events be handled? | Open |
| NOTIFY-04 | Which events require in-app, email, WhatsApp, or browser push delivery? Which external accounts/providers are already available? | Confirmed: in-portal notifications only initially. Email, WhatsApp, and browser/OS push notifications are deferred. Event eligibility remains separate from channel selection; password recovery is a separate authentication requirement. |
| NOTIFY-05 | Who receives birthday alerts, at what time, and can employees hide their birthday from others? | Open |
| NOTIFY-06 | Which holiday events should notify employees: creation, edits, cancellation, or the day before? Who receives them and when? | Open |
| NOTIFY-07 | Which leave, cancellation, correction, payslip, and asset events require notifications, and who receives each? | Open |
| NOTIFY-08 | Do we need unread counts, mark-as-read/all-read, deep links, preferences, history retention, or failed-delivery tracking? | Open |

### F. Directory, calendar, dashboard, profile, and theme

| ID | Question | Answer / status |
|---|---|---|
| UI-01 | What determines directory Working/Offline/On Leave status, and how frequently should it update? | Open |
| UI-02 | Which leave statuses and employees appear on the calendar, and should it also show holidays, shifts, birthdays, or only leave? | Open |
| UI-03 | What should calendar day details and upcoming/team availability metrics contain? Who counts toward team size and availability? | Open |
| UI-04 | Which dashboard measures and shortcuts are essential, and which periods/statuses should each measure include? | Open |
| UI-05 | What profile-photo formats/limits, preview/crop/remove options, and validation are needed? | Open |
| UI-06 | Should theme default to light, dark, or device preference? Should it persist by browser or account and apply to login/recovery screens too? | Open |
| UI-07 | Which languages, date/time formats, mobile browsers, and accessibility needs should the system support? | Open |

### G. Payslips, assets, and reporting

| ID | Question | Answer / status |
|---|---|---|
| OTHER-01 | For the first release, do payslips come from an existing payroll tool/upload or from new payroll calculation? What must employees view/download? | Confirmed: Admin uploads existing payslip PDFs; employees view/download their own documents. No payroll/payslip generation engine. |
| OTHER-02 | Which payslip fields, pay periods, publication/revision rules, and permissions are required? Can a redacted/synthetic sample define the layout later? | PDF format and Admin upload are confirmed. Upload metadata, size limit, pay-period selection, publication/replacement rules, and any preview behavior remain unspecified. The system need not calculate or reconstruct payslip contents. |
| OTHER-03 | What asset details and employee actions are required: viewing, acknowledgment, issue reporting, return requests, or others? | Confirmed: view assigned assets; repair/return requests with required description/reason and optional photos; Admin review; Pending → Approved/Rejected → Completed for approved requests; employee cancellation while Pending; required Admin rejection reason. Return assignment remains until Admin confirms receipt. Asset fields and photo-upload limits remain unspecified. |
| OTHER-04 | Which personal reports, date ranges, charts, and export formats/columns are needed? | Open |
| OTHER-05 | How should approvals, corrections, holidays, payslips, and assigned assets be supplied while the full Admin Portal is deferred? What minimal operational support is necessary? | Open |

### H. Launch scope, data, security, and operation

| ID | Question | Answer / status |
|---|---|---|
| BUILD-01 | Which modules are mandatory for the first usable release, and what would make the employee-facing build complete? | Existing direction: reproduce the accessible employee-facing portal capabilities with a new responsive design; full Admin Portal work is deferred. Exact acceptance criteria for unobserved populated states and the minimal operational support for Admin actions still need planning. No observed employee module has been explicitly removed from scope. |
| BUILD-02 | What existing employee, leave, attendance, document, and balance history must migrate? What exports or other authorized sources are available? | Open |
| BUILD-03 | What login/password/session policies, additional authentication, sensitive-data access, and audit history are required? | Confirmed: JWT with cookies and bcryptjs for password hashing/verification. Protected operations must verify account approval and current permissions. Token lifetime, refresh/logout revocation, cookie/CSRF configuration, and other security policy details remain to be specified. |
| BUILD-04 | Where should data/files be hosted, and what retention, backups, recovery, and availability requirements apply? | Initial frontend/backend plan: Vercel and Render free tiers; MongoDB on Atlas; later deployment by the user's sir. Persistent upload storage, backups, retention, and recovery remain unspecified. Do not rely on Render's local filesystem for durable uploads. |
| BUILD-05 | Is there an existing codebase, preferred stack, hosting account, domain, email service, or deployment process to reuse? | Confirmed: start from scratch with MERN in JavaScript, MongoDB Atlas, React frontend on Vercel, and Express/Node backend on Render for initial deployment. Existing accounts and domain remain unspecified. Operational email/WhatsApp alerts are deferred; password-reset delivery is separate and unresolved. |
| BUILD-06 | What budget, target date, expected usage/concurrency, and operational constraints should guide implementation choices? | No fixed deadline: build while learning. Initial frontend/backend deployment uses free tiers; subsequent deployment belongs to the user's sir. Future production budget and concurrent usage remain unspecified. Employee estimates: 50–60 initially, around 200 later. |
| BUILD-07 | How will the new system be tested, accepted, rolled out, and supported? Is a pilot group or parallel run needed? | Open |

## Answers and decision log

New answers will be recorded against their question IDs. Confirmed decisions will be summarized here with their effect on scope and any exception still open.

| Decision ID | Related questions | Confirmed decision | Exceptions / unresolved details | Date |
|---|---|---|---|---|
| D-001 | ORG-01 | The new HRMS will serve all four companies listed in the existing portal. See C-11 for the names. | Employee counts, locations, shared policies, and cross-company access remain undecided. | 25 November 2026 |
| A-001 (tentative) | ORG-05 | Working assumption: one shared portal, company recorded as employee information, and common features/policies across all four companies. | Tentatively accepted by the user; confirm policy exceptions and role-based access later. Not a finding about the old database schema. | 25 November 2026 |
| D-002 | ORG-02 | Use approximately 50–60 employees at launch and around 200 in the future as planning estimates. | Growth timeframe and peak simultaneous usage remain unspecified; these figures are not user-account limits. | 25 November 2026 |
| D-003 | ORG-03 | One shared office; all employees work on-site, with no remote or hybrid arrangements. | Exact office location, timezone, and geofence/location-checking policy remain open. Historical WFH labels do not establish a new WFH request feature. | 25 November 2026 |
| D-004 (schedule superseded by D-007) | ORG-04, ATT-01, ATT-02 | Earlier discussion established common 10 AM–6 PM office hours and Saturday work for Accounts and Office Boy staff. | Use D-007 for the complete final department-based rule. | 25 November 2026 |
| D-005 | ORG-04, ATT-02 | Sweety, Admin Executive in Management, also works Saturdays. | Consistent with D-007: Management follows Monday–Saturday. Preserve her existing designation. | 25 November 2026 |
| D-006 (superseded by D-007) | ORG-04, ATT-02 | The earlier designation-based interpretation is superseded. | Do not use job titles to assign the working week or merge/rename designation labels. Use D-007 and D-008. | 25 November 2026 |
| D-007 | ORG-04, ATT-02 | Final normal working week: IT department Monday–Friday; all other departments Monday–Saturday. Everyone works 10 AM–6 PM. | Department determines the schedule, not designation. Holiday closures, exceptional days, and timezone remain open. | 25 November 2026 |
| D-008 | ACCESS-04, ORG-04 | Keep employee designations exactly as written. | No title merging or renaming; department-based calendars are independent of designation labels. | 25 November 2026 |
| D-009 | GEO-01, GEO-02 | Employees may punch in only within the office area; enforce an office geofence. | No radius chosen. Configurable radius and on-site testing are proposed, not yet a final configuration decision. See D-010 for punch-out. | 25 November 2026 |
| D-010 | GEO-03 | Punch-out is allowed from anywhere and must not depend on an office geofence or location permission. | Attendance-session eligibility still needs definition. Optional location-data retention is not decided. | 25 November 2026 |
| D-011 | ATT-03 | One punch-in and one punch-out per employee per day; a completed daily session cannot be restarted through another normal punch-in. | Accidental/missing punches must be handled through separately defined correction rules. Office timezone/day boundary remains open. | 25 November 2026 |
| D-012 (confirmed; replaces A-003) | ATT-06 | Automatically punch out an open daily session at 11:59 PM when no manual punch-out exists. The user requested nothing additional. | No extra flagging or mandatory correction workflow. Do not create attendance for employees who never punched in or overwrite a completed manual punch-out. Office timezone and any separate hours-credit policy remain unspecified. | 25 November 2026 |
| D-013 | ATT-04 | No full-day/half-day classification rules are requested for now. | Do not invent required-hours thresholds, arrival/departure thresholds, deductions, or a default Full Day/Half Day label based on this answer. | 25 November 2026 |
| D-014 | LEAVE-07 | Leave requests are approved by Admin. | No additional approver or approval level requested. Full Admin Portal work remains deferred; the means of supporting approvals is still an implementation dependency. | 25 November 2026 |
| D-015 | LEAVE-01 | Retain Paid Leave and Permission Leave (unpaid) as the two requestable leave types. | Confirmed types do not by themselves confirm every old accrual, carry-forward, or date restriction. | 25 November 2026 |
| D-016 | LEAVE-02, LEAVE-03, LEAVE-04, LEAVE-05 | Confirm all four basic rules: one paid day earned per month; unused paid leave carries forward without expiry; Paid Leave disallowed on Mondays/Fridays; Permission Leave unlimited and unpaid, including Mondays/Fridays. | User answered "yupp" to the grouped confirmation. Detailed accrual edge cases and other unasked restrictions are not inferred. | 26 November 2026 |
| D-017 | ATT-02, LEAVE-06, NOTIFY-01 | One shared Admin-managed holiday calendar applies to all four companies. Office Closed dates do not count as leave days and do not trigger attendance reminders. | This does not classify every public holiday as a closure or settle approved-leave exemptions and exceptional working days. | 26 November 2026 |
| D-018 | ACCESS-02 | Employees self-register; Admin approval is required before they may use the portal. | Pending/rejected account states and the Admin-side approval mechanism remain to be specified. | 26 November 2026 |
| D-019 | ACCESS-04, ACCESS-05 | Employees may edit personal details and profile photo; only Admin may change company, department, or designation. | No automatic title renaming. Email/authentication changes and control of other employment fields remain unspecified. | 26 November 2026 |
| D-020 | BUILD-05 | Build from scratch using MongoDB, Express, React, and Node.js, with JavaScript throughout. | Package versions, detailed structure, and supporting libraries remain implementation choices. No existing codebase reuse; migration is a separate unresolved question. | 26 November 2026 |
| D-021 | BUILD-04, BUILD-06 | Initial deployment on Vercel and Render free tiers; hand the project to the user's sir for later deployment work. | Database hosting subsequently confirmed as Atlas in D-022. File hosting and scheduling remain unresolved. No paid deployment action is authorized by this decision. | 26 November 2026 |
| D-022 | BUILD-04, BUILD-05 | Use MongoDB Atlas for database hosting. | Account, cluster, tier, and secure connection configuration still need setup. | 26 November 2026 |
| D-023 | BUILD-06 | No fixed deadline; build the HRMS while learning. | Implement in understandable increments, explaining purpose, behavior, and verification along the way. This does not reduce the agreed functional scope. | 26 November 2026 |
| D-024 | OTHER-01, OTHER-02 | Admin uploads existing payslip PDFs for employee access; no generation/payroll engine. | Define upload metadata, limits, storage, and revisions before implementation. | 26 November 2026 |
| D-025 | OTHER-03 | Employees may request repairs and returns for assigned assets. | Reviewer and request/fulfillment lifecycle remain open; submitting a request does not itself establish a completed physical return. | 26 November 2026 |
| D-026 | NOTIFY-04 | Use in-portal operational notifications only initially; defer email, WhatsApp, and browser/OS push alerts. | This selects the initial channel, not additional event types. Password-reset delivery remains a separate unresolved authentication concern. | 26 November 2026 |
| D-027 | OTHER-03 | Admin handles both asset request types. Pending requests may be approved/rejected by Admin or cancelled by the requesting employee; approved requests progress to Completed. Return assignment stays until Admin confirms receipt. Required description/reason, optional photos, and required Admin rejection reason. | User confirmed both grouped question batches. File limits and asset fields remain unspecified; no new alert type added. | 26 November 2026 |
| D-028 | BUILD-03 | Use JWT with cookies; the earlier express-session/connect-mongo approach is not selected. | jsonwebtoken and cookie-parser are the proposed implementation packages; secure cookie, verification, expiry, CSRF, and logout/revocation behavior need implementation design. | 26 November 2026 |
| D-029 | Frontend package discussion | Exclude TanStack Query; leave React Hook Form undecided/deferred and discuss the server first. | Do not install those frontend packages as part of setup. | 26 November 2026 |
| D-030 | BUILD-03 | Select bcryptjs instead of the earlier Argon2id recommendation for password hashing. | JWT/cookie approach unchanged. Technical safeguards: async hash/compare, explicit 72-byte UTF-8 input limit, and a benchmarked work factor of at least 10. | 26 November 2026 |
| D-031 | Frontend package discussion | Select react-router-dom and Axios. | Axios replaces the earlier native-fetch proposal. For the requested router package name use the compatible v7 line; official v8 documentation removes react-router-dom. No packages installed by recording this choice. | 26 November 2026 |
| D-032 (icon choice superseded by D-033) | Frontend package and design discussion | Earlier exclusion of Lucide React is superseded. The original visual-design preference remains in effect. | Use D-033 for the current icon choice. | 26 November 2026 |
| D-033 | Frontend icon discussion | User selected Lucide React. | Do not author a custom SVG icon set or install an alternative icon library for this decision. Sonner is already present in the inspected client manifest. | 26 November 2026 |

### Automatic punch-out — scope clarification

The closing time is 11:59 PM. After being asked about flagging the entry and requiring correction, the user replied "nothing more". Record only the automatic closing behavior, with no additional flagging or mandatory correction workflow. No separate hours cap or overtime-credit policy was agreed, and none should be silently introduced. If hours are calculated directly from the punch timestamps, a 10 AM punch-in and 11:59 PM punch-out span 13 hours 59 minutes; that arithmetic does not establish an overtime-pay policy.

## Technical discussion notes — location feasibility

The basic single-office geofence is a straightforward implementation task: request device location, compare its distance with a configured office point/radius, and validate eligibility before recording a punch. Reliable handling of permission denial, unavailable/inaccurate location, retries, and duplicate punches needs deliberate implementation and testing. This is a feasibility assessment, not a time estimate or a completed architecture decision.

Browser geolocation requires a secure context and user permission. Readings include an accuracy estimate, and requesting high accuracy does not guarantee a precise result. Reference: [MDN getCurrentPosition documentation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition) and [MDN location accuracy documentation](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/accuracy). These technical notes do not select an office radius or resolve the open location-policy questions.

## Planned outcome of the discussion

### Initial deployment and handoff notes

The selected stack is MERN in JavaScript. Prepare deployment instructions and environment-variable placeholders for the frontend and backend, along with database, file-storage, and scheduling requirements, so later hosting can be handled by the user's sir. Do not include secrets in the handoff documentation or frontend code.

Hosting facts checked against official documentation on 26 November 2026:

- [Render free services](https://render.com/docs/free) spin down after 15 minutes without inbound traffic. Files written to their local filesystem are lost on redeploy/restart/spin-down. Durable employee documents/photos need separately configured persistent storage.
- The [Vercel legacy Cron Jobs limits](https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing) list once-daily execution per Hobby cron job with per-hour scheduling precision. That does not meet an exact 11:59 PM invocation requirement. The page notes migration toward Vercel Schedules; no scheduler product has been selected or evaluated for this project.

Engineering implication: a timer running only inside a sleeping Render web process cannot be the sole mechanism for 11 AM reminders, 6:30 PM reminders, birthday/holiday events, and 11:59 PM automatic punch-out. The implementation plan must specify scheduled execution and restart/missed-run handling separately. These are deployment constraints to address; they do not change the confirmed business rules or select an additional paid service.

Once the relevant questions are resolved, produce an agreed first-release scope, explicit business rules, module dependencies, acceptance criteria, technology choices, and implementation milestones. This section describes the intended output; those choices have not been made yet.
