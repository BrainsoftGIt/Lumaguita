cd /D "%~dp0"
set PGPASSWORD=1234
psql postgres postgres      < src/0-create-database.sql
psql maguita_uuid postgres  < src/1-create-extensions.sql
psql maguita_uuid maguita   < src/2-import-database-with-data.sql
psql maguita_uuid maguita   < src/3-rename-schemas.sql
psql maguita_uuid maguita   < src/4-create-uuid-structure.sql
psql maguita_uuid postgres  < src/5-disable-all-triggers.sql
psql maguita_uuid maguita   < src/6-importa-data-to-uuid.sql
psql maguita_uuid maguita   < src/7-importa-data-from-map.sql
psql maguita_uuid postgres  < src/8-enable-all-triggers.sql
rem psql maguita_uuid maguita   < src/9-drop-olds-schemas.sql
psql maguita_uuid maguita   < ../scripts/session.sql

