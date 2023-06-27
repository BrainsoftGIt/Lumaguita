@echo off
SET PGHOST=localhost
SET PGPORT=5432
SET PGUSER=maguita_dev
SET PGPASSWORD=1234
SET PGDATABASE=maguita_dev

cd %~dp0

echo "PWD" %cd%
 echo %~dp0
echo "PWD" %cd%

psql -f "%~dp0core-engine\_base.engine.sql"
rem psql -f ".\core-engine\prepare.engine.sql"
rem psql -f ".\core-engine\report.engine.sql"
rem psql -f ".\core-engine\x3.engine.sql"
rem psql -f ".\core-templates\aggregate.template.sql"
rem psql -f ".\core-templates\query.template.sql"
rem psql -f ".\sources\balanco.sorce.report.sql"
rem psql -f ".\sources\caixa.source.report.sql"
rem psql -f ".\sources\conta.source.report.sql"
rem psql -f ".\sources\fatura.source.report.sql"
rem psql -f ".\sources\fluxo.source.report.sql"
rem psql -f ".\sources\imposto.source.report.sql"
rem psql -f ".\sources\venda.source.report.sql"


