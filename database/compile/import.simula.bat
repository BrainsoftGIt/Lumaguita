@echo off
cd /D "%~dp0"
set PGPASSWORD=1234

psql -U postgres -d postgres -f simula/recreate.sql

set PGDATABASE=maguita_cluster_00
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_01_simula_main
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_01_01_simula_child
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_02_cloud
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_02_cloud_sub
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_01_03
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_02
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_03
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_04
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_05
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_05_01
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_05_02
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_05_02_01
call ./simula/imoport.script.bat

set PGDATABASE=maguita_cluster_05_02_02
call ./simula/imoport.script.bat

