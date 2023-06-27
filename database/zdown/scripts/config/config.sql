drop database if exists maguita_uuid;
drop user if exists maguita ;
create user maguita with password  '1' login;
create database maguita_db with owner maguita_sa;
alter user maguita_sa set search_path to tweeks, public, opr;
alter user maguita_sa set timezone to 'Africa/Sao_Tome';
alter user maguita_sa set enable_seqscan  to false;
alter database maguita_db set search_path to tweeks, public, opr;
alter database maguita_db set timezone to 'Africa/Sao_Tome';
alter database maguita_db set enable_seqscan  to false;

alter user maguita_sa with password 'Mnagkw310*Smh9@lOa';
\c maguita_db
create extension if not exists unaccent with schema public;
