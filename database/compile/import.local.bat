@echo off
cd /D "%~dp0"
set PGPASSWORD=1234

psql -U postgres -d postgres -f local/local.recreate.sql

set PGDATABASE=maguita_uuid
call ./install/import.base.bat
