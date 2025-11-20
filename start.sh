#!/bin/sh
set -e

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting application..."
node dist/src/main
