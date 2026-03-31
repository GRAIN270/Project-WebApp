# Current Organized Structure

Root: `Project-WebApp-main/`

```text
Project-WebApp-main/
  backend/
    server.js
    package.json
    package-lock.json
    .env.example
  frontend/
    app.js
    customer/
    admin/
    cashier/
    cook/
    login/
  shared/
    app.js
  docs/
    STRUCTURE.md
  sql/
  archive/

```

## Run (new structure)
1. `cd backend`
2. `npm.cmd install`
3. `npm.cmd start`

## Main URLs (new structure)
- `/frontend/login/customer-login.html`
- `/frontend/login/staff-login.html`
- `/frontend/customer/customer-dashboard.html`
- `/frontend/admin/dashboard_Admin.html`
- `/frontend/cashier/Cashier.html`
- `/frontend/cook/ck-dsb.html`

## Notes
- All active pages should use files in `frontend/` and APIs in `backend/server.js`.
- `backupflie/` is not part of runtime flow.
