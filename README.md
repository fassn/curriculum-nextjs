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
