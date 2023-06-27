cd /D "%~dp0"
set PGPASSWORD=1234
pg_dump -U maguita -d maguita_uuid -cOv --if-exists -f local/local.base.db
