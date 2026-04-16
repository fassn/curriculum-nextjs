#!/usr/bin/env sh
set -eu

if [ "${RUN_DB_MIGRATIONS:-true}" = "true" ]; then
  echo "[startup] Running Prisma migrations..."
  npm run db:migrate:deploy
else
  echo "[startup] Skipping Prisma migrations (RUN_DB_MIGRATIONS=${RUN_DB_MIGRATIONS:-false})."
fi

if [ "${RUN_ADMIN_SEED:-false}" = "true" ]; then
  echo "[startup] Seeding admin user..."
  npm run db:seed:admin
else
  echo "[startup] Skipping admin seed (RUN_ADMIN_SEED=${RUN_ADMIN_SEED:-false})."
fi

echo "[startup] Starting Next.js server..."
exec node server.js
