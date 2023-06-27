PGPASSWORD=ab7799513
pg_dump -h prod.db.brainsoftstp.com -U maguita_central -d maguita_central -c -O -v --if-exists -f prod.base.db