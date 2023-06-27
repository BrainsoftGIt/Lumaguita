set PGPASSWORD=1234
"C:\\Program Files\\PostgreSQL\\13\\bin\\pg_dump.exe" -U maguita_dev -d maguita_dev -cOv --if-exists -f base.db
rem "C:\\Program Files\\PostgreSQL\\13\\bin\\pg_dump.exe" -U maguita_baiadabo -d maguita_baiadabo -cOv --if-exists -f base.db