SET PGHOST=localhost
SET PGPORT=5432
SET PGUSER=maguita_dev
SET PGPASSWORD=1234
SET PGDATABASE=maguita_dev

psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\engines\_base.engine.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\engines\prepare.engine.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\engines\report.engine.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\engines\x3.engine.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\templates\aggregate.template.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\templates\query.template.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\sources\balanco.sorce.report.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\sources\caixa.source.report.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\sources\conta.source.report.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\sources\fatura.source.report.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\sources\fluxo.source.report.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\sources\imposto.source.report.sql" 
psql -f "C:\var\workspace\maguita\maguita-cluster\database\project\upgrade\current\reports\sources\venda.source.report.sql" 
