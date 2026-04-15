#!/usr/bin/env bash
set -euo pipefail

echo "Tearing down local PostgreSQL (including volume data)..."
docker compose -f docker-compose.local-postgres.yml down -v

echo "Running fresh local DB bootstrap..."
npm run db:local:bootstrap
