# HRMS backend — complete module assignments

Prepared: 26 November 2026
Updated: 27 November 2026 — latest ownership split and `employees` module name

This is the full backend assignment for each developer, not a list of first tasks. It does not start feature implementation. Authentication is assigned to Teammate A; the lead is not its implementation owner. Feature coding begins after handoff against these contracts.

Read this with [Shared backend contracts](backend-contracts.md) and the previously prepared feature scope/flows (not present in the current `docs` folder). Contracts define field names and shared interfaces; the scope document defines product behavior. This document assigns implementation work. It does not record management approval.

## How to use this assignment

- API paths below are proposed implementation contracts under `/api`, with no version segment. Settle any route changes with the lead before integration.
- `Employee` means an authenticated, active account acting on its own records. `Admin` means an explicitly authorized Admin operation. Public endpoints are identified separately.
- All JSON inputs/filters require validation. Use the response and error envelopes in the shared contract. Services return plain data; controllers add the envelope once.
- IDs in paths refer to the named resource. Supplying an ID never grants access to it. Employee identity comes from the authenticated actor, not a body/query employee ID.
- List APIs use agreed pagination where applicable. Each table lists minimum inputs and output content; IDs, timestamps, and pagination follow the shared contract.
- File responses are authorized binary/stream responses or short-lived authorized links, not JSON-wrapped file bytes. Storage implementation belongs to the lead.
- A policy marked **unresolved** is part of the eventual workflow but must be settled before that part is declared complete. Build settled portions using fictional data in the meantime.

## Ownership at a glance

| Owner | Complete modules |
|---|---|
| Lead | Leave, Reports, Organizations, Notifications (last), shared backend setup |
| Teammate A (stronger teammate) | Auth, Attendance, Dashboard, Calendar |
| Teammate B | Employees, Assets, Holidays, Payslips |

Each owner implements employee and Admin operations within the assigned modules, including validation, services, persistence where needed, relevant checks, and module API notes. Admin is not a separate duplicate backend.

### Difficulty, workload, and dependencies

| Owner | Module | Difficulty | Depends on |
|---|---|---|---|
| Teammate A | Auth | Hard | Teammate B's Employee model |
| Teammate B | Employees | Medium | Lead-owned Organizations; A's Auth for protected access |
| Teammate B | Assets | Medium–Hard | Employees, Auth, Lead-owned file storage |
| Lead | Notifications (last) | Hard | Attendance/Leave events, Holidays, user information, scheduled execution |
| Lead | Shared backend setup | Medium | Configuration, database, middleware, storage setup |
| Teammate A | Attendance | Hard | Employees, department schedules, Holidays, Auth |
| Lead | Leave | Hardest | Employees, department schedules, Holidays, Auth; storage for attachments |
| Teammate A | Calendar | Easy–Medium | Approved Leave; scoped employee information |
| Teammate A | Dashboard | Easy–Medium | Attendance, Leave, basic user information |
| Lead | Reports | Medium | Leave requests and balances |
| Lead | Organizations | Easy | Database; Auth for Admin changes |
| Teammate B | Holidays | Easy | Database; Auth for Admin changes |
| Teammate B | Payslips | Medium | Employees, Auth, Lead-owned file-storage helpers |

The lead owns integration/review in addition to Leave/Reports/Organizations and later Notifications. Teammate A owns security and attendance. Teammate B has a substantial workload: employee management, asset workflows, holidays, and payslips; this is not an easy-only assignment. Notification implementation happens last and does not block core Attendance/Leave development. Shared dependencies remain, but file ownership does not overlap.

## Lead — leave, reports, organizations, notifications

Own `src/modules/leave/`, `reports/`, `organizations/`, and `notifications/`. Also own shared setup, configuration, storage helpers, router registration, shared working-day helper, and integration/review. Implement Notifications last. Teammate A implements Auth and its authentication/permission middleware; the lead coordinates router registration and other shared setup edits.

### Organizations

Provide shared company/department/designation lookup data and supporting Admin maintenance. Shared schedules are department data; The lead owns the shared working-day helper used by Attendance and Leave.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `GET /api/organizations/companies` | Public signup lookup | None | Selectable company IDs/names |
| `GET /api/organizations/departments` | Public signup lookup | None | Selectable department IDs/names |
| `GET /api/organizations/designations` | Public signup lookup | None | Selectable designation IDs/names |
| `POST /api/organizations/<collection>` | Admin | `name`; department schedule where applicable | Created lookup record |
| `PATCH /api/organizations/<collection>/:id` | Admin | Allowed label/active fields; department schedule under settled policy | Updated record |

`<collection>` means one of the three explicit resources above, not arbitrary collection names supplied to database queries. Company creation beyond the four agreed companies requires a scope decision; the generic route proposal does not authorize expansion.

Required behavior: seed the exact four company labels from the contract; retain designation text; IT schedule Monday–Friday, others Monday–Saturday; public lookups reveal no employee records; referenced records are not silently deleted. Confirm Director's department classification before seeding it. Do not add holiday logic here.

Completion checks: exact agreed seed labels; schedule data is correct; inactive records are not offered as new signup choices; existing references still resolve; Admin-only mutations are enforced.

### Leave

Own Paid/Permission requests, balance ledger/calculation, accrual, decisions, cancellation effects, history, and all leave-related source results for display modules.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `POST /api/leave/requests` | Employee | `type`, `startDate`, `endDate`, `reason`, optional attachment | Validated pending request |
| `GET /api/leave/requests/me` | Employee | Date range, `status`, `type`, search, allowed sort, pagination | Own requests with matching totals |
| `GET /api/leave/requests/:id` | Owner or authorized Admin | Request ID | Permitted request details/attachment metadata |
| `GET /api/leave/requests` | Admin | Employee/status/date filters, pagination | Review list |
| `PATCH /api/leave/requests/:id/decision` | Admin | `decision: approved/rejected`, remarks per settled policy | Decision and consistent balance effects |
| `POST /api/leave/requests/:id/cancellation` | Owner | Reason/fields after cancellation policy is settled | Cancellation review request; not immediate balance restoration |
| `PATCH /api/leave/requests/:id/cancellation/decision` | Admin | Decision per settled cancellation policy | Cancellation outcome and applicable restoration |
| `GET /api/leave/balance/me` | Employee | `asOfDate` if supported | Authoritative paid balance and Permission information |
| `GET /api/leave/usage/me` | Employee | `year` | Accrued/used/remaining totals and monthly breakdown |
| `GET /api/leave/requests/:id/attachment` | Owner or authorized Admin | Request ID | Authorized supporting file access |

Required behavior:

- Two types only: paid and permission. Required reason; valid date range; validate optional attachments through the lead's storage interface.
- Earn one paid day per month, carry forward indefinitely. Do not interpret this accrual rate as an automatically approved monthly use cap.
- Paid Leave prohibited Mondays/Fridays; Permission allowed then, unlimited and unpaid. Both require Admin decision.
- Apply department working calendars and Office Closed flags under settled date-counting rules.
- Keep pending/rejected/cancelled distinct. Repeated approval/cancellation must not double-deduct or double-restore balance. Concurrency must not overspend available paid leave.
- Store enough balance history to explain credits, usage, and reversals. Do not store a second balance in Dashboard or Reports.
- Approved leave/cancellation must consistently affect source data, calendar, and summaries. Confirmed notification calls are integrated later when the lead delivers Notifications.
- Attachments observed: PDF, DOC/DOCX, JPG/JPEG, PNG with a displayed 5 MB limit. Treat this as reference behavior; finalize actual storage/validation limits with the lead.

Export the shared functions: `getLeaveBalance`, `getLeaveSummary`, `listEmployeeLeaveRequests`, `listCalendarLeave`. Also supply authoritative monthly accrued/used/remaining data for the Leave Balance page; agree that function's exact shape before its consumer implements it.

Job owned here: monthly accrual, keyed once per employee/eligible month. Determine entitlement from settled join-date/accrual policy rather than guessing.

Unresolved: accrual start/proration/opening balance, monthly cap if any, pending reservation, overlaps, partial/past-date leave, weekend/range treatment, Monday/Friday range interpretation, cancellation eligibility/intermediate state, remarks policy. Pending withdrawal/editing is not automatically included.

Completion checks: accrual retry safe; carry-forward retained; correct paid/permission treatment; closed-day/date rules consistent; cross-employee access denied; competing approvals handled; cancellation changes balance once after acceptance; all shared functions match agreed shapes and definitions.

### Reports

Provide personal leave analytics and an export of the same permitted data. This assignment does not include payroll or company-wide attendance reporting.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `GET /api/reports/leave` | Employee | `from`, `to`; agreed status/type filters | Summary counts, paid balance with explicit as-of date, approved breakdowns if defined |
| `GET /api/reports/leave/export` | Employee | Same filters; agreed export format | Download of the same scoped permitted report data |

Dependencies: `getLeaveSummary`, `getLeaveBalance`, `listEmployeeLeaveRequests`; extra monthly chart series only after the source owner agrees its definition. Export must include all matching permitted rows, not just the first list page. Bound export ranges/size through an agreed implementation rule.

Required behavior: Total/Approved/Pending/Rejected counts and relevant cancelled treatment agree with the shared range definitions; balance as-of date is explicit; chart series reflect real data. Do not decide payroll deductions or recalculate balances. No-data export is unavailable with a documented response, not a misleading populated file.

Unresolved: exact reporting periods, charts/series, columns, export type, empty-export response. CSV is a proposal, not a promise of PDF/XLSX generation. If selected, safely escape cells and prevent spreadsheet formula interpretation of untrusted text.

Completion checks: counts match source services; filters match between screen/export; all rows exported; private fields excluded; empty data handled; source errors do not become fabricated reports; format/columns documented and tested after selection.

### Notifications — implement last

Own in-portal notification records, per-recipient history, event deduplication, and birthday/holiday event jobs. No email/WhatsApp/browser-push operational alerts initially.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `GET /api/notifications/me` | Authenticated recipient, employee or Admin | Pagination | Own ordered history: ID, type, title, message, timestamp |

Notification creation is an internal service, not a public endpoint. Export `createNotification({ recipientId, eventKey, type, title, message })` as defined in the contract. Do not add mark-read/delete/preferences/count APIs before those product decisions are made.

| Event | Recipient / eligibility | Timing |
|---|---|---|
| Missing punch-in | Eligible employee without punch-in on their working day; not Office Closed | 11:00 office time |
| Missing punch-out | Eligible employee under the final rule; not Office Closed | 18:30 office time |
| Leave submitted | Authorized Admin recipient(s) | After pending request is saved |
| Leave approved/rejected | Request owner | After decision is saved |
| Birthday | Audience unresolved | Time unresolved |
| Holiday added | Eligible audience unresolved | After creation under settled event rules |
| Holiday tomorrow | Eligible audience unresolved | Time unresolved |

Teammate A owns Attendance reminder eligibility; the lead owns Leave event inputs. The lead implements Notifications last: persistence/history, reminder scheduling/delivery, birthday/holiday jobs, and event integration. Teammate B provides holiday records. Coordinate required source queries with their owner; never expose DOB in public APIs to support a server job. Core leave decisions and attendance actions must work before alert calls exist. After integration, notification failures must not undo or duplicate those business actions.

Completion checks: cross-recipient access denied; paging/order/empty history works; repeat events do not duplicate; working-calendar/timezone rules applied; notification retry does not repeat the underlying leave decision. Settle the 18:30 never-punched-in case, approved-leave exemptions, audience/timing, retention, and scheduler provision before calling jobs complete.

## Teammate A — authentication, attendance, dashboard, calendar

Own `src/modules/auth/`, `attendance/`, `dashboard/`, and `calendar/`. Auth consumes the single Employee account model owned by Teammate B. Dashboard and Calendar consume the lead's Leave services. Attendance uses department/holiday records and the agreed shared working-day helper. Do not implement a second account model or leave balance.

### Auth

Deliver self-registration, approved-account login, logout, password recovery, protected-request identity, and controlled first-Admin provisioning. The Employee model lives in Employees; do not create a second employee collection in Auth.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `POST /api/auth/signup` | Public | Employee signup fields from the shared contract, `password`, `confirmPassword` | Pending registration acknowledgment; no employee session |
| `POST /api/auth/login` | Public | `email`, `password` | Approved account's safe user data; JWT set through HttpOnly cookie |
| `POST /api/auth/logout` | Authenticated | No employee identity in body | Clear authentication cookie and apply agreed invalidation policy |
| `GET /api/auth/me` | Authenticated | None | Safe current-account data for client startup |
| `POST /api/auth/forgot-password` | Public | `email` | Generic acknowledgment; initiate eligible recovery without disclosing account existence |
| `POST /api/auth/reset-password` | Public with valid recovery token | `token`, `password`, `confirmPassword` | Password replaced according to recovery/session policy |

Required behavior:

- Server sets signup role/status to `employee`/`pending`; reject attempts to grant privileges through submitted fields.
- Normalize email, enforce uniqueness, hash/compare asynchronously with bcryptjs. Do not save confirm-password or return password hashes.
- Only active accounts access protected features. Middleware checks current account status and provides `req.user.id` and `req.user.role`.
- Provide shared `authenticate` and `requireAdmin` middleware. Resource ownership still belongs in module operations.
- Protect cookie-authenticated mutations against CSRF and configure allowed frontend origins/cookie attributes for the actual deployment.
- Initial Admin provisioning is controlled setup, not public signup.
- Validate password inputs including bcrypt's byte-length constraint from the shared planning record; do not silently truncate passwords.

Unresolved before completion: password policy, cookie/JWT lifetime, refresh/revocation/logout semantics, reset-token expiry/reuse and delivery provider, pending/rejected-account messaging and reapplication. These details are not delegated to teammates.

Completion checks: duplicate signup handled; pending login denied; active login works; wrong password denied; role escalation denied; expired/invalid authentication rejected; disabled account loses access; logout/recovery follow their settled policies; secrets never enter responses or committed settings.

### Attendance

Own daily sessions, geofence validation, durations, history, voluntary corrections, and automatic closing.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `GET /api/attendance/today` | Employee | None | Date, derived status, punch times, worked minutes |
| `POST /api/attendance/punch-in` | Employee | `latitude`, `longitude`, `accuracy` in meters | Open daily session after server geofence validation |
| `POST /api/attendance/punch-out` | Employee | No location required | Closed daily session |
| `GET /api/attendance/me` | Employee | `from`, `to`, pagination | Own dated attendance history and agreed scoped summary |
| `POST /api/attendance/:id/corrections` | Record owner | Proposed `punchInAt`, `punchOutAt`, required `reason` | Correction request under settled correction rules |
| `GET /api/attendance/corrections/me` | Employee | Agreed filters, pagination | Own correction history |
| `GET /api/attendance/corrections` | Admin reviewer | Agreed filters, pagination | Review queue |
| `PATCH /api/attendance/corrections/:id/decision` | Admin reviewer | Decision/remarks per settled policy | Review outcome; accepted corrections update attendance |

Required behavior:

- Server time records punches. Validate coordinates and compare against configured office geofence; do not trust a submitted `insideOffice` flag.
- Enforce one daily session per employee and office-local date, including concurrent submissions.
- Punch-out works from anywhere without requesting location. It requires an open own session.
- Derive duration centrally and return minutes. No full-day/half-day/WFH/late/overtime policy is invented.
- At 23:59 office time, close open daily sessions; never overwrite a manual punch-out or create attendance for someone who never punched in.
- Corrections are voluntary, not a compulsory consequence of automatic closing.
- Export `getTodayAttendance({ employeeId })` from the shared contract.

Jobs owned here: automatic punch-out; also define attendance reminder eligibility. Do not import/call a nonexistent notification service. When the lead implements Notifications last, coordinate reminder scheduling and alert creation through its agreed service.

Unresolved: office timezone/coordinates/radius/accuracy, exceptional working days, correction age/status/review details, historic schedule changes, rounding/credited-hours policy, weekend/overnight punching. Implement no implicit penalties.

Completion checks: valid office punch-in; outside-office rejection; invalid coordinates rejected; repeat/concurrent punch blocked; location-free punch-out; no punch-out without an open session; automatic/manual close race handled once; correction ownership and decision rules enforced; dates correct around local midnight.

### Dashboard

Compose the employee's agreed dashboard data from existing services. Return structured JSON, not chart-specific markup or CSS.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `GET /api/dashboard` | Employee | Optional explicit summary `from`, `to` | Own safe identity, attendance, balance, request counts, recent requests, and scope dates |

Suggested response sections: `employee`, `attendance`, `leaveBalance`, `requestSummary`, `recentRequests`, `period`. These are composition keys; source objects inside follow the shared service contracts. Defaults for period/recent-item count must be agreed and documented rather than changing per developer.

Dependencies: Teammate B's safe employee identity service; `getTodayAttendance` from your own Attendance module; `getLeaveBalance`, `getLeaveSummary`, and `listEmployeeLeaveRequests` from the lead's Leave module. Confirm extra accrued/used/monthly fields through the source service before adding them.

Required behavior: show the accrual rate separately from available carried balance; correct date scopes; meaningful zeros/empty lists; no invented payroll, WFH, half-day, company-wide attendance, or productivity metrics. Do not return fake zero values after a source failure. A refresh must read consistent current results after source decisions.

Completion checks: own data only; source values preserved; balance agrees with Leave; recent requests and counts use declared scopes; source failures handled through shared errors; no new storage/calculation layer.

### Calendar

Provide data for month navigation, selected-day details, On Leave Today, upcoming leave, and permitted availability summaries. Visual cell layout/overflow behavior belongs to the frontend; backend must not omit records because a calendar cell is small.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `GET /api/calendar` | Employee under visibility policy | `from`, `to` | Authorized leave entries for the inclusive range |
| `GET /api/calendar/day` | Employee under visibility policy | `date` | Authorized employee names and leave types on that date |
| `GET /api/calendar/summary` | Employee under visibility policy | `date`, `upcomingTo` | On-leave-today and upcoming lists; defined availability counts only |

Dependencies: `listCalendarLeave` from Leave; `listHolidays` only if holiday display is approved; a scoped roster count from Teammate B's Employees if team-size/availability is retained. Agree that roster service with B and the lead before implementing counts; do not fetch private employee documents yourself.

Required behavior: approved, noncancelled leave only under the initial contract; respect viewer visibility; no reasons/attachments/contact details; consistent date filtering and unique-person counts. Do not equate on-leave counts with live attendance/presence. Multiple requests must not accidentally count one person twice.

Unresolved: team/company audience, upcoming window, holiday inclusion, summary definition. Develop against fictional visibility fixtures until settled.

Completion checks: correct range/day data, empty dates, month/year boundaries, cancelled leave disappears, unauthorized coworkers stay hidden, and no independent leave-day expansion/calculation. Validate final integration against real source services.

## Teammate B — employees, assets, holidays, payslips

Own `src/modules/employees/`, `assets/`, `holidays/`, and `payslips/`. Own the Employee account model and employee services; coordinate its fields with Teammate A before Auth implementation. Use A's authentication/permission middleware and the lead's shared storage helpers. Assets includes employee and Admin repair/return workflows, not just equipment listing.

### Employees

Implement the shared Employee model, safe profile serializers, account approval, employment updates, and permitted employee directory.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `GET /api/employees/me` | Employee | None | Own profile, permitted employment labels, authorized photo reference |
| `PATCH /api/employees/me` | Employee | Allowed `fullName`, `phone`, `dateOfBirth`, `gender` | Updated own profile |
| `PUT /api/employees/me/photo` | Employee | Image file under agreed limits | Saved photo display reference |
| `GET /api/employees` | Employee; restricted directory | `search`, `department`, `page`, `limit` | Permitted directory fields only |
| `GET /api/employees/registrations` | Admin | `status`, pagination | Registration review list |
| `PATCH /api/employees/:id/approval` | Admin | Approval/rejection `decision`; remarks per settled policy | Updated registration status |
| `PATCH /api/employees/:id/employment` | Admin | Allowed `company`, `department`, `designation`; verified join date if authorized | Updated employment details |

Required behavior:

- Export `getEmployeeContext({ userId })` exactly as the shared contract specifies; this unblocks Attendance and Leave. Own and share the single Employee model with Auth.
- Allow-list profile changes. Employee profile updates cannot change role, status, email, company, department, designation, or join date.
- Validate organization references. Preserve designation wording.
- Directory search must only use/expose permitted fields. Do not automatically expose DOB, contact details, attendance presence, or all-company private records.
- If directory Working/Offline/On Leave indicators are retained, source them from Teammate A's agreed services; do not invent presence rules in Employees.

Unresolved: directory audience/contact fields/presence definition, join-date verification, account reactivation and rejected-registration handling, historical schedule effects after department changes. Do not add hard deletion or unrestricted employee management endpoints.

Completion checks: own-profile edit works; forbidden fields cannot be changed; approval is Admin-only; directory is filtered/paginated and private fields are absent; employment references are validated; invalid/nonexistent IDs and empty results behave consistently.

### Assets

Own asset identification, assignment records, and the full repair/return lifecycle. Use the lead's shared private-file helpers for optional request photos.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `GET /api/assets/me` | Employee | Pagination if needed | Own assigned equipment |
| `GET /api/assets` | Admin | Agreed search/assignment filters, pagination | Asset management list |
| `POST /api/assets` | Admin | Agreed asset-identifying fields | Asset record |
| `POST /api/assets/:id/assignments` | Admin | `employeeId` | Assignment to the selected employee |
| `POST /api/assets/:id/requests` | Employee assigned that asset | `type: repair/return`, `description`, optional photos | Pending request |
| `GET /api/assets/requests/me` | Employee | `status`, pagination | Own requests and rejection feedback |
| `GET /api/assets/requests` | Admin | Agreed filters, pagination | Requests for review/completion |
| `PATCH /api/assets/requests/:id/cancel` | Request owner | None | Cancelled request, only from pending |
| `PATCH /api/assets/requests/:id/decision` | Admin | `decision: approved/rejected`, required rejection reason when rejecting | Request decision |
| `PATCH /api/assets/requests/:id/complete` | Admin | Return-receipt confirmation for returns | Completed request and corresponding assignment update |

Required behavior:

- Requests apply only to equipment assigned to the actor. A submitted asset ID is not proof of assignment.
- Pending -> approved/rejected; approved -> completed; employee may cancel pending only.
- Description required; photos optional; rejection reason required.
- Return submission/approval does not unassign the asset. Only confirmed physical receipt/completion does so.
- Retain assignment/request history. No payroll deduction, replacement request, or asset notification event is implied.

Unresolved: exact asset metadata/source, assignment conflict rules, duplicate open request policy, photo limits/formats/storage. Settle the assignment model before allowing competing assignments.

Completion checks: another employee's assets/requests cannot be used; invalid transitions fail; rejected requests keep reasons; returns stay assigned until receipt; completion/cancellation retries do not repeat side effects.

### Holidays

Own the shared holiday list and explicit office closure flag for all four companies.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `GET /api/holidays` | Employee/Admin | `from`, `to` | Holiday list grouped by frontend as needed |
| `POST /api/holidays` | Admin | `name`, `date`, `officeClosed`; category if retained | Saved holiday |
| `PATCH /api/holidays/:id` | Admin | Allowed holiday fields | Updated holiday |
| `DELETE /api/holidays/:id` | Admin | Holiday ID | Remove listing according to agreed historic-effect policy |

Deletion is a proposed operation requiring confirmation of historical effects before enabling it against real records. Do not let edits/deletion silently recalculate accepted past leave.

Required behavior: valid date-only storage; explicit Boolean closure flag; listing does not automatically mean closed; closure affects leave counts and reminder eligibility; export `listHolidays({ from, to })`. Reuse this source in working-day logic. Do not copy old holiday dates into future years as approved company policy.

Completion checks: Admin-only changes, proper date filters/empty list, correct closure distinction, and integration with leave/attendance tests. Resolve edit/cancellation event rules and exceptional working days before implementing those effects.

### Payslips

Own Admin-uploaded PDFs and each employee's authorized document access. This is not salary calculation or payslip generation.

| Method and path | Access | Inputs | Result |
|---|---|---|---|
| `POST /api/payslips` | Admin | `employeeId`, PDF, agreed period metadata | Published document record under agreed publication policy |
| `GET /api/payslips/me` | Employee | Period filters, pagination | Own published payslip metadata |
| `GET /api/payslips` | Admin | `employeeId`, period filters, pagination | Authorized document management list |
| `GET /api/payslips/:id/file` | Record owner or authorized Admin | Document ID; optional agreed preview/download flag | Authorized PDF access |

`year` and `month` are proposed pay-period fields, not a settled publication/revision policy. Define them before implementation. No replacement/delete endpoint is assigned until revision rules are settled.

Completion checks: PDF type/content/size validated; employee target exists; cross-employee retrieval denied; list and file permissions agree; missing file handled; private storage metadata/URLs are not exposed; temporary server disk is not the final store. Payslip notifications remain outside confirmed events.

### Starting before shared dependencies are finished

Use the documented fictional fixtures for unfinished dependencies. Teammate A tests Auth against the agreed Employee model shape and Dashboard/Calendar against Leave service outputs. Teammate B tests using isolated actors and storage metadata until real Auth/storage is ready. The lead tests Leave using the agreed employee/holiday context. No fake identity override or sample fallback is mounted in the real app.

## Dependency handoff and integration sequence

Use the exact fictional IDs/results in [the shared contract's handoff dataset](backend-contracts.md#shared-fictional-dataset-for-handoff). Do not make different mock employee IDs or response names in each module.

| Producer | Supplies | Consumer | How the consumer starts now |
|---|---|---|---|
| Teammate B / Employees | `getEmployeeContext` | Attendance, Leave, scheduled eligibility | Fictional employee context with the stated IT working days |
| Lead / Organizations | Department schedules and lookup IDs/labels | Employees, Attendance, Leave | Agreed organization fixtures; the lead supplies the shared working-day helper |
| Teammate B / Employees | `getEmployeeDisplay` | Dashboard | Fictional Alex identity result |
| Teammate B / Employees | `getCalendarRosterCount` under visibility policy | Calendar summary | Fictional two-person count; no production roster exposure |
| Teammate A / Auth | `authenticate`, `requireAdmin`, `req.user` shape | All protected controllers | Test-only actor fixture; shared app routes stay unmounted until real auth exists |
| Lead / Storage | Authorized upload/retrieval helpers | Lead's Leave attachments; Teammate B's Assets/Payslips | Test file metadata only; actual file provider/limits remain a handoff dependency |
| Teammate A / Attendance | `getTodayAttendance` | Dashboard | Not-punched/open/completed scenarios from the contract |
| Lead / Leave | `getLeaveBalance`, `getLeaveSummary`, `listEmployeeLeaveRequests` | Dashboard, Reports | Six-day mock result and the four request records; no duplicated accrual logic |
| Lead / Leave | `listCalendarLeave` | Calendar | Approved November 24 entry; pending/rejected/cancelled exclusions |
| Teammate B / Holidays | `listHolidays` with closure records only | Attendance/Leave; Calendar if enabled | Sample closure versus nonclosure records; working-day calculations use the Lead-owned shared helper |
| Lead / Notifications (last) | `createNotification` | Leave and agreed event producers | Stable recipient/event key and retry example |

### What each person does while dependencies are unfinished

**Lead:** implements Organizations, Leave, Reports, shared working-day/storage helpers, and app integration; implements Notifications last. Coordinates contracts and shared files. Auth belongs to A, Employees/Assets/Payslips to B.

**Teammate A:** implements Auth and Attendance, then Dashboard/Calendar against Lead-owned Leave results. Coordinates the Employee model with B and uses the shared working-day helper. Provides attendance event inputs for later notification integration.

**Teammate B:** implements Employees, Assets, Holidays, and Payslips. Supplies the Employee model/context to A and the lead, and holiday records to Attendance/Leave. Uses A-owned Auth and Lead-owned storage; no fake-auth route or public payslip link is introduced.

An example test fixture location during implementation is `dashboard/tests/fixtures.js` in Teammate A's module or `payslips/tests/fixtures.js` in Teammate B's module. This task creates no such files. A test-only Express fixture may set `req.user` to `{ id: '100000000000000000000001', role: 'employee' }`; it must not be reachable through the real app. Permission tests also use Taylor and the fictional Admin actor, not a runtime identity override.

### Replacing samples with actual services

1. Producer delivers the named export with its agreed arguments, response shape, filtering/ordering rules, and failure behavior. Consumer checks that against its fixtures.
2. Consumer replaces the isolated adapter with the real import. Do not call another module through an HTTP request inside this backend.
3. Run source and consumer checks together with consistent fictional database/test records. Compare request counts, date scopes, and approved calendar entries. Real balance tests need an explained ledger, not just the mock six-day result.
4. Verify an approval/accepted cancellation updates source data once and all dependent reads agree after refresh. Verify failed source calls return errors instead of samples.
5. Integrate real authentication and ownership tests when Teammate A delivers Auth. The lead mounts the feature router only with actual access controls. Fixture-only progress is not a finished deployable module.

No teammate needs to wait for all other modules to be finished to develop their own settled parts. However, final authentication, source-service, file-storage, or scheduler integration cannot be claimed complete before the actual dependency exists.

### Dependencies still requiring a decision

- Source signatures for optional monthly usage/chart-series data, birthday-recipient selection, and report export columns/format.
- Calendar/directory audience and any historical roster/schedule behavior.
- Accrual/opening balances, correction/cancellation details, and reminder exemptions listed in the shared contract.
- Actual upload helpers/storage, scheduler provision, and production authentication policy.

These are follow-up decisions for the lead with the relevant owner. Do not independently settle them in an adapter or test fixture. Complete the agreed basic reads and settled workflows first.

## Git branches, review, and integration workflow

This is a workflow guide, not an instruction that has already been executed. No branches, commits, pushes, pull requests, or repository settings were changed while preparing it.

### Shared branch and initial handoff

Use existing `main` as the shared integration branch. At preparation time, the lead is on `sahil`, and both `main` and `sahil` have remote-tracking branches. Do not assume changes on `sahil` are already in `main`.

Before teammates begin:

1. Lead reviews and saves the intended foundation/documentation changes on the current working branch. Check `git status`; do not switch branches with unfinished work you have not accounted for.
2. Lead commits/pushes the intended changes when ready, then opens a pull request from `sahil` to `main` if the foundation is on `sahil`. Review the actual diff and run the server tests before merging.
3. Include `backend-contracts.md`, `backend-assignments.md`, and `server/README.md` in the handoff. Review what else is under `docs/`; do not blindly publish the original screenshots/evidence or other files containing employee information.
4. Teammates clone the repository and create their feature branches from the updated `main`, not from an old personal branch.

Authentication remains postponed. Source/consumer code may be integrated with tests while protected feature routers remain unmounted. Do not claim a deployable employee workflow until real authentication is integrated.

### Branch naming and ownership

| Owner | Example branch | Owned folders |
|---|---|---|
| Lead | `feat/organizations`, `feat/leave`, `feat/reports`, finally `feat/notifications` | `organizations`, `leave`, `reports`, `notifications` |
| Teammate A | `feat/auth`, `feat/attendance`, `feat/dashboard`, `feat/calendar` | `auth`, `attendance`, `dashboard`, `calendar` |
| Teammate B | `feat/employees`, `feat/assets`, `feat/holidays`, `feat/payslips` | `employees`, `assets`, `holidays`, `payslips` |

These are module-sized branches within each person's complete assignment. Their ownership covers the whole assigned area; using several reviewable branches does not reduce the assignment to isolated first tasks. Do not keep three enormous personal branches apart until the entire backend is finished.

From the project root, after cloning and with a clean working tree:

```powershell
git switch main
git pull --ff-only origin main
git switch -c feat/attendance
```

Use the relevant branch name. Do not recreate `main` or overwrite the lead's `sahil` branch.

### Daily work and pull requests

1. Work in owned folders. Put module-specific tests/helpers inside the module. Shared root test files, contract documents, and configuration are coordinated through the lead.
2. Commit a coherent set of changes with a meaningful message. Stage intended files, inspect `git diff --cached`, and check for secrets, fixtures in production paths, and unrelated edits.
3. Push the feature branch and open a pull request targeting `main`. Teammates do not push directly to `main`.
4. In the pull request, state implemented behavior, affected endpoints/service exports, checks actually run, and unresolved dependencies. Mark a partially implemented branch as draft.
5. Lead reviews scope, access controls, contracts, and integration. Another teammate should review the lead's changes too. Amendments go to the same branch before merging.
6. Merge after relevant checks pass. Only one pull request is merged at a time; pull requests depending on it update from `main` and rerun affected checks.

Run the existing backend suite from the project root:

```powershell
npm --prefix server test
```

The test script discovers the shared `server/tests/*.test.js` suite. For new tests inside a module, also run them explicitly, for example `node --test server/src/modules/attendance/tests/*.test.js`, until the lead updates the shared discovery command. Passing the existing suite alone does not prove new module tests ran.

### Receiving merged changes without rewriting history

First commit the intended local work on your feature branch and verify the working tree is clean. Then, while staying on that feature branch:

```powershell
git fetch origin
git merge origin/main
```

This brings merged dependencies into the branch. Do not merge another person's unfinished branch as an informal substitute for an agreed interface. Get source changes reviewed into `main`, or keep using the agreed isolated test fixtures.

After updating, run relevant module checks and the shared suite. If package files changed, run `npm ci` from `server/` before testing; it installs the committed lockfile, so it is not a reason for everyone to edit dependency files.

### Shared-file changes and conflicts

The lead initially owns `server.js`, `app.js`, shared utilities/configuration, error middleware, storage/calendar helpers, package files, and the two handoff documents. A owns the new authentication/permission middleware files, with names agreed before creation; the lead wires them into shared setup. Teammates describe the needed change, including exact router export/path or required service fields. The lead makes the shared edit; the teammate keeps feature code in the owned module.

- Do not independently install packages or edit the lockfile. Request a dependency with a concrete reason; after the lead adds it, update from `main` and install from the lockfile.
- Do not rename another module's fields/exports, reformat the entire backend, or move shared files during feature work.
- For a conflict, use `git status` to identify the affected files. The owner of the affected code and lead review both versions, preserve intended behavior, remove conflict markers, and rerun affected checks before completing the merge.
- Do not resolve conflicts by blindly accepting all of one side, deleting another person's work, resetting hard, or force-pushing shared history.
- `.env` stays local and untracked. Share only placeholder names/settings through `.env.example`.

### Integration order

1. Reviewed foundation and handoff documents reach `main`.
2. Owners develop their full assigned areas against the contracts. Merge coherent source-service work and fixture-tested consumers as they become ready; real protected routes stay unmounted without authentication.
3. B supplies the real Employee model/context and holiday services. A integrates Auth with B's model, Attendance with the shared calendar helper, and Dashboard/Calendar with the lead's Leave services. B connects Assets/Payslips to A's Auth and the lead's storage. No shared shapes change silently.
4. Verify producer/consumer flows together, then mount real protected routers through the lead's shared app changes.
5. Test identity/ownership, approval/cancellation effects, dates, failures, and duplicate operations. Files/jobs wait for their actual configured providers.
6. Lead implements Notifications last, then coordinates event calls/reminder scheduling with Teammate A and holiday events with Teammate B. Verify alerts separately; no historical notification replay is implied.

## Completion standard for every module

An assignment is complete when all applicable items below are met:

1. Required settled employee/Admin workflows are implemented in the owned folders.
2. Inputs, permissions, record ownership, valid state changes, and referenced records are checked on the server.
3. Responses and shared interfaces match the contract; no secret/private fields leak.
4. Lists handle no records, invalid filters, and pagination. Dates have a declared scope and timezone interpretation.
5. Meaningful checks cover success, failure, ownership, and duplicate/race behavior where applicable. Source-dependent modules are tested with actual integration, not fixtures alone.
6. No production sample-data fallback or fake authentication remains. Pending policy items are resolved or explicitly reported as unfinished.
7. The owner's API notes describe final inputs/outputs, module-specific configuration, and how to verify the flow. Keep notes close to the module rather than copying the full requirements document.
8. The lead reviews integration changes and shared files. No unrelated changes or new dependencies are slipped into the feature.

## Remaining handoff preparation

- Step 1: shared contracts prepared in `backend-contracts.md`.
- Step 2: this full assignment document is prepared. Actual implementation remains undone.
- Step 3: fictional data, source-service examples, dependency owners, and sample-to-real integration instructions prepared in these two documents. Outstanding decisions are explicitly listed.
- Step 4: shared branch, module branch examples, pull request review, safe updates, shared-file ownership, test discovery, and integration workflow documented above. Actual repository handoff/merging is still to be performed by the team.

The latest root `.gitignore` no longer excludes `docs/`. The documents currently appear as untracked; include the intended handoff documents in your own commit before teammates clone, or share them separately. No ignore rules, commits, or pushes were changed by this documentation task.
