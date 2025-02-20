# PowerShell script to connect to a PostgreSQL database using the psql command-line tool.
# The script reads the database connection parameters from the .env file in the current directory.
# The .env file should contain the following environment variables:
# - DB_HOST: the hostname or IP address of the PostgreSQL server (default:
# - DB_PORT: the port number of the PostgreSQL server (default: 5432)
# - POSTGRES_DB: the name of the database to connect to
# - POSTGRES_USER: the username to use for the connection   
# - POSTGRES_PASSWORD: the password to use for the connection

Get-Content "./.env" | ForEach-Object {
    if ($_ -match "^(.*?)=(.*)$") {
        Set-Item -Path "env:$($matches[1])" -Value "$($matches[2])"
    }
}

$DB_HOST = $env:DB_HOST
if (-not $DB_HOST) { $DB_HOST = "127.0.0.1" }
$DB_PORT = $env:DB_PORT
if (-not $DB_PORT) { $DB_PORT = "5432" }

$DB_NAME = $env:POSTGRES_DB
$DB_USER = $env:POSTGRES_USER
$DB_PASS = $env:POSTGRES_PASSWORD
if ($DB_PASS) {
    $env:PGPASSWORD = $DB_PASS
}

Write-Host "Connecting to PostgreSQL database '${DB_NAME}' on '${DB_HOST}:${DB_PORT}'..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME
