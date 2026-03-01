<#
Simple helper to start Postgres via Docker Compose and follow logs.
Usage: ./scripts/start-db.ps1
#>
Write-Host "Starting PostgreSQL via docker compose..."
docker compose up -d
Write-Host "Tailing postgres logs (CTRL+C to stop)..."
docker compose logs -f postgres
