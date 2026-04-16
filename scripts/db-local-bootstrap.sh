#!/usr/bin/env bash
set -euo pipefail

LOCAL_POSTGRES_PORT="${LOCAL_POSTGRES_PORT:-5433}"
export DATABASE_URL="${DATABASE_URL:-postgresql://curriculum:curriculum@localhost:${LOCAL_POSTGRES_PORT}/curriculum?schema=public}"

if [[ -z "${ADMIN_EMAIL:-}" || -z "${ADMIN_PASSWORD:-}" ]]; then
    echo "ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set."
    echo "Example:"
    echo "  ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-me-long-password npm run db:local:bootstrap"
    exit 1
fi

echo "Starting local PostgreSQL..."
docker compose -f docker-compose.local-postgres.yml up -d

echo "Waiting for PostgreSQL healthcheck..."
for attempt in {1..60}; do
    health_status="$(docker inspect -f '{{.State.Health.Status}}' curriculum-postgres-local 2>/dev/null || true)"
    if [[ "${health_status}" == "healthy" ]]; then
        break
    fi

    if [[ "${attempt}" -eq 60 ]]; then
        echo "ERROR: PostgreSQL did not become healthy in time."
        exit 1
    fi

    sleep 1
done

echo "Applying migrations..."
npm run db:migrate:deploy

echo "Seeding admin user..."
npm run db:seed:admin

echo "Seeding sample posts..."
npm run db:seed:sample-posts

echo "Bootstrap complete."
masked_database_url="$(printf '%s' "${DATABASE_URL}" | sed -E 's#(postgres(ql)?://[^:/@]+:)[^@]*@#\1***@#')"
echo "DATABASE_URL=${masked_database_url}"
