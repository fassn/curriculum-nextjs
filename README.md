# Curriculum Next.js

Curriculum/portfolio site with a small blog/diary.
Built with Next.js, PostgreSQL, and Prisma.

## Getting Started

1. `npm i`
1. Copy `.env.example` to `.env.local`
1. Fill required credentials in `.env.local`

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Local PostgreSQL (Docker)

Spin up a local PostgreSQL 16 container for testing admin auth seed + blog data:

```bash
npm run db:local:up
```

If port `5433` is already used on your machine, pick another host port:

```bash
LOCAL_POSTGRES_PORT=55433 npm run db:local:up
```

Use this local DB connection in `.env.local`:

```bash
DATABASE_URL=postgresql://curriculum:curriculum@localhost:5433/curriculum?schema=public
```

If you used a custom `LOCAL_POSTGRES_PORT`, update the port in
`DATABASE_URL` to match.

One-command bootstrap (start DB + wait + migrate + admin seed + sample posts):

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-me-long-password npm run db:local:bootstrap
```

The bootstrap command uses `LOCAL_POSTGRES_PORT` (default `5433`) and computes
`DATABASE_URL` automatically unless you provide your own.

One-command reset (drop local DB volume/data, then run a clean bootstrap):

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-me-long-password npm run db:local:reset
```

Apply migrations, create/update the single admin, and optionally insert sample posts:

```bash
npm run db:migrate:deploy
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-me-long-password npm run db:seed:admin
npm run db:seed:sample-posts
```

When done:

```bash
npm run db:local:down
# or remove volume/data too
npm run db:local:down:volumes
```

## Deploy

Currently deployed on [christopherfargere.com](https://christopherfargere.com).

GitHub CI runs lint/test/build on every PR to `main`.
Set branch protection so merge requires status check: `CI / quality-gates`.

When deploying behind a reverse proxy (Coolify/Traefik, Nginx, etc.), set
`SERVER_ACTIONS_ALLOWED_ORIGINS` to your public host(s), comma-separated (for
example: `christopherfargere.com,www.christopherfargere.com`).

Environment variable contract for container startup:

- **Always required**: `DATABASE_URL`, `ADMIN_SESSION_SECRET` (minimum 32 chars)
- **Required in production** (contact feature): `RECAPTCHA_SECRET`,
  `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`,
  `CONTACT_FROM_EMAIL`
- **Client + tuning**: `NEXT_PUBLIC_RECAPTCHA_KEY`,
  optional `RECAPTCHA_MIN_SCORE` (default `0.5`)
- **Reverse proxy**: `SERVER_ACTIONS_ALLOWED_ORIGINS` (comma-separated hosts)
- **Startup flags**: `RUN_DB_MIGRATIONS` (default `true`), `RUN_ADMIN_SEED`
  (default `false`)
- **Conditionally required when `RUN_ADMIN_SEED=true`**: `ADMIN_EMAIL`,
  `ADMIN_PASSWORD` (minimum 12 chars)

Container startup flow (`scripts/container-start.sh`):

1. `npm run env:check`
1. `npm run db:migrate:deploy` when `RUN_DB_MIGRATIONS=true`
1. `npm run db:seed:admin` when `RUN_ADMIN_SEED=true`
1. Start Next.js server

`POST /api/posts` and `PUT /api/posts/[postId]` now require
an authenticated admin session cookie created by `/api/admin/session` plus a
valid CSRF token (`X-CSRF-Token`) matching the `admin_csrf` cookie.

`POST /api/admin/session` is rate-limited by client IP to reduce brute-force
sign-in attempts.

### Production cutover checklist

1. **Open target service in Coolify**
   - Go to: **Project -> Environment -> Resource (your app service)**.
   - Confirm you are in the correct environment (staging vs production).

1. **Update environment variables in Coolify UI**
   - Go to: **Environment Variables** tab.
   - Ensure these are set and saved:
      `DATABASE_URL`, `ADMIN_SESSION_SECRET`,
      `SERVER_ACTIONS_ALLOWED_ORIGINS`,
      `NEXT_PUBLIC_RECAPTCHA_KEY`, `RECAPTCHA_SECRET`,
      `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
      `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`,
      optional `RECAPTCHA_MIN_SCORE`,
      `RUN_DB_MIGRATIONS` (default `true`),
      `RUN_ADMIN_SEED` (default `false`),
      and `ADMIN_EMAIL` + `ADMIN_PASSWORD` only when `RUN_ADMIN_SEED=true`.
   - Keep the old values copied somewhere safe before changing them.

1. **Take PostgreSQL backup before migration**
   - From your DB host shell (or a trusted admin runner), run:

```bash
pg_dump "$DATABASE_URL" > pre-cutover-$(date +%F-%H%M%S).sql
```

1. **Deploy new application version in Coolify**
   - Go to: **Deployments** tab.
   - Trigger deployment of the new commit/image.
   - Keep the previous successful deployment visible in history for rollback.

1. **Control migration + admin seed behavior for deployment**
    - Ensure `RUN_DB_MIGRATIONS=true` so startup applies pending migrations.
    - If you need to create/update the admin user, set `RUN_ADMIN_SEED=true`
      for this deploy only, then set it back to `false` afterward.

1. **Watch logs and health in Coolify**
   - Go to: **Logs** tab and confirm no startup/runtime errors.
   - Confirm service is marked healthy/running after deployment.

1. **Run post-deploy smoke checks**
   - `GET /api/health` returns `{ "status": "ok" }`.
   - `GET /blog` returns posts.
   - Sign in via `/signin` with admin credentials.
   - Create and edit a post from `/admin`.
   - Submit the contact form once and confirm email delivery.

### Rollback checklist

1. **Application rollback**
   - Go to: **Deployments** tab in Coolify.
   - Select the last known-good deployment and redeploy it.
   - Re-check logs and health after rollback deployment finishes.

1. **Database rollback (only if needed)**
   - Restore from the backup taken before cutover:

```bash
psql "$DATABASE_URL" < pre-cutover-YYYY-MM-DD-HHMMSS.sql
```
