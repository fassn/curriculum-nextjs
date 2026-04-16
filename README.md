My curriculum, portfolio and a small blog/diary with mood posts.
Built with NextJS, PostgreSQL and Prisma.

## Getting Started

- `npm i`
- copy .env.example to .env.local
- fill the missing credentials in .env.local

run the development server with NextJS:

```bash
npm run dev
```

With NextJS development server:
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

If you used a custom `LOCAL_POSTGRES_PORT`, update the port in `DATABASE_URL` to match.

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

Currently deployed on [christopherfargere.com](christopherfargere.com).

When deploying behind a reverse proxy (Coolify/Traefik, Nginx, etc.), set
`SERVER_ACTIONS_ALLOWED_ORIGINS` to your public host(s), comma-separated (for
example: `christopherfargere.com,www.christopherfargere.com`).

For contact form email delivery, also set:
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`,
`CONTACT_FROM_EMAIL`.

For server-side reCAPTCHA verification, set `NEXT_PUBLIC_RECAPTCHA_KEY`,
`RECAPTCHA_SECRET`, and optionally `RECAPTCHA_MIN_SCORE` (default: `0.5`).

For PostgreSQL blog storage (Prisma), set:
`DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public`

For admin authentication, set:
`ADMIN_SESSION_SECRET` (long random string),
`ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

At container startup, `npm run env:check` now validates required production
environment variables and exits early if configuration is missing/invalid.

Container startup now runs Prisma migration automatically by default
(`RUN_DB_MIGRATIONS=true`).

To seed/update the single admin user on deploy, set `RUN_ADMIN_SEED=true`
for one deployment, then switch it back to `false`:

```bash
npm run db:seed:admin
```

`POST /api/posts` and `PUT /api/posts/[postId]` now require
an authenticated admin session cookie created by `/api/admin/session` plus a
valid CSRF token (`X-CSRF-Token`) matching the `admin_csrf` cookie.

`POST /api/admin/session` is rate-limited by client IP to reduce brute-force
sign-in attempts.

### Production cutover checklist

1. **Open the target service in Coolify**
   - Go to: **Project -> Environment -> Resource (your app service)**.
   - Confirm you are in the correct environment (staging vs production).

2. **Update environment variables in Coolify UI**
   - Go to: **Environment Variables** tab.
   - Ensure these are set and saved:
     `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
     `SERVER_ACTIONS_ALLOWED_ORIGINS`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
     `SMTP_PASS`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`,
      `NEXT_PUBLIC_RECAPTCHA_KEY`, `RECAPTCHA_SECRET`
      (optional `RECAPTCHA_MIN_SCORE`), `RUN_DB_MIGRATIONS` (default `true`),
      `RUN_ADMIN_SEED` (default `false`).
   - Keep the old values copied somewhere safe before changing them.

3. **Take a PostgreSQL backup before migration**
   - From your DB host shell (or a trusted admin runner), run:

```bash
pg_dump "$DATABASE_URL" > pre-cutover-$(date +%F-%H%M%S).sql
```

4. **Deploy the new application version in Coolify**
   - Go to: **Deployments** tab.
   - Trigger deployment of the new commit/image.
   - Keep the previous successful deployment visible in history for rollback.

5. **Control migration + admin seed behavior for this deployment**
    - Ensure `RUN_DB_MIGRATIONS=true` so startup applies pending migrations.
    - If you need to create/update the admin user, set `RUN_ADMIN_SEED=true`
      for this deploy only, then set it back to `false` afterward.

6. **Watch logs and health in Coolify**
   - Go to: **Logs** tab and confirm no startup/runtime errors.
   - Confirm service is marked healthy/running after deployment.

7. **Post-deploy smoke checks**
   - `GET /blog` returns posts.
   - Sign in via `/signin` with admin credentials.
   - Create and edit a post from `/admin`.
   - Submit the contact form once and confirm email delivery.

### Rollback checklist

1. **Application rollback**
   - Go to: **Deployments** tab in Coolify.
   - Select the last known-good deployment and redeploy it.
   - Re-check logs and health after rollback deployment finishes.

2. **Database rollback (only if needed)**
   - Restore from the backup taken before cutover:

```bash
psql "$DATABASE_URL" < pre-cutover-YYYY-MM-DD-HHMMSS.sql
```
