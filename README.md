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

Then apply the Prisma migration and seed/update the single admin user:

```bash
npm run db:migrate:deploy
npm run db:seed:admin
```

`POST /api/posts` and `PUT /api/posts/[postId]` now require
an authenticated admin session cookie created by `/api/admin/session` plus a
valid CSRF token (`X-CSRF-Token`) matching the `admin_csrf` cookie.

`POST /api/admin/session` is rate-limited by client IP to reduce brute-force
sign-in attempts.
