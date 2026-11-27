# HRMS backend

Express and MongoDB backend written in JavaScript with ES modules.

## Setup

Use Node.js 24 and npm. You also need a working MongoDB Atlas connection (or a local MongoDB instance).

From the project root:

```powershell
cd server
npm ci
```

Create `.env` from `.env.example` only if `.env` does not already exist:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Edit your local `.env`:

| Setting | Purpose |
|---|---|
| `NODE_ENV` | `development`, `test`, or `production`; defaults to `development`. |
| `PORT` | API port; defaults to `3000`. |
| `MONGODB_URI` | Your MongoDB connection string. The example uses a local database; replace it with your Atlas URI if using Atlas. |
| `CLIENT_ORIGIN` | Frontend origin, such as `http://localhost:5173`, without an application path. |

For Atlas, configure a database user and network access for the machine running the server. Keep real credentials in `.env`, which is ignored by Git. Commit only placeholder settings in `.env.example`.

## Run

From `server/`:

```powershell
npm start
```

The database connects before the server listens. Expected output with valid settings:

```text
MongoDB connected
Server is running on port 3000
```

Open [the health endpoint](http://localhost:3000/api/health):

```json
{
  "success": true,
  "message": "Server is running"
}
```

Use your configured port if it differs from `3000`. This endpoint checks that HTTP requests are being answered; it does not check ongoing database connectivity.

## Tests

From `server/`:

```powershell
npm test
```

Tests cover configuration validation, middleware/error responses, the health endpoint, and startup ordering/failure. They use fictional settings and mocked database connections, so they do not need Atlas or verify a real Atlas connection. HTTP tests use temporary local ports.

## Folder guide

```text
server.js           Starts the server after connecting to MongoDB
src/app.js          Express middleware, router mounting, health endpoint
src/config/         Validated environment settings and database connection
src/middlewares/    Shared request/error middleware
src/utils/          Shared helpers, including AppError
src/modules/        Feature routes, controllers, services, models, validation
tests/              Automated checks
.env.example        Placeholder environment settings
```

Import feature routers in the marked area of `src/app.js`, then mount them after middleware and before `notFound` and `errorHandler`. Routes use `/api`, without `/v1`. Individual endpoints belong in their module's routes file.

## Current stage

The shared foundation is implemented. All 12 module folders exist, but business features and authentication are not implemented yet. JWT authentication, roles, account approval, file handling, and scheduled jobs still need implementation. Graceful shutdown is not implemented in the current simplified startup.

Next: B implements the Employee model in `src/modules/employees/`; A implements Auth against that shared model. B owns employee approval/profile operations. The lead owns Leave, Reports, Organizations, and Notifications last.

Shared interfaces and assignments are documented in `../docs/backend-contracts.md` and `../docs/backend-assignments.md`. The current root `.gitignore` does not exclude `docs/`; include intended handoff documents in a reviewed commit before teammates clone.

## Common startup problems

- **Invalid environment configuration:** check the setting names shown in the error and your `.env` values.
- **MongoDB connection failed:** check the URI, database credentials, Atlas network access, and connectivity.
- **Server failed to start:** check whether another process already uses the configured port.

Run commands from `server/`. Configuration resolves `.env` relative to the server files, so startup does not depend on the terminal's environment-file lookup path.
