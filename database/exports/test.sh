PGPASSWORD=1234
pg_dump -h test.db.brainsoftstp.com -U maguita_test -d maguita_test -c -O -v --if-exists -f test.base.db