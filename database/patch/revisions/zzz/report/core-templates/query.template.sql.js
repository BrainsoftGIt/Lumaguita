"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("../../../../core/updater");
(0, updater_1.block)(module, { identifier: "report:template|query" }).sql `
delete from report.template where type = 'query';

insert into report.template( type, name, configs ) values ('query', 'date|start', '{
  "opr": ">=",
  "format": "date",
  "name": { "$template": true, "$type": "text", "$structure": "\${name} INICIO", "$default": "DATA INICIO"}
}');

insert into report.template( type, name, configs ) values ('query', 'date|end', '{
  "opr": "<=",
  "format": "date",
  "name": { "$template": true, "$type": "text", "$structure": "\${name} FIM", "$default": "DATA FIM"}
}');


insert into report.template( type, name, configs ) values ('query', 'range|start', '{
  "opr": ">=",
  "format": { "$template": true, "$type": "text", "$structure": "\${format}", "$default": "DE"},
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default": "DE"}
}');

insert into report.template( type, name, configs ) values ('query', 'range|end', '{
  "opr": "<=",
  "format": { "$template": true, "$type": "text", "$structure": "\${format}", "$default": "ATÉ"},
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default": "ATÉ"}
}');

insert into report.template( type, name, configs ) values ('query', 'equalsSimple', '{
  "opr": { "$template": true, "$type": "text", "default": "=", "$structure": "\${args.opr}"},
  "format": "simple",
  "name": { "$template": true, "$type": "text", "$structure": "Filtrar por \${args.name}"}
}');

insert into report.template( type, name, configs ) values ('query', 'like', '{
  "opr": "like",
  "format": "simple",
  "mode": { "$template": true, "$type": "text", "$structure": "\${args.mode}", "$default":"right" },
  "name": { "$template": true, "$type": "text", "$structure": "Filtrar por \${args.name}"}
}');


insert into report.template( type, name, configs ) values ('query', 'source|tweeks.posto', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"POSTO" },
  "format": "select",
  "source": "tweeks.posto"
}');

insert into report.template( type, name, configs ) values ('query', 'boolean|Y/N', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"OPÇÃO (SIN/NÃO)" },
  "format": "select",
  "source": "boolean|Y/N"
}');

insert into report.template( type, name, configs ) values ('query', 'boolean|ON/OFF', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"OPÇÃO (ATIVO/DESATIVO)" },
  "format": "select",
  "source": "boolean|ON/OFF"
}');

insert into report.template( type, name, configs ) values ('query', 'STATUS', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"ESTADOS" },
  "format": "select",
  "source": "STATUS"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.tgroup', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"ESTADOS" },
  "format": "select",
  "source": "tweeks.tgroup"
}');


insert into report.template( type, name, configs ) values ('query', 'source|tweeks.classe', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"CATEGORIA" },
  "format": "select",
  "source": "tweeks.classe"
}');

insert into report.template( type, name, configs ) values ('query', 'source|auth.colaborador', '{
  "opr": "=",
  "src": "db",
  "format":"select",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"COLABORADOR" },
  "source": "auth.colaborador"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.espaco', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"ARMAZEM" },
  "format": "select",
  "source": "tweeks.espaco"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.artigo', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"ARTIGO" },
  "format": "select",
  "source": "tweeks.artigo"
}');

insert into report.template( type, name, configs ) values ('query', 'source|geoinfo.currency', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"MOEDA" },
  "format": "select",
  "source": "geoinfo.currency"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.toperacao', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"OPERAÇÃO" },
  "format": "select",
  "source": "tweeks.toperacao"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.tpaga', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"MODALIDADE DE PAGAMENTO" },
  "format": "select",
  "source": "tweeks.tpaga"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.cliente', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"CLIENTE" },
  "format": "select",
  "source": "tweeks.cliente"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.fornecedor', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"FORNECEDOR" },
  "format": "select",
  "source": "tweeks.fornecedor"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.tipoimposto', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"TIPO IMPOSTO" },
  "format": "select",
  "source": "tweeks.tipoimposto"
}');


insert into report.template( type, name, configs ) values ('query', 'source|tweeks.serie', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"SERIE DE FATURA" },
  "format": "select",
  "source": "tweeks.serie"
}');


insert into report.template( type, name, configs ) values ('query', 'source|tweeks.tserie', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"TIPO DE SERIE" },
  "format": "select",
  "source": "tweeks.tserie"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.caixa::estado', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"ESTADO DE CAIXA" },
  "format": "select",
  "source": "tweeks.caixa::estado"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.tlancamento', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"TIPO DE LANÇAMENTO" },
  "format": "select",
  "source": "tweeks.tlancamento"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.lancamento::mode', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"MODO LANÇAMENTO" },
  "format": "select",
  "source": "tweeks.lancamento::mode"
}');

insert into report.template( type, name, configs ) values ('query', 'source|tweeks.tmovimento', '{
  "opr": "=",
  "src": "db",
  "name": { "$template": true, "$type": "text", "$structure": "\${args.name}", "$default":"TIPO DE MOVIMENTO" },
  "format": "select",
  "source": "tweeks.tmovimento"
}');
    
`;
//# sourceMappingURL=query.template.sql.js.map