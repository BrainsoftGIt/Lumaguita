grant USAGE ON SCHEMA auth, cluster, lib, geoinfo, map, public, rule, tweeks to maguita_prod_clone ;
grant all ON database maguita_prod to maguita_prod_clone; -- auth, cluster, lib, geoinfo, map, public, rule, tweeks to maguita_clone ;

grant all privileges ON all tables in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_prod_clone;
grant all privileges ON all functions in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_prod_clone;
grant all privileges ON all sequences in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_prod_clone;
grant all privileges ON all routines in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_prod_clone;
grant all privileges ON all procedures in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_prod_clone;
grant all privileges ON database maguita_prod to maguita_prod_clone;
