truncate cluster."users";
insert into cluster.users( user_default, user_replication ) values ( 'maguita_prod', 'maguita_prod_clone' );

select * from cluster.users;