cd /D "%~dp0"
set /p maguita_db="MAGUITA DBNAME: "
set /p maguita_usr="MAGUITA USER NAME: "
set /p maguita_pwd="MAGUITA PASSWORD: "
set /p postgres_pwd="POSTGRES PASSWORD: "

set PGPASSWORD=%postgres_pwd%
psql postgres postgres      < 0-create-empty-database.sql
psql %maguita_db% postgres  < 1-create-extensions.sql

set PGPASSWORD=%maguita_pwd%
psql %maguita_db% %maguita_usr%   < ../../../backup-olds/last.maguita.db.sql