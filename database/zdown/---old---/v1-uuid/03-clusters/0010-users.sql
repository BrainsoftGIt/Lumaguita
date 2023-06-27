--// Users
truncate cluster.users;
insert into cluster.users( user_default, user_replication ) values ( 'maguita', 'maguita_clone' );

-- create user  maguita_clone with password '1234' superuser;

