cd /D "%~dp0"
set PGPASSWORD=1234
rem pg_dump -U maguita -d maguita_uuid -cOv --if-exists -f prepare/downloads.sql -h 216.137.179.55

curl 216.137.179.55:49278/backup.sql > prepare/downloads.db

set PGDATABASE=maguita_remote_clean
psql -U postgres -d postgres -f prepare/migrate-recreate.sql
psql -U maguita -f ../../build/db/extension.sql
psql -U maguita -f prepare/downloads.db
psql -U maguita -f ../../build/db/clean.sql

pg_dump -U maguita -cOv --if-exists -f ../../build/db/base.db
