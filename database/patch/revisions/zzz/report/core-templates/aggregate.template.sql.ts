import {block} from "../../../../core/updater";

block( module, { identifier:"report:template|aggregation" } ).sql`
delete from report.template where type = 'agg';

insert into report.template( type, name, configs ) values ( 'agg', 'sum', '{
  "name": { "$template": true, "$structure": "Soma de \${name}", "$default": "Somatorio", "$type": "text" },
  "func": "sum",
  "format":"int",
  "rename": { "$template":true, "$default": "SOMA", "$structure": "SUM \${name}" },
  "init": { "$template": true, "$structure": "\${args.init}", "$default":false, "$type": "boolean" }
}');

insert into report.template( type, name, configs ) values ( 'agg', 'sumMoney', '{
  "name": { "$template": true, "$structure": "Soma de \${name}", "$default": "Somatorio", "$type": "text" },
  "func": "sum",
  "format":"money",
  "rename": { "$template":true, "$default": "SOMA", "$structure": "SUM \${name}" },
  "init": { "$template": true, "$structure": "\${args.init}", "$default":false, "$type": "boolean" }
}');

insert into report.template( type, name, configs ) values ( 'agg', 'sumMoney2', '{
  "name": { "$template": true, "$structure": "\${args.name}", "$default": "Somatorio", "$type": "text" },
  "func": "sum",
  "format":"money",
  "rename": { "$template":true, "$default": "SOMA", "$structure": "\${args.name}" },
  "init": { "$template": true, "$structure": "\${args.init}", "$default":false, "$type": "boolean" }
}');


insert into report.template( type, name, configs ) values ( 'agg', 'count', '{
  "name": { "$template": true, "$structure": "Contagem de \${name}", "$type": "text" },
  "func": "count",
  "format": "init",
  "rename": { "$template":true, "$default": "TOTAL", "$structure": "TOTAL \${name}" },
  "init":  { "$template": true, "$structure": "\${args.init}", "$default":false, "$type": "boolean" }
}');

insert into report.template( type, name, configs ) values ( 'agg', 'count2', '{
  "name": { "$template": true, "$structure": "\${args.name}", "$type": "text" },
  "func": "count",
  "format": "init",
  "rename": { "$template":true, "$default": "TOTAL", "$structure": "\${args.rename}" },
  "init":  { "$template": true, "$structure": "\${args.init}", "$default":false, "$type": "boolean" }
}');
`;
