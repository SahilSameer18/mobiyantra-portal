# HRMS — Feature Scope and User Flows

**Document status:** Draft for management review and approval  
**Prepared:** 26 November 2026  
**Version:** 1.2  
**Scope:** Employee portal with the essential Admin operations required to support it

## Contents

- [1. Purpose and approval requested](#1-purpose-and-approval-requested)
- [2. Organization and operating model](#2-organization-and-operating-model)
- [3. Roles and responsibilities inside the product](#3-roles-and-responsibilities-inside-the-product)
- [4. Complete page and screen map](#4-complete-page-and-screen-map)
- [5. Shared navigation, theme, and responsive behavior](#5-shared-navigation-theme-and-responsive-behavior)
- [6. P01 — Login](#6-p01--login)
- [7. P02 — Sign Up](#7-p02--sign-up)
- [8. P03–P05 — Recovery and approval-status views](#8-p03p05--recovery-and-approval-status-views)
- [9. P06 — Dashboard](#9-p06--dashboard)
- [10. P07 — Attendance](#10-p07--attendance)
- [11. Attendance correction dialog and request history](#11-attendance-correction-dialog-and-request-history)
- [12. P08 — Apply Leave](#12-p08--apply-leave)
- [13. P09 — My Requests and leave decision flow](#13-p09--my-requests-and-leave-decision-flow)
- [14. P10 — Leave Balance](#14-p10--leave-balance)
- [15. P11 — Team Calendar](#15-p11--team-calendar)
- [16. P12 — Employees directory](#16-p12--employees-directory)
- [17. P13 — Holidays](#17-p13--holidays)
- [18. P14 — Payslips](#18-p14--payslips)
- [19. P15 — My Assets and repair/return requests](#19-p15--my-assets-and-repairreturn-requests)
- [20. P16 — Reports](#20-p16--reports)
- [21. P17 — My Profile](#21-p17--my-profile)
- [22. P18 — How It Works](#22-p18--how-it-works)
- [23. Notification system — complete event and panel scope](#23-notification-system--complete-event-and-panel-scope)
- [24. Background jobs and cross-page updates](#24-background-jobs-and-cross-page-updates)
- [25. Essential Admin support and deferred Admin Portal](#25-essential-admin-support-and-deferred-admin-portal)
- [26. End-to-end journeys](#26-end-to-end-journeys)
- [27. Common behavior and quality requirements](#27-common-behavior-and-quality-requirements)
- [28. Pending decisions for approval or later specification](#28-pending-decisions-for-approval-or-later-specification)
- [29. Approval checklist](#29-approval-checklist)
- [30. Implementation context and supporting records](#30-implementation-context-and-supporting-records)

## 1. Purpose and approval requested

This document describes the proposed HRMS: which pages it will contain, what each page will do, how employees move between features, what information is recorded, and which actions require Admin approval.

The proposal combines the employee features observed in the current portal with the business rules agreed during requirements discussion. It describes the **new system being proposed for approval**, rather than claiming that every workflow was verified in the old system.

Management is requested to review and approve:

1. The included employee pages and workflows.
2. The attendance, leave, registration, and holiday rules.
3. The separation between employee permissions and Admin permissions.
4. The essential Admin support included with this phase and the broader Admin functions deferred to a later phase.
5. The pending decisions listed in section 28, including any conditions on approval.

The new portal will use a new visual design and support mobile, tablet, and desktop. This document specifies behavior and scope; it does not approve a particular screen design.

### Reading labels

| Label | Meaning |
|---|---|
| **Included** | Proposed functionality for this phase. Management approval is requested. |
| **Proposed detail** | A suggested screen/state or behavior that completes a workflow but has not been settled as a business rule. |
| **Pending decision** | A value or policy that must be resolved before the related behavior is finalized. |
| **Deferred** | Outside this phase unless management changes the scope. |

No item in this document should be interpreted as already approved by management merely because it was agreed during preparation.

## 2. Organization and operating model

### 2.1 Companies

The same portal will serve employees of:

1. Wazirz Sm India Private Limited.
2. Mobiyantra Private Limited.
3. Riddlepay Private Limited.
4. Finastraa Technologies Private Limited.

The proposed model is one shared portal, with company stored against the employee and shown in their profile. Separate company websites or separate employee portals are not proposed. Company membership does not automatically grant access to other employees' private information.

### 2.2 Office and scale

- One shared office for all four companies.
- All employees work on-site; no remote or hybrid working arrangement is included.
- Approximately 50–60 employees initially, with anticipated growth to around 200.
- Office hours: **10:00 AM–6:00 PM for everyone**.

### 2.3 Working week

| Department | Normal working days | Normal weekly days off |
|---|---|---|
| IT | Monday–Friday | Saturday and Sunday |
| All other departments | Monday–Saturday | Sunday |

The department determines the working week. Employee designation labels remain exactly as written; job titles will not be renamed, merged, or used to replace the department-based rule.

Office Closed dates from the shared holiday calendar are additional non-working dates for leave-day counting and attendance reminders. Exceptional working days and the office timezone remain pending decisions.

## 3. Roles and responsibilities inside the product

### Employee

- Register for an account and wait for Admin approval.
- Log in and use the approved employee portal.
- View the dashboard and permitted directory/calendar information.
- Punch in and punch out under the attendance rules.
- View personal attendance history and submit a voluntary correction request.
- Apply for leave, track decisions, and view leave balance.
- Request approved-leave cancellation through the specified approval flow.
- View personal Admin-uploaded payslip PDFs and assigned company assets.
- Submit repair and return requests for assigned assets.
- View personal reports and notifications.
- Edit allowed personal details and profile photo.
- Use light/dark mode and log out.

### Admin

The essential supporting operations for this phase are:

- Review and approve employee registrations.
- Approve or reject leave requests.
- Maintain the shared holiday calendar and Office Closed flags.
- Change employee company, department, or designation when authorized.

Admin also uploads employee payslip PDFs. The following supporting processes need an authorized operational mechanism, with their details to be agreed: correction review, leave-cancellation review, asset-data supply, and handling repair/return requests. The complete Admin Portal remains deferred; see section 25.

## 4. Complete page and screen map

The paths below are navigation references from the existing portal. The new design may reorganize views without removing the included functionality. Authentication views can share one route; pop-ups do not have to become separate pages.

| ID | Page or view | Purpose | Main access point |
|---|---|---|---|
| P01 | Login | Authenticate an approved employee. | Public authentication screen; existing reference `/auth`. |
| P02 | Sign Up | Submit employee registration for Admin approval. | Sign Up tab on authentication screen. |
| P03 | Forgot Password | Request a password-reset link. | Login → Forgot password. |
| P04 | Reset Password | Set a replacement password using a valid reset link. | Reset email/link; view details are proposed. |
| P05 | Account Approval Status | Explain that a registration is awaiting approval or is not permitted access. | After registration or an attempted login; presentation is proposed. |
| P06 | Dashboard | Personal leave overview and shortcuts. | Default signed-in page; `/dashboard`. |
| P07 | Attendance | Punching, daily session, history, corrections. | Navigation or header punch shortcut; `/attendance`. |
| P08 | Apply Leave | Submit a Paid or Permission Leave request. | Navigation/dashboard; `/apply-leave`. |
| P09 | My Requests | Track, search, and filter personal leave requests. | Navigation/dashboard; `/my-requests`. |
| P10 | Leave Balance | Show accrued, used, and remaining paid leave. | Navigation; `/balance`. |
| P11 | Team Calendar | View leave dates and team availability. | Navigation; `/calendar`. |
| P12 | Employees | Search the permitted employee directory. | Navigation; `/employees`. |
| P13 | Holidays | View shared holidays and office closures. | Navigation; `/holidays`. |
| P14 | Payslips | View/download personal published payslips. | Navigation; `/payslips`. |
| P15 | My Assets | View assigned company equipment and submit/track repair and return requests. | Navigation; `/my-assets`. |
| P16 | Reports | View personal leave analytics and export available data. | Navigation; `/reports`. |
| P17 | My Profile | View employee details and edit permitted personal information. | Account menu; `/profile`. |
| P18 | How It Works | Explain the portal, policies, and workflows. | Navigation; `/how-it-works`. |

### Shared panels and dialogs

| Component | Where it appears | What it does |
|---|---|---|
| Navigation drawer/sidebar | Signed-in portal | Opens employee pages; drawer replaces persistent navigation on smaller screens. |
| Account menu | Signed-in portal | Opens My Profile and Logout. |
| Notification panel | Header bell | Displays the employee's notification history. |
| Attendance correction dialog | Attendance history row | Collects corrected times and a reason. |
| Selected-day calendar panel | Team Calendar | Displays employees on leave for the selected date. |
| Leave detail/cancellation view | My Requests | Displays request information and eligible actions; exact presentation is proposed. |
| File-selection controls | Apply Leave and My Profile | Select leave attachments or a profile photo under the agreed limits. |
| Asset request form | My Assets | Submit a repair or return request for an assigned asset; exact presentation remains to be designed. |

### Background operations with no standalone employee page

- Monthly paid-leave accrual.
- Attendance reminders at 11:00 AM and 6:30 PM.
- Automatic punch-out at 11:59 PM.
- Birthday and holiday event notifications.
- Updates to balances, calendar, dashboard, and reports after relevant decisions.
- Creation of in-portal operational notifications. External alert delivery is deferred; password-reset message delivery remains a separate authentication requirement.

## 5. Shared navigation, theme, and responsive behavior

**Included features**

- Navigation to all included employee pages.
- Clear indication of the current page.
- Header punch shortcut using the same attendance rules as the Attendance page.
- Notification bell and employee account menu.
- My Profile and Logout actions.
- Light/dark mode switch.
- Mobile navigation drawer with an explicit close action.
- Keyboard-accessible controls and usable focus behavior.
- Consistent loading, empty, success, error, and access-denied states.

**Navigation flow**

```text
Successful approved login
    → Dashboard
    → select a navigation item
    → requested employee page
    → use page action or return to another page
```

**Theme flow**

```text
Select theme toggle
    → portal changes between light and dark
    → forms, dialogs, lists, and shared controls remain readable
    → preference persists according to the agreed persistence setting
```

**Pending decisions:** initial theme default, browser/account preference persistence, exact visual direction, and supported browser/device baseline. The old branding and layout are references, not a requirement to copy them.

## 6. P01 — Login

### Features and fields

- Email.
- Password, concealed while entered.
- Login action.
- Sign Up navigation.
- Forgot password navigation.
- Clear feedback for incomplete input, invalid credentials, network errors, and accounts not approved for access.

### Flow

```text
Open Login
    → enter email and password
    → submit
    → validate credentials and account eligibility
        → approved account: enter Dashboard
        → account awaiting approval: no employee access; show appropriate status
        → invalid credentials/error: remain on Login with feedback
```

### Information affected

An authenticated session is established only for an eligible approved account. The login form does not grant employee approval or change the person's role/company.

### Related pages

Sign Up, Forgot Password, Account Approval Status, Dashboard.

**Pending decisions:** detailed session behavior, expiry, initial Admin provisioning, and approved messaging for blocked/rejected accounts. These are not permission to allow pending accounts into the portal.

## 7. P02 — Sign Up

### Form contents

| Field | Purpose | Scope note |
|---|---|---|
| Full Name | Employee's name. | Baseline required field. |
| Email | Account identifier and communication address. | Baseline required field. |
| Date of Birth | Personal profile information; may support birthday alerts. | Baseline required field; no future DOB allowed by the observed date constraint. |
| Join Date | Employment start information. | Requiredness/default and verification remain to be finalized. |
| Company | One of the four included companies. | Selected during registration; later changes are Admin-only. |
| Department | Employee's department. | Later changes are Admin-only; department controls the normal working week. |
| Designation | Existing job title. | Preserve labels; later changes are Admin-only. |
| Phone Number | Employee contact information. | Baseline required field; exact format validation to be finalized. |
| Gender | Personal profile field. | Existing options: Male, Female, Other. |
| Role | Employee registration context. | Public registration must not grant Admin privileges. The old menu offered Employee only. |
| Password | Login credential. | Required; policy to be finalized. |
| Confirm Password | Confirms the entered password. | Required; must match under the proposed completion behavior. |

Department labels observed in the directory were Accounts, IT, Office Boy, and Management. Registration also listed Director. Whether Director remains a department is pending; the software must not silently recategorize existing designations.

### Flow

```text
Open Sign Up
    → complete employee fields
    → submit valid registration
    → save registration awaiting Admin approval
    → display registration/approval status
    → Admin reviews employee and organization details
    → Admin approves
    → employee can log in and use the portal
```

### Approval boundary

- Submitting registration does not activate the account automatically.
- Employees cannot approve themselves or select Admin access.
- Initial company/department/designation selections can be reviewed by Admin; the exact review interface is to be designed.
- Pending/rejected-account feedback may be a message or status view rather than a separate public page.

**Pending decisions:** duplicate registration handling, requiredness of all organization fields, registration rejection/reapplication, and how approval status is communicated to an employee without active portal access. Email operational notifications are deferred; do not assume an approval email will be sent.

## 8. P03–P05 — Recovery and approval-status views

### Forgot Password

**Features:** registered email input, Send Reset Link action, Back to Login action, loading/success/error feedback.

```text
Login → Forgot password
    → enter email
    → request reset link
    → show appropriate response
    → receive reset email when the request is eligible
```

### Reset Password

**Proposed completion view:** New Password, Confirm Password, submit action, and invalid/expired-link feedback. This completes the recovery capability; the old reset screen was not available for inspection.

```text
Open reset link
    → validate link
    → enter matching replacement password
    → save valid change
    → return to Login
```

### Account Approval Status

**Proposed completion behavior:** explain that registration is pending and deny employee access until approval. Rejection, disabled-account, and reapplication behavior require a decision before final implementation.

**Pending decisions:** reset-link expiry/reuse policy, delivery service, post-reset session behavior, and precise status messaging.

## 9. P06 — Dashboard

### Purpose

Give the employee a quick leave overview and convenient entry points into daily actions.

### Features

| Area | Information/action |
|---|---|
| Greeting | Employee first name, current date, contextual greeting. |
| Monthly usage | Paid-leave usage compared with the displayed monthly quota. |
| Summary cards | Monthly Quota, Used This Month, Approved requests, Pending requests. |
| Leave Balance | Paid days available; Permission Leave shown as unlimited and unpaid. |
| Recent Leave Requests | Recent personal requests and their status; View all link. |
| Apply for Leave | Shortcut to the application form. |
| Header punch shortcut | Starts the applicable attendance action using the same daily-session rules. |

### Flows

```text
Dashboard → Apply for Leave → submit request → My Requests
Dashboard → View all recent requests → My Requests
Dashboard/header punch action → attendance eligibility/action → updated daily session
```

### States and updates

- Loading while dashboard data is being fetched.
- No requests yet, with a clear Apply Leave action.
- Approved/pending totals and balances update after relevant request changes.
- The old portal displayed a first-day welcome message; retaining its eligibility/timing is an unresolved detail rather than a finalized onboarding rule.

**Pending decisions:** which recent request fields are shown, number/order of recent records, greeting timing, and refresh cadence. The displayed one-day monthly quota must not silently become a separate maximum-use cap beyond the agreed accrual policy.

## 10. P07 — Attendance

### 10.1 Current daily session

**Included information**

- Today's date.
- Current session state.
- Punch-in time, when present.
- Punch-out time, when present.
- Session duration/hours.
- Applicable Punch In or Punch Out action.

### 10.2 Daily states and available actions

The names below describe behavior; final interface wording is not prescribed.

| State | What it means | Employee action |
|---|---|---|
| Not punched in | No daily session exists. | Punch In, subject to office geofence. |
| Location check in progress | Device location is being requested/checked. | Wait, cancel/retry according to the agreed interaction. |
| Punched in | One daily session is open. | Punch Out from anywhere. |
| Session complete | A manual or automatic punch-out has closed the session. | View record; no second normal session that day. |

### 10.3 Punch-in flow

```text
Employee selects Punch In
    → request device location permission/location
    → check location against office area
        → eligible and no daily punch exists: record punch-in
        → outside area: do not record a punch; show feedback
        → denied/unavailable/inaccurate location: follow defined retry/error behavior
    → show open session and punch-in time after success
```

- One office geofence is required.
- No distance/radius has been selected.
- Office coordinates, allowed radius, location-quality checks, and retained location evidence must be configured before this flow is finalized.
- A successful duplicate tap must not create a second session.

### 10.4 Punch-out flow

```text
Open daily session
    → employee selects Punch Out
    → close that session with the punch-out time
    → display completed session and duration
```

Punch-out is allowed from anywhere. It must not depend on office distance or location permission. A second punch-in/punch-out session is not allowed that day.

### 10.5 Automatic punch-out

```text
11:59 PM in the configured office timezone
    → find sessions with punch-in but no punch-out
    → close those sessions at the agreed closing time
    → leave already completed sessions unchanged
```

- Do not create attendance for employees who never punched in.
- Do not overwrite an existing manual punch-out.
- Do not introduce a special flagging or mandatory correction workflow; none was requested.
- Automatic session closing and the calculation of payable/credited hours are separate matters. No overtime-pay or hours-cap policy is approved by this feature.

### 10.6 History and summaries

- Month selection.
- Refresh action.
- Dated rows with punch-in, punch-out, and hours.
- Voluntary Request correction action per eligible record.
- Empty-month state.
- Attendance summaries with an explicit date scope.

The old page contained Present Days, Work From Home, Half Days, and Average Hours metrics. The proposed system has no remote/hybrid arrangement and no full-day/half-day classification policy. Those old cards and status labels must therefore be reconciled with the agreed scope; they must not silently introduce new classifications or a WFH feature.

**Pending decisions:** exact summary measures/periods, duration rounding, exceptional workdays, overnight handling, and timezone. No late/half-day deduction policy has been agreed.

## 11. Attendance correction dialog and request history

### Features

- Opened from a dated attendance-history row.
- Selected attendance date.
- Corrected Punch In.
- Corrected Punch Out.
- Required reason.
- Submit Request.
- Cancel and Close actions.
- My Correction Requests section with an empty state and later populated request states.

### Flow

```text
Attendance history → choose Request correction
    → review date and prefilled/blank times
    → enter proposed times and reason
    → submit a correction request
    → authorized reviewer evaluates it
    → accepted changes update the attendance record
```

The current portal says corrections are reviewed by Admin. Exact new-system approval states, rejection remarks, allowed correction age, time validation, and notification effects remain pending. These must be settled before finalizing the correction workflow.

This is a **voluntary employee feature**, separate from automatic punch-out. Employees will not be forced into this dialog merely because their session closed at 11:59 PM.

## 12. P08 — Apply Leave

### Form features

| Field/action | Behavior |
|---|---|
| Leave Type | Choose Paid Leave or Permission Leave (unpaid). |
| From Date | Start of requested leave. |
| To Date | End of requested leave. |
| Reason | Required multiline explanation. |
| Attachment | Optional supporting document. |
| Paid-leave balance card | Display accrued, used, and remaining paid leave. |
| Permission-leave information | Explain unlimited unpaid leave with no paid-balance deduction. |
| Submit Request | Validate and submit for Admin decision. |
| Reset | Clear the draft and return form controls to defaults. |

Baseline attachment support is PDF, DOC/DOCX, JPG/JPEG, and PNG, with a displayed maximum of 5 MB. Final storage/access and validation behavior remain to be specified before upload implementation.

### Leave policies

| Policy | Proposed rule for approval |
|---|---|
| Paid-leave accrual | One day per month. |
| Carry-forward | Unused paid leave carries forward without expiry. |
| Monday/Friday Paid Leave | Not allowed. |
| Permission Leave | Unlimited and unpaid, including Mondays and Fridays. |
| Decision authority | Admin. |
| Office Closed dates | Excluded from leave-day counts. |

### Submission flow

```text
Open Apply Leave
    → load relevant balance/policy information
    → select leave type
    → enter dates and reason; optionally attach a document
    → validate applicable date, balance, and document rules
    → submit
    → save request as Pending
    → make request available for Admin review
    → employee follows status in My Requests
```

### Important distinctions

- A pending request is not the same as approved leave.
- Permission Leave does not consume paid-leave balance.
- Unlimited Permission Leave does not mean automatic approval.
- No WFH, Casual, or Sick Leave application type has been added to scope.
- A department working calendar should inform non-working-day treatment; exact weekend/range calculations still need final specification.

**Pending decisions:** accrual start/proration/opening balances, monthly usage caps if any, overlaps, pending-balance reservations, past-date requests, partial-day requests, and how Monday/Friday restrictions apply to a date range spanning those days.

## 13. P09 — My Requests and leave decision flow

### Features

- Personal leave-request list.
- Total, Pending, Approved, Rejected, and Cancelled counts.
- Search by reason/leave type.
- Expand/collapse filters.
- Status filter.
- Leave-type filter using an intentional mapping to the approved types.
- Sort by Date or Status.
- Showing/total result counts.
- Empty state with guidance to adjust filters or apply for leave.
- Request information and eligible actions.

### Request information

The detail presentation must be finalized because the reviewed account had no requests. The proposed minimum is leave type, requested dates, calculated leave days, reason, current status, submission information, and any permitted attachment/decision remarks. These are proposed populated-view fields, not a claim about an inspected old detail screen.

### Approval/rejection flow

```text
Pending request
    → Admin reviews request and applicable balance/policy
        → approve: request becomes Approved
        → reject: request becomes Rejected
    → employee sees the decision in My Requests
    → applicable balance/calendar/dashboard/report views update
    → agreed decision notifications are generated
```

### Leave statuses

| Status | Meaning |
|---|---|
| Pending | Waiting for an Admin decision. |
| Approved | Request accepted. |
| Rejected | Request declined; remark displayed when supplied. |
| Cancelled | Previously approved leave withdrawn through the agreed cancellation process. |

### Approved-leave cancellation

The old guide describes the following baseline capability, retained for scope review:

```text
Approved leave → employee requests cancellation before leave ends
    → Admin reviews cancellation
    → approved cancellation changes leave to Cancelled
    → applicable paid-leave balance is restored
    → affected calendar and reporting views update
```

**Pending decisions:** cancellation reason, intermediate-state wording, rejection of cancellation, partial cancellation, pending-request withdrawal/editing, and exact balance-restoration timing. Cancellation is not silently immediate merely because the employee selects an action.

## 14. P10 — Leave Balance

### Features

- Current month's paid-leave quota and approved usage.
- Usage indicator/percentage with a clear denominator.
- Accrued, Used, and Remaining/Left paid leave.
- Monthly usage breakdown for the displayed year.
- Explanation of paid accrual/carry-forward and unpaid Permission Leave.
- No-approved-leave/usage empty state.

### Flow and updates

```text
Monthly accrual event → paid balance increases once for the applicable month
Approved Paid Leave → paid usage/balance reflects the approved request
Approved cancellation → restore the applicable previously deducted balance
Permission Leave decision → no paid-balance deduction
```

Accrued total, remaining balance, monthly quota, and monthly usage are separate values. Displaying a quota of one day per month does not resolve whether all carried-forward days can be used in a later month; any separate usage cap is still a pending policy decision.

Balance changes must agree with My Requests, Dashboard, Team Calendar, and Reports.

## 15. P11 — Team Calendar

### Features

- Monthly calendar grid with month/year heading.
- Previous/next month actions.
- Leave indicators on dates.
- Overflow indicator when multiple entries cannot all be shown in the grid cell.
- Select a date to inspect its leave details.
- Selected-date panel with employee name/initials and leave type.
- On Leave Today list.
- Upcoming Leaves list and empty state.
- Team size, leave counts, and availability summary.
- Leave-type legend that is consistent with actual supported/historical data.

### Flow

```text
Open Team Calendar
    → view month and availability summaries
    → select a date containing leave
    → inspect people on leave and their leave type
    → close date details or change month
```

### Dependencies

Approved leave and cancellation decisions affect the calendar. Calendar visibility must follow the agreed permissions; shared company branding does not automatically mean unrestricted visibility of every employee record.

**Pending decisions:** which records/statuses are displayed, upcoming window, team visibility, availability calculation, and whether holidays appear in this calendar as well as the Holidays page. Extra leave types in the old legend are not automatically new requestable types.

## 16. P12 — Employees directory

### Features

- Total employees, currently Working count, and department count.
- Search by name, email, or designation according to permitted data access.
- Department filter.
- List/card entries showing name, avatar/initials, designation, department, and status.
- Working, Offline, and On Leave presentation where the underlying rule is defined.
- No-results state.

### Flow

```text
Open Employees
    → view permitted directory entries
    → enter search and/or select department
    → view matching employees
    → clear/change search or filter to see a different result set
```

Company, department, and designation are distinct concepts. This employee directory does not include employee-management controls merely because Admin can update organization details elsewhere.

**Pending decisions:** visibility across companies, contact fields that may be exposed, presence calculation/refresh frequency, and whether employee detail navigation is required. No employee-detail page was established by the old directory review.

## 17. P13 — Holidays

### Features

- Shared holiday list grouped by month/year.
- Holiday name and date.
- Category, such as National or Festival, where applicable.
- Explicit Office Closed badge/flag.
- Employee read access.
- Admin management of the shared calendar through the supporting Admin operation.

### Flow

```text
Admin adds/updates shared holiday information
    → employee Holidays page reflects the calendar
    → Office Closed dates are excluded from leave-day counts
    → attendance reminders are suppressed on those Office Closed dates
    → agreed holiday event notifications are generated
```

The difference between a public holiday listing and an actual office closure must be clear. Not every listed festival/public holiday is automatically Office Closed.

The old 2026 dates are historical reference data, not an automatically approved calendar for future years.

**Pending decisions:** annual calendar preparation/source, exceptional working days, edit/cancellation notification behavior, and employee year navigation.

## 18. P14 — Payslips

### Features

- Admin uploads an existing payslip PDF for the relevant employee.
- Employee views and downloads their own published monthly payslip PDFs.
- Identify the applicable pay period through the agreed record metadata.
- Clear no-payslips state before any documents are available.
- Loading, unavailable-document, access-denied, and download-error handling.

### Flow

```text
Admin selects the employee and supplies the agreed pay-period information
    → uploads an existing payslip PDF
    → document is validated and stored with restricted access
    → the employee's Payslips page lists the available document
    → employee selects and views/downloads their own PDF
```

PDF upload and employee access are confirmed scope. Employee self-upload/publication is not included. The PDF contains the payslip prepared outside this system; the portal does not calculate salary, taxes, deductions, or generate the payslip.

**Pending decisions:** PDF size limit, upload metadata, publication/replacement/revision rules, storage, and whether viewing is an embedded preview or a document-opening action. A payslip-publication notification has not been confirmed; if added initially it must be in-portal only.

## 19. P15 — My Assets and repair/return requests

### Confirmed request rules

- Admin handles both repair and return requests.
- Required request description/issue or reason; photos are optional.
- Pending → Approved or Rejected; Approved → Completed.
- Employees may cancel their own requests only while Pending; cancelled requests are shown as Cancelled.
- Admin must provide a reason when rejecting a request.
- Return assets stay assigned until Admin confirms physical receipt; the return completion/assignment update must reflect that confirmation.

### Features

- View company equipment currently assigned to the employee.
- Display the agreed asset-identifying information.
- Submit a repair request for an assigned asset.
- Submit a return request for an assigned asset.
- View submitted requests, their status, and any Admin rejection reason.
- Clear no-assets-assigned and no-requests states.
- Loading, submission success, validation, access, and error feedback.

Examples mentioned in the old help were laptop, ID card, and accessories; these are not an exhaustive approved asset-category list. Repair/return requests are a newly confirmed scope addition beyond the old account's empty asset view.

### Assigned-equipment flow

```text
Authorized source/Admin process records an asset assignment
    → employee opens My Assets
    → assigned equipment and available request actions are displayed
```

### Repair request flow

```text
My Assets → select an assigned asset → Request Repair
    → enter the issue/request information
    → submit request
    → Admin approves or rejects (rejection reason required)
    → an approved repair is marked Completed by Admin when fulfilled
    → employee can check request progress/outcome in the portal
```

### Return request flow

```text
My Assets → select an assigned asset → Request Return
    → enter the required request information
    → submit request
    → Admin approves or rejects (rejection reason required)
    → asset remains assigned until Admin confirms physical receipt
    → Admin completes the return and updates the assignment
```

Submitting a return request is distinct from a completed physical return. The request must not, by itself, be treated as proof that equipment has been received back.

**Confirmed form/actions:** identify the assigned asset and request type, require a description/reason, and allow optional photos. Employees may cancel a Pending request. Admin reviews both types and must supply a rejection reason. The approved-request completion stage is Admin-controlled. No repair/return notification event is automatically added; any agreed initial alert uses the in-portal channel.

**Pending decisions:** asset fields/data-entry mechanism and photo-upload formats/count/size. The reviewer, main status transitions, cancellation, rejection reason, and return-receipt condition are confirmed above. Acknowledgment, replacement requests, or other actions remain outside confirmed scope unless separately agreed.

## 20. P16 — Reports

### Features

- Personal leave-request analytics.
- Total Requests, Approved, Pending, and Rejected summary counts.
- Paid-leave balance overview.
- Relevant populated visualizations once their definition is agreed.
- Export Report action for available report data.
- Empty-data message; export disabled when there is nothing to export.

### Flow

```text
Open Reports
    → retrieve permitted personal leave information
    → show summaries and agreed visualizations
    → select Export Report when data is available
    → generate and download the agreed report format
```

Metrics must state their date scope and agree with My Requests and Leave Balance. The existing employee Reports page was leave-focused; company-wide payroll or attendance reporting is not automatically included in this page.

**Pending decisions:** charts, date filters, export format/columns, and exact reporting periods. The old account had no populated analytics or export example.

## 21. P17 — My Profile

### Display information

- Profile photo/avatar.
- Name and employee role.
- Company.
- Department.
- Designation, preserved exactly as written.
- Email.
- Phone.
- Gender.
- Date of birth.
- Join date.

### Editing permissions

| Information | Employee permission | Admin dependency |
|---|---|---|
| Name, phone, DOB, gender | Edit own allowed personal details. | Additional review rules, if any, remain to be specified. |
| Profile photo | Change own photo under the agreed upload constraints. | Storage and validation need configuration. |
| Company | Read own value; no employee change. | Admin-only change. |
| Department | Read own value; no employee change. | Admin-only change; may affect future working-calendar behavior. |
| Designation | Read own value; no employee change. | Admin-only change; no automatic renaming or merging. |
| Email, role, join date | Display where appropriate. | Editing/account-control policy remains unspecified. |

### Flow

```text
Account menu → My Profile
    → view employee details
    → select Edit
    → modify permitted personal fields
        → Save: validate and persist allowed changes
        → Cancel: leave saved information unchanged
```

```text
Select Change profile photo
    → choose an image
    → validate and store it through the agreed file process
    → display the saved photo after success
```

The baseline photo input accepts images. Exact formats/size, crop/preview/remove behavior, and error messages remain pending. Upload controls must not imply that profile photos are safely stored on a temporary application disk.

## 22. P18 — How It Works

### Features

- Explain registration approval and access.
- Explain daily punch-in/punch-out and the office location requirement.
- Explain the department working week and holiday closures.
- Explain Paid Leave and Permission Leave rules.
- Explain request statuses, Admin review, and the agreed cancellation process.
- Explain reminders and automatic punch-out.
- Provide links to the relevant employee pages.

### Flow

```text
Open How It Works
    → find explanation of a feature/policy
    → follow a shortcut to the relevant page
    → complete the workflow using the documented rule
```

Help must describe the new approved behavior. For example, it must not invite a second daily attendance session or promise full-day/half-day rules that are not in scope.

## 23. Notification system — complete event and panel scope

### 23.1 Notification panel

**Initial delivery channel: in-portal only.** Email, WhatsApp, and browser/OS push operational alerts are deferred. This channel decision does not add new event types. Password-recovery message delivery is an independent authentication concern, not a confirmed operational email integration.

- Header bell opens/closes employee notification history.
- Each item contains a title, description, and timestamp.
- A scrollable list provides access to older items.
- Empty, loading, and error states need intentional behavior.
- A notification links to a relevant page only if that interaction is specified; the old reminder-item click did not establish a destination.

Read/unread counters, mark-all-read, deletion, preferences, and a separate full-history page are potential additions requiring a decision. Their existence was not proven by the old panel.

### 23.2 Event matrix

| Event | Trigger/condition | Recipient | Timing/channel status |
|---|---|---|---|
| Missing punch-in | No punch-in by the reminder time on the employee's working day; not Office Closed. | The relevant employee. | 11:00 AM confirmed; in-portal only initially. |
| Missing punch-out | Employee has not punched out under the final eligibility rule. | Relevant employee. | 6:30 PM confirmed; suppress on Office Closed dates. Whether never-punched-in employees qualify remains pending. |
| Birthday | Employee birthday event. | Audience to be specified. | Birthday alerts included from the existing feature; the old history showed 9:00 AM examples, not a finalized universal time. |
| Holiday added | A new shared holiday is recorded. | Eligible employees, audience to be finalized. | In-portal only initially; edit/duplicate/closure conditions remain pending. |
| Holiday tomorrow | A relevant holiday/office closure is tomorrow. | Eligible employees. | Existing event capability; the old example was 6:00 PM, exact rule to be finalized. |
| Leave submitted | Valid request becomes Pending. | Admin. | Initial scope: alert inside the portal. Historical email/WhatsApp delivery is explicitly deferred. |
| Leave approved/rejected | Admin decides a request. | Requesting employee. | In-portal decision alert initially; email/WhatsApp delivery is deferred. |

Payslip, asset, correction-decision, and cancellation-decision notifications remain pending scope decisions. Do not list them as already confirmed events.

### 23.3 Notification flow

```text
Relevant event or scheduled check
    → identify eligible recipients
    → create the appropriate notification once
    → display it in the intended recipient's portal notification history
    → employee reads it and follows any defined action
```

Repeated job execution must not cause duplicate reminders for the same intended event. Exact retry, delivery, retention, and read-state rules still require technical/product decisions.

## 24. Background jobs and cross-page updates

These operations have no standalone employee page but are necessary to make the visible features work.

| Operation | Required result | Visible effects |
|---|---|---|
| Monthly accrual | Credit one applicable paid-leave day per employee/month once. | Leave Balance, Dashboard, application balance card, Reports. |
| Leave approval | Apply the approved leave outcome consistently. | My Requests, balance, calendar, dashboard, reports, agreed notifications. |
| Approved cancellation | Restore the applicable balance and remove/update leave availability information. | Requests, balance, calendar, dashboard, reports. |
| 11 AM reminder | Notify eligible missing-punch-in employees. | In-portal notification history. |
| 6:30 PM reminder | Notify eligible missing-punch-out employees. | In-portal notification history. |
| 11:59 PM closing | Close open daily sessions once without replacing a manual punch-out. | Attendance history/session and relevant duration displays. |
| Birthday/holiday events | Generate the agreed alerts. | In-portal notification history. |
| Profile update | Persist permitted personal changes. | Profile and other permitted displays using that information. |

The implementation must use a consistent office timezone. A server/browser's default timezone is not a confirmed company setting.

Scheduled execution needs separate deployment support; an employee leaving a browser tab open is not the mechanism that triggers these jobs. Hosting/provider details belong to the implementation plan.

## 25. Essential Admin support and deferred Admin Portal

### Essential operations required for this phase

| Operation | Employee workflow it supports | Status |
|---|---|---|
| Registration approval | Employee gains approved portal access. | Required by the prepared requirements. |
| Leave approve/reject | Request receives an authoritative decision. | Required by the prepared requirements. |
| Holiday/closure management | Shared holiday list, counts, reminder eligibility. | Required by the prepared requirements. |
| Company/department/designation updates | Protected employment information can be maintained. | Required by the prepared requirements. |
| Correction review | Voluntary attendance corrections can be resolved. | Baseline feature; reviewer/rules need final confirmation. |
| Cancellation review | Approved leave cancellation can complete. | Old guide-described flow; exact rules need final confirmation. |
| Payslip PDF upload | Admin supplies the existing PDF for the employee to view/download. | Admin upload confirmed; limits, metadata, storage, and revision details remain pending. |
| Asset assignment/data supply | Employee has equipment records to view. | Supporting mechanism still to be specified. |
| Asset repair/return request handling | Employees submit/track requests; Admin reviews and completes them. | Required description, optional photos, Pending cancellation, rejection reason, and physical-receipt condition confirmed in section 19. |

These actions need protected server operations and an agreed restricted operational interface. Their existence does not imply that the complete Admin Portal is included in the employee-first scope.

### Deferred broader scope

- Complete Admin dashboards and uninspected configuration workflows.
- Full payroll calculation and statutory processing.
- Recruitment, performance management, expenses, and other modules not established by this employee-portal scope.
- Remote/hybrid/WFH application workflows.
- Additional leave types unless separately approved.
- Email, WhatsApp, and browser/OS push operational notifications in the initial release.

Management should approve how the essential supporting actions will be operated before the system is considered usable with real employees.

## 26. End-to-end journeys

### Journey A — New employee onboarding

```text
Sign Up → valid registration → pending approval
    → Admin review/approval → Login → Dashboard → review My Profile
```

**Outcome:** employee access is approved, organization fields are protected, and profile information is available.

### Journey B — Normal attendance day

```text
Login → header/Attendance → office location check → Punch In
    → workday → Punch Out from any location → completed daily record
```

**Outcome:** one daily session; no office-location check at punch-out; no second normal session after completion.

### Journey C — Forgotten punch-out

```text
Successful Punch In → no manual Punch Out
    → 6:30 PM reminder when eligible
    → 11:59 PM automatic closing of the open session
    → attendance record shows its closing timestamp
```

**Outcome:** no open daily session remains indefinitely; no additional flagging/mandatory correction workflow is introduced.

### Journey D — Paid Leave

```text
Review Leave Balance/Team Calendar → Apply Leave
    → valid Paid Leave dates and reason → Pending request
    → Admin approve/reject → My Requests decision
    → balance/calendar/dashboard/reports reflect the outcome
    → agreed employee decision notification
```

**Outcome:** approval-dependent updates agree across pages. Monday/Friday and office-closure rules are applied according to the finalized date-counting policy.

### Journey E — Permission Leave

```text
Apply Leave → Permission Leave → dates/reason → Pending
    → Admin decision → My Requests/Calendar updated as applicable
    → no paid-leave balance deduction
```

**Outcome:** unpaid leave remains subject to Admin decision despite having no quota limit.

### Journey F — Approved-leave cancellation

```text
My Requests → eligible approved leave → request cancellation
    → Admin cancellation decision under the agreed process
    → successful cancellation → Cancelled + applicable balance restoration
    → calendar/dashboard/reports updated
```

**Outcome:** cancellation effects are consistent. Exact eligibility and intermediate states remain to be approved.

### Journey G — Holiday closure

```text
Admin records shared holiday and Office Closed flag
    → Holidays page shows it → agreed holiday notifications
    → closure excluded from leave-day counts
    → no attendance reminders on that date
```

### Journey H — Profile and published records

```text
My Profile → edit permitted details/photo → save → updated personal information
Admin uploads payslip PDF → employee Payslips → select own document → view/download
My Assets → view assigned equipment → submit repair/return request → track agreed process
Reports → review personal analytics → export when data is available
```

**Outcome:** private employee records remain restricted to their permitted audience; shared company participation does not override ownership controls.

## 27. Common behavior and quality requirements

### Page/action states

| State | Expected behavior |
|---|---|
| Loading | Explain that the page/action is in progress; prevent accidental duplicate submission where applicable. |
| Empty | Explain the absence of data and provide an appropriate next action. |
| Success | Show that the action completed and update affected views. |
| Validation failure | Identify the relevant field/rule without discarding the draft unnecessarily. |
| Network/server failure | Give recoverable feedback; a retry must not duplicate an already completed operation. |
| Permission/access failure | Deny access appropriately; do not expose another employee's private data. |
| Location failure | Distinguish an unavailable/denied location from a successful eligible check. |

### Shared requirements

- Full mobile/tablet/desktop usability, including forms, calendar details, notification panel, and dialogs.
- Light/dark readability throughout the interface.
- Clear page titles, labels, and date scopes.
- Consistent date/time interpretation using an agreed office timezone.
- Employee/Admin permissions enforced on saved actions, not just by hiding buttons.
- Upload validation and authorized document access.
- No duplicate daily punches, accrual credits, decision effects, or scheduled-event notifications.
- Realistic populated and empty examples for modules that were empty during discovery.
- Help text consistent with the actual approved rules.

## 28. Pending decisions for approval or later specification

These items do not prevent management reviewing the overall feature scope. They must be resolved before the affected behavior is completed or used operationally.

| Area | What remains to be settled |
|---|---|
| Office settings | Office timezone, coordinates, geofence radius, accuracy/failure behavior, and exceptional working days. |
| Attendance | Summary definitions, voluntary correction rules, rounding, and any separate credited-hours/overtime policy. No extra automatic-closing flags/correction requirement is proposed. |
| Leave | Accrual start/proration/opening balances, any separate usage cap, overlap/pending reservation, weekend/range calculation, and cancellation details. |
| Identity/access | Account rejection/reapplication, session/recovery policy, directory/calendar visibility, and editing of email/other employment fields. |
| Notifications | In-portal only initially. Exact 6:30 PM eligibility, approved-leave exemptions, birthday audience/time, holiday event rules, retention, and read-state behavior remain pending. |
| Populated records | Admin-uploaded payslip PDFs: upload metadata/limits/revisions. Assets: fields/source and photo-upload limits; repair/return lifecycle is confirmed in section 19. Report/export definitions remain pending. |
| Supporting Admin operations | Restricted interface and permissions for the essential actions while the full Admin Portal remains deferred. |
| Files and scheduled execution | Persistent storage and scheduler/provider configuration. |
| Initial data | Required historical employee/leave/attendance/document migration and an authorized source/export. |
| Visual approval | New design direction and representative mobile/desktop screen review. |

Unresolved items must not be filled by silently copying an inconsistent old label or inventing a company policy.

## 29. Approval checklist

- [ ] Four-company shared-portal scope accepted.
- [ ] Page/view list and employee features accepted.
- [ ] IT Monday–Friday; other departments Monday–Saturday; 10 AM–6 PM accepted.
- [ ] Department-based calendar and unchanged designation labels accepted.
- [ ] Office-only geofenced punch-in and punch-out from anywhere accepted.
- [ ] One daily session and 11:59 PM automatic punch-out accepted.
- [ ] No additional full-day/half-day classification rules or mandatory auto-closing correction workflow accepted.
- [ ] Two leave types and stated accrual/carry-forward/Monday-and-Friday restrictions accepted.
- [ ] Admin leave approval and the proposed cancellation-scope boundary reviewed.
- [ ] Shared holiday calendar and Office Closed behavior accepted.
- [ ] Registration approval and profile-edit permissions accepted.
- [ ] Initial in-portal-only notification channel and event scope reviewed.
- [ ] Admin-uploaded payslip PDFs and employee access accepted.
- [ ] Asset repair/return workflow, Pending cancellation, required reasons, optional photos, Admin completion, and return-receipt condition reviewed.
- [ ] Essential Admin operational support versus deferred full Admin Portal accepted.
- [ ] Payslip/asset/report populated-state decisions assigned for later specification.
- [ ] Pending decisions and conditions on approval recorded.
- [ ] New responsive design to be reviewed separately.

### Management review record

| Item | To be completed during review |
|---|---|
| Reviewer | |
| Review date | |
| Decision | Approved / Approved with conditions / Changes requested |
| Approved scope/version | |
| Required changes | |
| Conditions and pending decisions | |

This review record is intentionally unfilled. Preparing this document does not record management approval or send it to anyone.

## 30. Implementation context and supporting records

The planned implementation is MERN with JavaScript and MongoDB Atlas. An initial demonstration is planned on Vercel and Render free tiers, followed by deployment handoff. Persistent files and scheduled execution require an explicit service/configuration plan. These technical details do not change the business scope described above.

Supporting local records:

- [Requirements discussion and decisions](hrms-planning-discussion.md).
- [Implementation plan — separate technical reference](hrms-implementation-plan.md).
- [Historical functional record](hrms-detailed-audit/functional-specification.html).
- [Screenshot/evidence index](hrms-detailed-audit/index.html).

This Markdown document is readable independently. Supporting links refer to sibling files in the local documentation folder and will work only when those records accompany it. No screenshots or historical archive have been altered to create this proposal.
