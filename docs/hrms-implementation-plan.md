# HRMS implementation and learning plan

Prepared: 26 November 2026
Status: initial plan for review; implementation has not started.

## 1. How to use this plan

Build one working workflow at a time, explaining its purpose, implementation, and verification before moving on. There is no fixed deadline. Milestones are completion checkpoints, not time estimates.

The current requirements are in [hrms-planning-discussion.md](hrms-planning-discussion.md). The old portal's [functional record](hrms-detailed-audit/functional-specification.html) supplies historical evidence and screen coverage. Explicit decisions in the discussion take precedence when they differ from the old portal.

The downloaded ZIP and discovery pack stay unchanged. This plan and the discussion file remain separate. No additional visit to the old portal is assumed.

This plan proposes implementation choices; it does not turn every unanswered question into an agreed business rule. Resolve each relevant open item before implementing the behavior it controls.

## 2. Confirmed baseline

| Area | Agreed direction |
|---|---|
| Stack | MongoDB, Express, React, Node.js; JavaScript throughout; start from scratch. |
| Database hosting | MongoDB Atlas. |
| Initial deployment | React frontend on Vercel; Express/Node backend on Render free tier. Subsequent deployment belongs to the user's sir. |
| Scale | Approximately 50–60 employees initially, around 200 later; no fixed growth deadline or account cap. |
| Companies | Include all four companies from the existing portal. Working assumption: one shared portal, company stored as employee information. Role-based data access remains separate. |
| Location | One office, no remote/hybrid arrangements. Punch-in requires office geofence eligibility; radius is not selected yet. Punch-out is allowed from anywhere. |
| Schedule | Everyone works 10 AM–6 PM. IT works Monday–Friday; every other department Monday–Saturday. Preserve designation labels exactly as written. |
| Daily attendance | One punch-in and one punch-out per employee per day. Automatically close an open session at 11:59 PM; no extra flagging or mandatory correction workflow. No full-day/half-day classification thresholds requested. |
| Accounts | Employee self-registration followed by Admin approval before portal access. |
| Authentication | JWT sent in cookies; bcryptjs hashes/verifies passwords. The express-session/connect-mongo proposal is not selected. |
| Frontend package constraints | Lucide React selected. TanStack Query excluded; React Hook Form deferred. Sonner is already installed in the current client manifest. |
| Frontend routing and requests | react-router-dom and Axios selected. Respect the router major-version compatibility note below. |
| Profile | Employees edit personal details/photo. Only Admin changes company, department, or designation. |
| Leave | Paid Leave and unpaid Permission Leave. Earn one paid day/month; unused paid leave carries forward without expiry. Paid Leave is disallowed on Mondays/Fridays. Permission Leave is unlimited and unpaid, including Mondays/Fridays. Admin approves requests. |
| Holidays | One shared Admin-managed calendar. Office Closed days do not count as leave days and do not trigger attendance reminders. |
| Attendance reminders | Missing punch-in at 11 AM on working days; missing punch-out at 6:30 PM. Some recipient exceptions remain undecided. |
| Payslips | Admin uploads existing payslip PDFs; employees access their own documents. No payroll/payslip-generation engine. |
| Assets | View assigned equipment; repair/return requests with required description and optional photos. Admin approves/rejects/completes; Pending employee cancellation allowed; rejection reason required; returned asset stays assigned until Admin confirms receipt. |
| Notification channels | In-portal only initially. Email, WhatsApp, and browser/OS push alerts deferred; password recovery remains a separate auth requirement. |
| Presentation | Original, deliberate visual identity; avoid generic template aesthetics. Full mobile/tablet/desktop usability and dark/light capability. Lucide React icons follow the approved visual direction. |
| Pace | Learn while building, without a fixed deadline. |

Do not introduce overtime pay, attendance penalties, new leave types, remote-work flows, designation renaming, or a large Admin Portal as incidental additions.

## 3. Proposed technical shape

Use a small application with three main parts:

```text
React frontend -> Express/Node API -> MongoDB Atlas
                         |
                         +-> persistent file-storage integration (provider undecided)
                         +-> in-portal notification records (external alerts deferred)

Scheduled execution -> protected job entry points -> the same application services
```

Keep business rules on the server. The frontend displays eligibility and validation feedback, but cannot authorize its own attendance, leave, role, or organization changes.

Proposed source organization, to finalize when setup begins:

```text
hrms/
├── client/        React application
├── server/        Express API and business logic
└── docs/          Setup, decisions, verification, and handoff notes
```

Within each app, group code by feature. Start with clear modules and functions. Add abstractions only when real duplication or complexity warrants them. No microservices or separate backend for each company are proposed.

Suggested server boundaries:

- Routes/controllers: authenticate, validate input, call the appropriate operation, return a consistent response.
- Feature services: attendance transitions, leave calculations/approvals, notification eligibility.
- Data models: persistence rules and indexes.
- Integrations/jobs: invoke shared services; do not duplicate policy calculations in timer callbacks or the frontend.

Choose supporting packages and current supported versions when implementation starts. Explain any added dependency and use it consistently. The MERN/JavaScript choice is settled; a detailed library list is not.

## 4. Minimal Admin dependency

The full Admin Portal remains deferred. However, registration approval, leave decisions, holiday management, and protected organization-field changes require real Admin-side operations.

Proposed approach:

1. Implement the required protected Admin API operations alongside the employee workflows that depend on them.
2. Verify those operations using test accounts and an API client during development.
3. Decide the smallest restricted operator interface needed for a usable demonstration before claiming the employee workflow is complete.
4. Keep broad administration dashboards, payroll calculation, extensive configuration screens, and other uninspected Admin features out of this phase.

Do not bypass account approval, allow employees to grant themselves Admin access, or treat a public development shortcut as a finished approval process. The exact operator interface remains a planning choice.

## 5. Milestones

### M1 — Project foundation and first request

**Build:** React application, Express server, Atlas connection, environment configuration, API health check, and frontend-to-backend connectivity.

**Learn:** project structure, npm scripts, modules, HTTP requests/responses, browser versus server responsibilities, environment variables, and database connections.

**Complete when:**

- Both apps run locally using documented commands.
- React can request and display a simple Express response.
- The server connects to a development Atlas database; connection failure is handled clearly.
- Secrets stay out of frontend code, logs, and Git. Commit only placeholder environment examples when a repository is established.
- Startup validates required configuration. No real employee data is needed for this milestone.

### M2 — Data contracts, authentication, registration, and approval

**Build:** account/profile model, four-company lookup data, department/designation handling, registration, login/logout, approval-gated access, and password-recovery flow.

**Learn:** validation, password hashing, authentication versus authorization, protected routes, account states, and API contracts.

**Before implementing:** JWT with cookies is selected. Define verification, expiry, refresh/logout revocation, HttpOnly/Secure/SameSite cookie configuration, CSRF defenses, and actual frontend/backend origin behavior. Settle pending/rejected account behavior, initial Admin provisioning, and password-reset delivery. Protected requests must check account approval and current permissions rather than trusting stale role claims. Use the selected bcryptjs package with asynchronous hash/compare. Reject passwords exceeding 72 UTF-8 bytes instead of silently truncating; apply the same rule to signup, reset, and password verification. Benchmark a work factor of at least 10 on the target backend. Keep password hashes private and do not log plaintext passwords.

**Complete when:**

- Self-registration cannot create an active account or grant an Admin role.
- An authorized Admin can approve a registration through the agreed development/operational mechanism.
- Pending accounts cannot access employee APIs, including by making direct requests.
- Login/logout and protected navigation behave correctly across local and deployed origins.
- A reset flow has intentional expiry/reuse behavior and is tested with controlled data.
- API failures and validation messages are useful without exposing secrets or private account data.

### M3 — Responsive shell, profile, and directory

**Build:** new application layout, navigation, mobile drawer, account menu, theme toggle, profile display/editing, photo integration, directory search/filtering, and appropriate dashboard loading/empty states.

**Learn:** React components, state, forms, routing, API integration, responsive layout, and accessible controls.

**Before implementing:** agree a visual direction, directory-visible fields, theme default/persistence, photo limits, and persistent file storage. Discuss the design before building the full interface. Preserve employee designations rather than rewriting them.

**Complete when:**

- Employees can update their own allowed personal fields.
- Company/department/designation changes are rejected for employees at the API boundary.
- Employees cannot modify another person's private profile through a changed identifier.
- Theme and navigation are usable on mobile, tablet, and desktop.
- Directory filters and empty states work with synthetic records from multiple companies/departments.
- Uploaded photos do not depend on the Render server's temporary disk.

### M4 — Shared calendar rules and holidays

**Build:** office settings, department working-week calculation, Admin-managed holiday records, employee holiday listing, and a shared working-day calculation used by later modules.

**Learn:** date-only values versus timestamps, timezone boundaries, reusable business functions, and calendar logic.

**Before implementing:** confirm the office timezone and any exceptional working days. Do not substitute the execution machine's timezone for a company decision.

**Complete when:**

- IT Saturdays/Sundays and other departments' Sundays are classified according to the confirmed normal working week.
- Office Closed dates apply across all four companies.
- A listed holiday without the closure flag is not silently treated as an office closure.
- Attendance-reminder and leave calculations can use the same calendar policy.

### M5 — Attendance and voluntary corrections

**Build:** current session, geofenced punch-in, unrestricted-location punch-out, daily history, monthly selection, duration display, and the existing employee correction-request capability.

**Learn:** asynchronous browser permissions, server validation, state transitions, uniqueness, and handling concurrent requests.

**Before implementing:** set the office point and test an allowed radius; decide location error/accuracy behavior, retained location evidence, correction approval rules, and metric periods. The geofence checks submitted device location; do not describe it as an absolute guarantee against location spoofing.

**Complete when:**

- Outside-area, denied, unavailable, and insufficient-quality location cases have defined outcomes.
- Punch-out is not blocked by location permission or office distance.
- Repeated/concurrent requests cannot create two daily sessions or overwrite a completed punch-out.
- Employee day boundaries use the configured office timezone.
- History, empty months, and correction forms behave deliberately.
- Voluntary corrections are distinct from the rejected proposal for mandatory correction after automatic punch-out.
- No unrequested full-day/half-day penalties, thresholds, or overtime rules are added.

Automatic closing is delivered with scheduled execution in M7; an attendance-only checkpoint is not the completed attendance feature.

### M6 — Leave, balances, approvals, and team calendar

**Build:** two leave types, date/reason/attachment form, balance presentation, request history/search/filter/sort, Admin decisions, calendar day details, and dashboard leave summaries. Include the guide-described cancellation/restoration flow once its unresolved behavior is specified.

**Learn:** derived data, request state transitions, monthly accrual, consistent balance changes, and form-to-API workflows.

**Before implementing:** resolve accrual start/opening balances, any usage cap, weekend counting, cross-range Monday/Friday treatment, overlap/pending-balance rules, cancellation behavior, and attachment handling. Retain the confirmed rules; do not use unanswered details to change them.

**Complete when:**

- Monthly accrual cannot be credited twice for the same employee/period.
- Unused paid balance carries forward without expiry.
- Monday/Friday paid-leave restrictions and unlimited unpaid Permission Leave work as agreed.
- Office Closed dates are excluded from the count.
- Admin approval/rejection has consistent effects across requests, balance, dashboard, and calendar.
- Duplicate/concurrent decisions cannot double-deduct or double-restore balance.
- Filters use an intentional mapping of the two requestable types, without inventing a WFH request flow.
- Attachments are validated and access-controlled; pending, rejected, approved, and cancelled examples are available for review.

### M7 — Notifications and scheduled work

**Build:** notification history/panel, working-day attendance reminders, birthday alerts, holiday-added/tomorrow alerts, agreed leave-event alerts, and automatic punch-out at 11:59 PM.

**Learn:** events versus schedules, eligibility queries, idempotency, durable records, and recovery after service downtime.

**Before implementing:** select a scheduler that meets the timing requirements and confirm recipients/exemptions, birthday/holiday delivery times, and notification read/history behavior. Initial operational notifications are in-portal only; email, WhatsApp, and browser/OS push alerts are explicitly deferred. Password-reset delivery is a separate unresolved authentication requirement.

**Complete when:**

- 11 AM reminders target eligible employees without a punch-in on their working days.
- 6:30 PM reminder eligibility follows an explicit rule; no reminders occur on Office Closed dates.
- Scheduled executions can be retried without creating duplicate notifications or attendance entries.
- At 11:59 PM, only open sessions close. Completed manual punch-outs are preserved; employees who never punched in receive no fabricated attendance session.
- A manual punch-out racing with automatic closing cannot corrupt the record.
- The requested automatic-closing behavior does not acquire an extra flagging/mandatory correction workflow.
- Service restarts and missed schedules have a documented recovery approach; timing limitations of the demonstration deployment are stated honestly.

### M8 — Payslips, assigned assets, reports, and help

**Build:** Admin upload of existing payslip PDFs, authorized employee payslip access/download, assigned-asset views, employee repair/return requests and request tracking, personal reports/export, and help that reflects the agreed new behavior.

**Learn:** authorized document access, file delivery, report queries, populated/empty states, and consistent derived metrics.

**Before implementing:** define payslip PDF limits/metadata/replacements and persistent storage. Specify populated asset fields, assignment-data entry, and photo-upload limits. Implement the confirmed Admin-managed request states, Pending cancellation, required description/rejection reasons, and physical-receipt condition for return completion. Use synthetic examples because the old account lacked populated records. Do not build a payroll or payslip-generation engine.

**Complete when:**

- Only Admin can upload/publish the existing payslip PDFs; employees can access only their permitted documents, including direct file requests.
- Employees can view assigned assets and submit/track repair and return requests; another employee's asset identifiers cannot bypass access checks.
- A return request is not recorded as a completed equipment return without the agreed completion process.
- Realistic synthetic populated states and empty states are both demonstrated.
- Reports agree with underlying attendance/leave data and identify their date scope clearly.
- Export behavior is specified, generated, and checked rather than implemented as a decorative button.
- Help and policies match the confirmed rules, including the changes to attendance behavior.

### M9 — Integrated verification, demonstration deployment, and handoff

**Build:** deployable configuration, deployment instructions, integrated fixes, environment examples, and a handoff guide.

**Learn:** production builds, hosted origins, configuration, deployment logs, database access, operational checks, and troubleshooting.

**Complete when:**

- Vercel frontend, Render API, Atlas, persistent storage, and selected scheduler work together for the agreed demonstration scope.
- Authentication, authorization, downloads, and location permissions work in the deployed configuration.
- Meaningful business/API tests pass, and key employee journeys are checked on mobile/tablet/desktop.
- No secrets or real employee sample records are bundled into public client assets or committed fixtures.
- Unfinished integrations, migration limitations, and free-tier timing/availability limits are explicit.
- The user's sir receives setup/deploy instructions, required service/configuration inventory, migration status, backup/recovery requirements, and verification results without credentials embedded in source/docs.
- Full Admin Portal work remains separately scoped; minimal operational dependencies are not mistaken for the completed Admin product.

### Frontend package decisions

- Selected: react-router-dom for routing; Axios for API requests; existing Tailwind CSS for styling.
- Icons: Lucide React selected by the user; this supersedes the earlier exclusion and custom-SVG proposal. Sonner is already installed for temporary toasts. Excluded: TanStack Query. Deferred: React Hook Form.
- Establish a coherent visual direction through typography, layout, color, spacing, and icon treatment; avoid generic template styling. Review the direction before building the complete interface.
- Use a shared Axios instance in the agreed frontend service layer; configure API origin, request/error handling, and cookie credentials during implementation.
- Compatibility note: the official [React Router v8 upgrade guide](https://reactrouter.com/upgrading/v7) states that v8 removed react-router-dom. To retain the user's requested package name, select the compatible v7 line and keep router APIs/imports consistent. Do not mix v7 react-router-dom with v8 router contexts.
- Sonner toasts are short-lived UI feedback; they do not implement the stored notification bell/history or request-form dialogs.

### Server package proposal

JWT-with-cookies and bcryptjs are confirmed. Other supporting packages below remain recommendations until their setup/feature is implemented:

| Package | Purpose / stage |
|---|---|
| express | API routes and middleware; foundation. |
| mongoose | Atlas connection, models, queries, indexes; foundation. |
| cors | Configure approved browser frontend origins when using cross-origin requests; not an authorization mechanism. |
| zod | Validate requests at the API boundary. |
| bcryptjs | Selected password hashing/verification library; async APIs, explicit 72-byte UTF-8 input validation, benchmarked work factor at least 10. |
| jsonwebtoken | Sign and verify JWTs; restrict verification algorithms/claims and enforce expiry. |
| cookie-parser | Read incoming cookies; Express sets/clears the cookie. |
| helmet | Security-related HTTP response headers. |
| express-rate-limit | Throttle sensitive operations, with deployment/proxy settings reviewed. |
| multer | Add at the upload milestone if uploads pass through Express; storage SDK is a separate provider decision. |
| supertest | Development dependency for meaningful API integration tests. |

Use supported Node built-ins for environment-file loading, watch mode, cryptographic reset-token generation, and the test runner where suitable. File-storage SDK and scheduler remain provider choices. No PDF-generation package is needed for Admin-uploaded payslip PDFs. Do not install express-session/connect-mongo for the selected JWT approach. No dependencies have been installed by recording this proposal.

References: [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [password-storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [JWT package](https://github.com/auth0/node-jsonwebtoken), [cookie-parser](https://expressjs.com/en/resources/middleware/cookie-parser/), [cookie attributes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies).

## 6. Proposed data concepts

Finalize individual fields and indexes at the start of each milestone. These are new-system proposals, not a reconstruction of the old database.

| Concept | Intended responsibility |
|---|---|
| User/account with employee profile | Identity, account approval/role, company/department/designation association, allowed personal fields. Keep it simple; avoid duplicating identity across collections without a concrete need. |
| Company and department lookup/settings | Four company labels and department-based working calendars. Designation labels remain preserved values. |
| Office settings | Company timezone, office coordinates, geofence radius, shared schedule parameters. |
| Holiday | Date/name/category and explicit Office Closed flag. |
| Daily attendance | Employee, local work date, punch timestamps, duration-related data, and safe one-session transitions. Enforce employee/work-date uniqueness. |
| Attendance correction request | Proposed changes, reason, decision state, and authorized review, once rules are specified. |
| Leave request and balance accounting | Requested dates/type/reason/attachment, decision state, monthly credits and approved usage/restoration. Design idempotency and concurrency together. |
| Notification and scheduled-execution records | Recipient/event/message and enough execution identity to avoid duplicate jobs and recover missed runs. |
| Payslip/file reference | Authorized employee document for the specified period; not an assumed payroll calculation model. |
| Assigned asset | Employee equipment information based on the agreed fields and source. |
| Asset service request | Assigned asset/employee, request type, required description/reason, optional photos, Pending/Approved/Rejected/Completed/Cancelled status, Admin rejection reason, and authorized transitions. Return completion requires Admin receipt confirmation. |

For the expected scale, first prioritize clear queries, correct indexes, pagination where needed, and tested business rules. Do not introduce infrastructure solely because a feature might someday grow.

## 7. Decisions that can wait until their milestone

| Decide before | Remaining inputs |
|---|---|
| M2 authentication | JWT/cookie verification, expiry/revocation, CSRF and origin configuration; initial Admin provisioning, account-state details, reset delivery, private data access. |
| M3 profile/files | Visual direction, exact editable/visible fields, theme preference, storage provider and file constraints. |
| M4 calendar | Office timezone, any exceptional workdays, date conventions. |
| M5 location/attendance | Coordinates/radius/accuracy behavior, location retention, corrections, attendance summary scope. |
| M6 leave | Accrual edges/opening balances, weekend/range calculations, pending reservations/overlaps, cancellation details. |
| M7 jobs/notifications | Scheduler, exact recipients/exemptions, event timing, and in-portal history/read-state policy. External alert channels are deferred. |
| M8 records/exports | Admin payslip PDF upload metadata/limits/storage/revisions; asset fields/source and photo-upload limits; export contents and report scope. Asset request lifecycle is confirmed in the feature scope. |
| M9 handoff | Historical migration/export availability, deployment ownership, operational settings, and acceptance of any explicitly deferred capability. |

Do not repeat settled decisions such as department-based schedules, unchanged designations, leave types, MERN/JavaScript, Atlas, or the absence of a fixed deadline. Ask focused questions when an unresolved choice becomes necessary.

## 8. Verification approach

- Test meaningful policy logic: working days, holiday exclusions, leave counting/accrual, geofence evaluation, and notification eligibility.
- Test API boundaries: pending users, role checks, ownership, invalid inputs, and unauthorized organization-field changes.
- Test races/retries for punches, auto-closing, accrual, leave decisions, and notifications.
- Use synthetic records to exercise empty, loading, success, error, and populated states.
- Check responsive layouts and keyboard/focus behavior in the actual rendered application.
- Record the checks actually run at each milestone. Do not claim coverage or success from a screenshot alone.

Do not add tests that merely mirror static labels or implementation details. Scale checks to the behavior and risk being changed.

## 9. Immediate next step

Start with M1 when implementation begins: create the project folders, run a minimal React screen and Express API, then connect the API to a development Atlas database. Explain and verify each connection before adding authentication or a full interface.

No application code, service accounts, deployment, or archive modification is performed by creating this plan.
