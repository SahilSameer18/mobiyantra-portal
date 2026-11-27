# HRMS backend — shared contracts

Prepared: 26 November 2026
Updated: 27 November 2026 — latest ownership split and `employees` module name

Handoff step 1: shared data and interface definitions prepared. Authentication belongs to Teammate A and will be implemented after handoff. No feature code is supplied by this document.

Purpose: give all three backend developers one shared starting point before feature implementation. This document defines interfaces and ownership; it does not implement the backend or record management approval.

The previously prepared feature scope/flows remains the product reference; that file is not present in the current `docs` folder. Confirmed rules below come from that scope and the planning discussion. Technical choices marked **working default** are implementation proposals for this project, rather than observations about the old portal. Unresolved company policies remain unresolved.

Use the field names, types, and enum spellings in this document consistently during development. Do not independently rename them in another module. A change to a shared contract must be communicated to its owner and consumers. Unresolved policies are not settled merely by defining a field to represent them.

## 1. Fixed module ownership

| Owner | Modules | Complete responsibility |
|---|---|---|
| Lead | `leave`, `reports`, `organizations`, `notifications` | Leave rules/balances, personal reports, organization records, shared infrastructure/integration; Notifications implemented last. |
| Teammate A (stronger teammate) | `auth`, `attendance`, `dashboard`, `calendar` | Authentication, attendance/punching/automatic closing, dashboard and team calendar. |
| Teammate B | `employees`, `assets`, `holidays`, `payslips` | Employee account model/profiles/approval, assets, holiday records, private payslips; uses A-owned Auth and Lead-owned storage helpers. |

The lead owns `server.js`, `src/app.js`, `src/config/`, shared error middleware, shared `src/utils/`, `.env.example`, and package/lock files initially. Teammates request changes to these files rather than editing them concurrently. Module-specific helpers stay inside their module. Teammate A owns new authentication/permission middleware files; agree their paths before creation. The lead integrates shared setup changes.

Each owner writes both employee and Admin operations for their modules. There is no second Admin database or duplicate set of business services. The full Admin Portal remains deferred; essential protected Admin operations are required.

### Notification work happens last

Attendance and Leave must work without the notification implementation. Teammate A completes Attendance and reminder eligibility; the lead completes Leave and its event inputs without importing a nonexistent notification service or adding production no-op alerts. The lead later adds the actual Notifications implementation and coordinates event calls with Teammate A and holiday events with Teammate B. Do not replay historical alerts automatically during this integration.

Notifications remain unfinished until that integration and scheduled execution are verified. Attendance automatic punch-out (A) and leave accrual (lead) are core jobs; they are not delayed merely because alerts are implemented last.

## 2. Technology and module layout

- Node.js, Express, Mongoose, MongoDB Atlas, JavaScript, ES modules.
- JWT authentication through HttpOnly cookies; bcryptjs for password hashing.
- Keep the existing installed packages. No new dependency is selected by this document.
- API prefix: `/api` (user-selected; no version segment).
- Feature structure follows the existing `auth` module:

```text
src/modules/<module>/
  <module>.routes.js
  <module>.controller.js
  <module>.service.js
  <module>.model.js       # only if this module owns persistent records
  <module>.validation.js
```

Do not create empty models for Dashboard, Calendar, or Reports: they query authoritative source data. Controllers handle HTTP; services own business logic. Services do not receive Express `req`/`res` objects.

The lead registers module routers in `app.js`. Use named exports consistently, for example `export const attendanceRouter = ...`.

## 3. Employee model — owned by Teammate B

Keep the Employee model in `employees/employee.model.js`, not a second employee model inside Auth. The existing empty `auth.model.js` does not require creating a separate authentication collection.

| Field | Storage / rule | Employee may change it? |
|---|---|---|
| `_id` | MongoDB ObjectId; common employee reference for every module | No |
| `fullName` | Trimmed string | Yes, own profile |
| `email` | Trimmed, lowercase string with unique database index | No public update API until email-change policy is settled |
| `passwordHash` | bcryptjs hash; excluded from normal selection and every response | Only through dedicated password flows |
| `phone` | String, not a numeric field | Yes, own profile |
| `dateOfBirth` | Date-only `YYYY-MM-DD`; no future dates | Yes, own profile |
| `gender` | `male`, `female`, `other`; UI can display title case | Yes, own profile |
| `joinDate` | Date-only `YYYY-MM-DD` | No employee update; approval-time verification required |
| `company` | ObjectId reference to Company | Admin only after signup |
| `department` | ObjectId reference to Department | Admin only after signup |
| `designation` | ObjectId reference to Designation | Admin only after signup |
| `role` | `employee` or `admin` | Never through employee signup/profile |
| `status` | See lifecycle below | Admin only |
| `profilePhoto` | `null` or `{ storageKey, mimeType, sizeBytes }`; private storage identifier | Own image through validated upload API |
| `createdAt`, `updatedAt` | Mongoose timestamps | No |

**Working defaults:** the storage names/types above; all signup fields from the observed form are required except join date until its requiredness is settled, and profile photo is optional. No public join-date default is invented. Confirm join date before enabling accrual for a real account. Do not introduce manager, salary, employee-code, or probation fields without an actual requirement.

### Identifiers and references

- There is one Employee collection. The employee ID is that Employee's `_id`; there is no second employee identifier to invent.
- Other modules store the employee reference as `employeeId`, a Mongoose ObjectId referencing `Employee`. Notification recipients use `recipientId`, also referencing `Employee`.
- The Employee's own employment references are named `company`, `department`, and `designation`. Internal context results use `companyId`, `departmentId`, and `designationId` as specified in section 7.
- API resource objects expose `_id` as a string. `req.user.id` is the authenticated actor ID, not a separately stored database field.
- Validate IDs and record existence at boundaries. Never accept a missing or invalid reference as an authorized employee.
- Employee references normally remain IDs in stored records. Return populated labels through deliberate response mapping, not inconsistent mixtures of string/object fields.
- `profilePhoto` storage metadata is internal. Employee responses should provide an authorized image URL or `null`, without exposing `storageKey`.

Signup accepts `password` and `confirmPassword`; only the resulting hash is saved. Confirm password is never persisted. Use explicit allowed-field lists; never spread request bodies into Employee updates. Catch duplicate-email database errors as well as validating inputs.

All ObjectId references must identify existing selectable records. All company/department/designation choices are reviewed with registration. Public organization lookups expose labels/IDs, not employee records.

### Account lifecycle

**Confirmed:** self-registration starts pending, and Admin approval is required for access.

**Working default enum:** `pending`, `active`, `rejected`, `disabled`.

```text
Signup -> pending -> Admin approval -> active
                 -> Admin rejection -> rejected
Active -> Admin disables account -> disabled
```

Only `active` accounts can access protected APIs. Reapplication, reactivation, rejection messages/reasons, and departing-employee handling still need policy decisions. The enum does not authorize implementing those unspecified transitions. Retain linked records; do not implement hard deletion as a shortcut.

The first Admin is provisioned through a controlled setup script, never a public endpoint that accepts `role: admin`. Credentials remain outside committed files.

## 4. Organization models — owned by the lead

**Working default:** shared lookup collections rather than company-specific copies. Company membership does not grant cross-employee access.

| Model | Minimum fields |
|---|---|
| Company | `_id`, `name`, `isActive`, timestamps |
| Department | `_id`, `name`, `workingDays`, `isActive`, timestamps |
| Designation | `_id`, `name`, `isActive`, timestamps |

Company names:

1. Wazirz Sm India Private Limited
2. Mobiyantra Private Limited
3. Riddlepay Private Limited
4. Finastraa Technologies Private Limited

Department `workingDays` uses ISO weekday numbers: Monday `1` through Sunday `7`.

- IT: `[1, 2, 3, 4, 5]`.
- Other departments: `[1, 2, 3, 4, 5, 6]`.
- Observed departments: Accounts, IT, Office Boy, Management. Director appeared in registration; confirm whether it is a department before seeding it.
- Designation names retain their original wording. Do not map titles to schedules or rename existing titles.
- Referenced lookup records are deactivated rather than deleted (**working default**).

Attendance (A) and Leave (lead) consume department/holiday records through one Lead-owned shared working-day helper. Historic schedule changes require an explicit rule before enabling department changes against real attendance/leave records; do not rewrite historical results from today's department silently.

### Shared working-day boundary

The lead owns the shared helper planned at `src/utils/workingDays.js`. Its agreed pure-function interface is `isWorkingDay({ date, workingDays, officeClosedDates })`, returning a Boolean for validated date-only inputs. It checks the supplied department weekdays and office-closure date list; it performs no database reads or balance changes. Attendance (A) and Leave (lead) reuse it. Exceptional working days and historical schedule policy remain unresolved; do not hide those decisions in separate copies of the helper.

The Employees module folder is `employees`, with planned `employee.model.js` / `employee.service.js` files and model/reference name `Employee`. This includes Admin accounts distinguished by role; there is no separate Auth identity collection. Authentication context remains `req.user`, and existing helper arguments named `userId` still mean the Employee account ID. These are documentation conventions, not a performed database migration or code rename.

## 5. Authentication and permissions contract

Middleware names (**working defaults**):

```js
authenticate
requireAdmin
```

`authenticate` verifies the cookie JWT, loads the account, checks its current status, and attaches:

```js
req.user = {
  id: 'user ObjectId serialized as a string',
  role: 'employee', // or 'admin'
};
```

Other modules use `req.user.id` as the actor. Never trust a body/query `userId` to establish who is acting. An Admin target employee ID is separate from the actor and requires Admin authorization.

- Missing/invalid/expired authentication: `401`.
- Authenticated actor without permission, including an inactive account: `403`.
- Employees access their own attendance, leave requests/balances, documents, assets, reports, and notifications.
- Directory/calendar disclosure is separately restricted; do not return DOB, phone, personal email, leave reasons, attachments, or private records just because an employee is logged in.
- Admin access is checked per operation, not by frontend button visibility.
- Initial employee APIs do not automatically give an Admin an employee leave entitlement. An Admin's participation in employee workflows needs clarification.

Cookie expiry, logout invalidation, password-reset delivery, deployed-origin cookie configuration, and CSRF protection must be concretely designed in Phase 3 before authentication is treated as ready. HttpOnly cookies alone are not the complete authentication design.

### Development while authentication is postponed

The `authenticate` and `requireAdmin` middleware are contracts, not implemented exports yet. Teammates can test services using explicit fictional actor/employee IDs, and controllers through a test-only Express fixture that attaches a fictional `req.user`. Test both employee and Admin permission cases.

Do not add a public endpoint, header, or query parameter that lets callers choose their identity. Do not mount unfinished protected feature routers into the shared app with a pretend production authentication middleware. Keep those routes unmounted until Teammate A supplies real authentication and the lead integrates it. Development fixtures are not part of the deployed request path.

## 6. HTTP conventions

IDs are JSON strings. Instants use ISO 8601 UTC strings. Date-only values use `YYYY-MM-DD`. Durations use integer minutes; the frontend formats hours. Leave quantities use days, with whole-day requests as the initial working default; partial-day policy is unresolved.

Success:

```json
{
  "success": true,
  "message": "Attendance retrieved",
  "data": {}
}
```

Paginated lists:

```json
{
  "success": true,
  "message": "Requests retrieved",
  "data": [],
  "pagination": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Enter a valid email" }]
}
```

`errors` is optional outside field validation. Do not expose stack traces, password hashes, reset tokens, cookie JWTs, or database internals.

| Status | Use |
|---|---|
| `200` | Successful read/update/logout |
| `201` | New record created |
| `400` | Invalid input or invalid date range |
| `401` | Authentication required/invalid |
| `403` | Permission denied |
| `404` | Missing or inaccessible resource, where appropriate |
| `409` | Duplicate/conflicting state, such as a second daily punch |
| `429` | Rate limit |
| `500` | Unexpected server failure; generic public message |

**Working defaults:** list inputs `page` and `limit`, default limit `20`, maximum `100`, validated integer values. Each endpoint explicitly validates permitted filters/sort fields. Resource responses expose `_id`; `req.user.id` is the middleware-specific name. Keep private fields out through explicit response mapping.

### Shared serialization rules

| Value | Contract |
|---|---|
| Names / stored keys | camelCase; enum values lowercase snake_case |
| Record IDs | ObjectId in MongoDB; 24-character hexadecimal string in JSON |
| Date without time | Valid calendar date `YYYY-MM-DD`, not just a matching regular expression |
| Actual timestamp | UTC ISO string such as `2026-11-26T04:30:00.000Z` |
| Missing optional value | `null`, not `''`, `'N/A'`, or a made-up date |
| Empty list | `[]`; no fictitious placeholder record |
| Duration | Nonnegative integer minutes; no formatted `'8h 30m'` in calculations |
| Range filters | `from` and `to`, inclusive date-only values, with `from <= to` |
| List page | One-based `page`; empty result has `total: 0`, `totalPages: 0` |

Date-only birth/join/leave/holiday values must not shift a day because of UTC conversion. A timestamp's local working date is derived using the office timezone. Keep timezone policy unresolved until explicitly settled; test with an explicit fictional configuration meanwhile.

The current health endpoint deliberately returns only `success` and `message`. Feature endpoints use the `data` response envelope above. A service returns plain domain data; its controller adds the HTTP envelope once.

### Canonical types and statuses

| Resource | Field | Values / meaning |
|---|---|---|
| Employee | `role` | `employee`, `admin` |
| Employee | `status` | `pending`, `active`, `rejected`, `disabled` |
| Attendance summary | `status` | `not_punched_in`, `punched_in`, `completed` |
| Leave request | `type` | `paid`, `permission` |
| Leave request | `status` | `pending`, `approved`, `rejected`, `cancelled` |
| Asset request | `type` | `repair`, `return` |
| Asset request | `status` | `pending`, `approved`, `rejected`, `completed`, `cancelled` |
| Holiday | `officeClosed` | Boolean; a listed holiday is not automatically an office closure |

Attendance summary status is derived from the daily session; it is not a full-day/half-day/late/absent classification. Before punch-in, no attendance record is required just to represent `not_punched_in`.

Leave cancellation under review is not the same as a completed cancellation. Do not change approved leave to `cancelled` or restore its balance merely because cancellation was requested. Its review fields and eligibility remain pending decisions. Attendance correction status/eligibility also require a separate agreed contract before integration; do not guess them from asset-request statuses.

Notification `type` codes for the currently scoped events (**technical names**): `missing_punch_in`, `missing_punch_out`, `birthday`, `holiday_added`, `holiday_tomorrow`, `leave_submitted`, `leave_approved`, `leave_rejected`. These names do not settle event eligibility or add payslip/asset/correction alerts. Notification records minimally expose `_id`, `type`, `title`, `message`, and `createdAt` to their recipient; read-state features remain undecided.

## 7. Ownership of cross-module logic

| Source owner | Owns the authoritative result | Consumers |
|---|---|---|
| Teammate B / Employees | Employee identity, account eligibility, employment references | All modules |
| Lead / Organizations | Company labels, department schedule data, designation labels | Employees, attendance/leave, display modules |
| Teammate B / Holidays | Holiday dates and `officeClosed` | Working calendar, display modules |
| Teammate A / Attendance | Daily sessions, corrected times, duration, automatic closing | Dashboard; future authorized attendance summaries |
| Lead / Leave | Leave balance, accrual, approval/cancellation effects, request status | Calendar, Dashboard, Reports |
| Lead / Notifications (last) | Notification creation/history and event deduplication | Other modules invoke its service for agreed events |

Never duplicate balance or working-day calculations in Dashboard, Calendar, or Reports. Never update another owner's collection to imitate a business action. Use its service. Within this single backend, services call functions, not their own HTTP endpoints.

### Minimum internal service interfaces

These are **working contracts to implement**, not existing functions. Use named exports and plain objects. Authenticated actor ID comes from the controller; services must enforce ownership/authorization for supplied targets.

```js
// employees/employee.service.js — Teammate B
getEmployeeContext({ userId })
// -> { userId, status, companyId, departmentId, designationId,
//      departmentName, workingDays, joinDate }
// IDs are strings; joinDate is null when not yet supplied/verified

// attendance/attendance.service.js — Teammate A
getTodayAttendance({ employeeId })
// -> { date, status, punchInAt, punchOutAt, workedMinutes }
// status: 'not_punched_in' | 'punched_in' | 'completed'
// timestamps null when absent; elapsed duration calculated as of server time

// leave/leave.service.js — Lead
getLeaveBalance({ employeeId, asOfDate })
// -> { asOfDate, paidAvailableDays, permissionUnlimited: true }

getLeaveSummary({ employeeId, from, to })
// -> { from, to, totalRequests, approved, pending, rejected, cancelled,
//      paidApprovedDays, permissionApprovedDays }
// working default: requests starting in inclusive range; approved day totals
// count applicable leave dates inside range; document this distinction in UI

listEmployeeLeaveRequests({ employeeId, from, to, status, page, limit })
// -> { items, pagination }; each item's minimum fields:
// { _id, type, startDate, endDate, days, status, createdAt }
// type: 'paid' | 'permission'
// status: 'pending' | 'approved' | 'rejected' | 'cancelled'
// cancellation review needs a separate agreed contract, not a guessed status

listCalendarLeave({ viewerId, from, to })
// -> approved, authorized date entries only:
// [{ date, employee: { _id, fullName }, type }]
// source handles working-day expansion and disclosure; no reasons/attachments
// returns [] when no authorized entries match, not every employee's full record

// holidays/holiday.service.js — Teammate B
listHolidays({ from, to })
// -> [{ _id, name, date, officeClosed }]

// notifications/notification.service.js — Lead, implemented last
createNotification({ recipientId, eventKey, type, title, message })
// eventKey is stable per intended recipient/event; retry must not duplicate it
// -> { _id }; return the existing record ID on an identical event retry
```

The calendar visibility policy must be settled before `listCalendarLeave` exposes real coworker records. Range/summary definitions above are implementation defaults for development, not claims about the old portal. Keep summaries and exports consistent if those defaults change.

Contract behavior: invalid inputs fail with the agreed validation error; a requested employee that does not exist is an error, not a zero balance. A valid employee with no requests gets an empty list/zero counts. A valid employee with no punch gets `not_punched_in` and null timestamps. A zero leave balance is a real calculated result, not a fallback when source data fails. `getLeaveBalance` must not invent opening balances while accrual policy or migration data is unavailable.

## 8. How owners start before shared dependencies are finished

1. Implement request validation, controllers, response mapping, and summary/export composition against the interfaces in section 7.
2. Use small fictional fixtures matching those exact results. Fixtures belong in development/test files, not hidden fallback branches in production endpoints.
3. If a source service is not implemented yet, use a clearly isolated development adapter with matching exports. Keep that adapter in the consumer owner's module; do not create or edit another owner's service file.
4. Replace adapters with real service imports as the source owner delivers them. Calendar/Dashboard belong to A and consume Lead-owned Leave; Reports belongs to the lead. Remove development adapters from the final request path and verify real integration.
5. Real source failures produce the normal error response. Never silently substitute sample values.

Example fixture shapes:

```js
const todayAttendance = {
  date: '2026-11-26',
  status: 'not_punched_in',
  punchInAt: null,
  punchOutAt: null,
  workedMinutes: 0,
};

const leaveBalance = {
  asOfDate: '2026-11-26',
  paidAvailableDays: 6,
  permissionUnlimited: true,
};
```

Reports initially concern personal leave, not payroll or company-wide attendance. CSV export is a **working proposal**, not a confirmed format. Finalize format/columns before that feature is considered complete. Safely serialize untrusted cell values if CSV is selected.

### Shared fictional dataset for handoff

Everything below is fictional development data, not employee records, approved opening balances, production seeds, or company policy. IDs are valid example ObjectId strings. Teammates should reuse these exact IDs in their own test fixtures so examples connect.

For these examples only, freeze the clock at `2026-11-26T06:00:00.000Z` and use test timezone `Asia/Kolkata`. That timezone remains unconfirmed for the real office. The test calendar permits the two fictional employees to see each other's names and leave types; this is not authorization for real cross-employee visibility.

```json
{
  "company": {
    "_id": "200000000000000000000001",
    "name": "Mobiyantra Private Limited"
  },
  "department": {
    "_id": "300000000000000000000001",
    "name": "IT",
    "workingDays": [1, 2, 3, 4, 5]
  },
  "designation": {
    "_id": "400000000000000000000001",
    "name": "Software Developer"
  },
  "employees": [
    {
      "_id": "100000000000000000000001",
      "fullName": "Alex Example",
      "email": "alex@example.test",
      "role": "employee",
      "status": "active",
      "company": "200000000000000000000001",
      "department": "300000000000000000000001",
      "designation": "400000000000000000000001",
      "joinDate": "2026-01-05"
    },
    {
      "_id": "100000000000000000000002",
      "fullName": "Taylor Example",
      "email": "taylor@example.test",
      "role": "employee",
      "status": "active",
      "company": "200000000000000000000001",
      "department": "300000000000000000000001",
      "designation": "400000000000000000000001",
      "joinDate": "2026-01-05"
    }
  ],
  "adminActor": {
    "id": "100000000000000000000003",
    "role": "admin"
  }
}
```

These are partial service/test records, not valid full signup payloads. They intentionally contain no passwords/hashes, private DOB/phone, or actual login credentials. Tests that persist full Employee documents must supply fictional required fields according to the final schema. Do not bypass validation to insert these partial objects as real accounts.

Alex's sample leave requests:

```json
[
  {
    "_id": "500000000000000000000001",
    "employeeId": "100000000000000000000001",
    "type": "paid",
    "startDate": "2026-11-24",
    "endDate": "2026-11-24",
    "days": 1,
    "status": "approved",
    "createdAt": "2026-11-20T05:00:00.000Z"
  },
  {
    "_id": "500000000000000000000002",
    "employeeId": "100000000000000000000001",
    "type": "permission",
    "startDate": "2026-11-27",
    "endDate": "2026-11-27",
    "days": 1,
    "status": "pending",
    "createdAt": "2026-11-25T05:00:00.000Z"
  },
  {
    "_id": "500000000000000000000003",
    "employeeId": "100000000000000000000001",
    "type": "paid",
    "startDate": "2026-11-25",
    "endDate": "2026-11-25",
    "days": 1,
    "status": "rejected",
    "createdAt": "2026-11-23T05:00:00.000Z"
  },
  {
    "_id": "500000000000000000000004",
    "employeeId": "100000000000000000000001",
    "type": "paid",
    "startDate": "2026-11-19",
    "endDate": "2026-11-19",
    "days": 1,
    "status": "cancelled",
    "createdAt": "2026-11-17T05:00:00.000Z"
  }
]
```

The cancelled row represents an already finalized cancellation. It does not define cancellation eligibility, approval fields, or balance-restoration timing. Taylor has no leave requests in this fixture. Request reasons/attachments are omitted from these summary fixtures, not removed from the full application form.

Sample holiday records:

```json
[
  {
    "_id": "600000000000000000000001",
    "name": "Example office closure",
    "date": "2026-11-18",
    "officeClosed": true
  },
  {
    "_id": "600000000000000000000002",
    "name": "Example observance",
    "date": "2026-11-20",
    "officeClosed": false
  }
]
```

Neither label/date is an actual approved holiday. The second record must not suppress attendance reminders or automatically exclude leave days.

### Exact service examples

All examples use the IDs above. Return values below are service results, without the HTTP `success/message/data` wrapper.

**Teammate B provides employee context:**

```js
await getEmployeeContext({ userId: '100000000000000000000001' });
// Result:
({
  userId: '100000000000000000000001',
  status: 'active',
  companyId: '200000000000000000000001',
  departmentId: '300000000000000000000001',
  designationId: '400000000000000000000001',
  departmentName: 'IT',
  workingDays: [1, 2, 3, 4, 5],
  joinDate: '2026-01-05',
});
```

**Teammate A provides attendance:**

```js
await getTodayAttendance({ employeeId: '100000000000000000000001' });
// Result at the frozen clock, with no session:
({
  date: '2026-11-26',
  status: 'not_punched_in',
  punchInAt: null,
  punchOutAt: null,
  workedMinutes: 0,
});
```

Separate attendance scenarios must not be combined as if they were multiple sessions: an open session starting `2026-11-26T04:30:00.000Z` has status `punched_in`, null punch-out, and `workedMinutes: 90` at the frozen clock. A completed historical session on `2026-11-24` from `04:30:00.000Z` to `12:30:00.000Z` has status `completed` and `workedMinutes: 480`.

**Lead provides balance and summary:**

```js
await getLeaveBalance({
  employeeId: '100000000000000000000001',
  asOfDate: '2026-11-26',
});
// Fixture result; six days are a declared mock result, not computed from join date:
({ asOfDate: '2026-11-26', paidAvailableDays: 6, permissionUnlimited: true });

await getLeaveSummary({
  employeeId: '100000000000000000000001',
  from: '2026-11-01',
  to: '2026-11-30',
});
// Result from the four sample requests:
({
  from: '2026-11-01',
  to: '2026-11-30',
  totalRequests: 4,
  approved: 1,
  pending: 1,
  rejected: 1,
  cancelled: 1,
  paidApprovedDays: 1,
  permissionApprovedDays: 0,
});
```

The six-day balance cannot be inferred from these four records. Real balance integration requires authoritative credits/opening history and settled accrual rules. Do not put a hardcoded six in Leave or Dashboard to make a fixture pass.

**Request list:** call `listEmployeeLeaveRequests` with Alex's `employeeId`, the same November range, `page: 1`, `limit: 20`, and no status filter. Return the four request summary rows above without `employeeId`, ordered by `createdAt` descending (IDs ending `002`, `003`, `001`, `004`). Pagination is `{ page: 1, limit: 20, total: 4, totalPages: 1 }`. A `pending` status filter returns only ID ending `002`, with total `1`. This newest-first order is the default service order; additional search/type/sort filters require an agreed extension rather than consumers changing source queries independently.

**Calendar and holidays:**

```js
await listCalendarLeave({
  viewerId: '100000000000000000000001',
  from: '2026-11-01',
  to: '2026-11-30',
});
// Result under the fictional test visibility policy:
([
  {
    date: '2026-11-24',
    employee: { _id: '100000000000000000000001', fullName: 'Alex Example' },
    type: 'paid',
  },
]);

await listHolidays({ from: '2026-11-01', to: '2026-11-30' });
// Result: the two sample holiday records above, ordered by date ascending.
```

November 26 selected-day results and On Leave Today are empty. November 27 pending Permission Leave is absent from the approved calendar. Rejected/cancelled requests never appear as current approved leave. An upcoming window November 26–30 has no approved entries in this fixture.

**Notification creation:**

```js
await createNotification({
  recipientId: '100000000000000000000001',
  eventKey: 'leave_approved:500000000000000000000001:100000000000000000000001',
  type: 'leave_approved',
  title: 'Leave approved',
  message: 'Your Paid Leave for 24 November was approved.',
});
// First call and identical retry both return:
({ _id: '700000000000000000000001' });
```

That ID is illustrative; real IDs are generated by persistence. Deduplication must be scoped to the intended recipient/event and must work for concurrent retries, not just these sequential calls.

### Additional Teammate B-owned employee interfaces for display modules

These settle the small identity/roster dependencies named in the assignment. They are still specifications, not existing exports.

```js
// employees/employee.service.js
getEmployeeDisplay({ userId })
// -> { _id, fullName }; active own identity for Dashboard

getCalendarRosterCount({ viewerId, date })
// -> { date, totalEmployees }; only the roster visible under settled policy
```

For Alex, `getEmployeeDisplay` returns `{ _id: '100000000000000000000001', fullName: 'Alex Example' }`. For November 26, the fictional two-person visibility fixture returns `{ date: '2026-11-26', totalEmployees: 2 }`. Calendar may show two roster members and zero approved-leave employees; this is not proof both are physically present. Do not publish a live Working count from those values.

Keep roster/visibility enforcement in the Teammate B-owned Employees source. The real scope and historical roster treatment remain unresolved. Monthly leave usage/chart-series interfaces, birthday-recipient queries, and optional report export columns remain explicit follow-up contracts; no consumer should invent these through direct database reads.

### Minimum fixture and integration scenarios

| Scenario | Required behavior |
|---|---|
| Taylor has no requests | Empty list; all request counts zero; no calendar leave entry. Do not infer a balance from the absence of requests. |
| Alex requests Taylor's personal leave report | Denied, even if a forged employee ID is in the request. |
| No daily session | Null times, zero duration, `not_punched_in`; no phantom attendance record. |
| Pending/rejected/cancelled leave | Excluded from approved calendar; each counted in its own summary category. |
| Repeated notification event | Same event yields one stored recipient notification. |
| Source service fails | Normal error response; never substitute fixture values or a fake zero balance. |
| Invalid/nonexistent ID | Validation/not-found behavior from the contract, not an empty-success response. |
| Approval or accepted cancellation changes source data | Calendar, summaries, and balance reflect the source after refresh; consumers do not apply deductions/restorations themselves. |

Fixture-level success means the consumer matches the agreed shape. It is not proof of real authentication, accrual correctness, geofence accuracy, scheduled execution, or resolved company policy.

## 9. Confirmed business rules everyone must preserve

- One shared portal for four companies; one office; no remote/hybrid feature.
- Everyone works 10:00–18:00. IT works Monday–Friday; other departments Monday–Saturday.
- Office Closed dates suppress attendance reminders and are excluded from leave counts.
- Geofenced punch-in; punch-out from anywhere. One normal daily session.
- Open sessions close automatically at 23:59. No added full-day/half-day classification or mandatory correction workflow.
- Paid leave earns one day per month and carries forward without expiry; Paid Leave is prohibited on Mondays and Fridays.
- Permission Leave is unlimited/unpaid, including Mondays and Fridays; Admin approval still applies.
- Admin reviews registrations and leave. Employee company/department/designation changes are Admin-only.
- Operational alerts initially stay inside the portal. Password recovery is a separate delivery decision.
- Payslips are Admin-uploaded PDFs; no payroll calculation engine.
- Asset repair/return requests: pending -> approved/rejected; approved -> completed. Employee can cancel pending requests. Description required, photos optional, rejection reason required. Return stays assigned until Admin confirms receipt.

## 10. Dates, files, jobs, and consistency

- Define an explicit `OFFICE_TIMEZONE`; never infer office policy from a browser, developer machine, or server timezone. `Asia/Kolkata` is a candidate, not yet a confirmed office setting.
- Server time determines punches. Validate submitted coordinates/ranges and use configured geofence settings; browser coordinates alone cannot guarantee physical presence.
- Office-local dates drive daily session uniqueness, calendars, reminders, and accrual. Store instants separately from date-only values.
- Teammate A owns automatic punch-out and attendance reminder eligibility rules. The lead owns leave accrual and the shared working-day helper. The lead implements Notifications last, including alert persistence/history, birthday/holiday jobs, reminder scheduling and event delivery integration. Teammate B supplies holiday data. The lead owns shared deployment/configuration integration; provider selection and reliable execution while hosting sleeps remain unresolved.
- Duplicate requests/jobs must not create second daily sessions, second monthly credits, repeated decision effects, or duplicate notifications. Use database constraints and atomic state changes appropriate to each operation.
- The lead defines private persistent storage/upload helpers. Assets and Payslips (Teammate B) validate file content, type and size, and enforce authorized retrieval. Do not depend on temporary server disk or expose permanent public payslip URLs.
- Notification failures must not make a successfully saved leave decision appear unsaved. The source owner defines retryable delivery; consumers must not repeat business mutations to resend an alert.

## 11. Open decisions — do not silently fill these in

| Decision | When it is needed |
|---|---|
| Office timezone, coordinates, geofence radius/accuracy handling | Attendance implementation and real date-based jobs |
| Join-date requiredness, accrual start/proration, opening balances | Employee activation and leave accrual |
| Leave overlaps, pending reservation, date-range/weekend treatment, cancellation eligibility | Leave validation and balance updates |
| Correction eligibility/review rules | Attendance correction workflow |
| Exact 18:30 reminder eligibility and approved-leave exemptions | Notification jobs |
| Birthday/holiday recipients and timing | Related notification jobs |
| Directory/calendar audience and visible fields | Real shared data access |
| Authentication expiry/revocation, CSRF/origin behavior, recovery delivery | Phase 3 |
| File storage, formats/limits, payslip period/replacement rules | Upload implementation |
| Report periods, charts, export format/columns | Reports completion |
| Initial Admin setup details, rejected/disabled account policy | Account management completion |

These do not prevent isolated development with fictional data. They do prevent claiming the affected workflow is ready for real employees.

## 12. Handoff and implementation status

- [x] Preserve the agreed module split.
- [x] Draft shared Employee/organization fields and reference conventions.
- [x] Define authentication context, permissions, and HTTP conventions.
- [x] Define source ownership and minimum service interfaces.
- [x] Define shared references, serialization rules, and canonical status/type names.
- [x] Explain isolated development while real authentication is postponed.
- [x] Give owners an isolated fictional-data approach for unfinished shared dependencies.
- [x] Separate confirmed policies, working defaults, and unresolved decisions.
- [ ] Walk through this document with both teammates; accept or revise working contracts before parallel implementation.
- [x] Handoff step 2: complete module assignments, proposed API lists, and completion criteria documented in `backend-assignments.md`.
- [x] Handoff step 3: fictional dataset, service examples, dependency ownership, and integration sequence documented; source implementations and unresolved policy decisions remain outstanding.
- [x] Handoff step 4: branch, review, shared-file ownership, and integration workflow documented in `backend-assignments.md`; no Git operations performed by this documentation task.
- [x] Phase 2: shared server/database/error foundation and setup guide implemented; automated checks use a mocked database. A live Atlas connection remains to be verified.
- [ ] Authentication/employee foundation after handoff: A implements Auth; B implements Employees and registration approval against the same Employee model.

This is the shared contract, not a second feature specification. This handoff update changes documentation only; it does not implement authentication or alter application files, database records, screenshots, or ZIP archives.
