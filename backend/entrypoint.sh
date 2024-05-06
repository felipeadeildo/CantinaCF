#!/bin/bash

DB_DIR="/app/instance"
DB_FILE="$DB_DIR/database.sqlite3"

mkdir -p "$DB_DIR"
chmod -R 755 "$DB_DIR"

if [ ! -f "$DB_FILE" ]; then
    echo "Initializing database..."
    flask --app cantina db initdb
else
    echo "Database already initialized."
    flask --app cantina db upgrade
    echo "Database updated."
fi

flask --app cantina run --host=0.0.0.0 --port=5000
