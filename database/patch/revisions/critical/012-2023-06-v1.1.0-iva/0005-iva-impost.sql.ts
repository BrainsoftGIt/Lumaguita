import {block} from "../../../core/updater";

block( module, {  identifier: "iva-imposto", flags:[ "@unique"]}).sql`
create table if not exists tweeks.codigoimposto(
  codigoimposto_codigo character varying,
  codigoimposto_descricao character varying,
  constraint pk_codigoimposto_codigo primary key ( codigoimposto_codigo )
);

alter table tweeks.artigo add if not exists artigo_codigoimposto character varying default null;
alter table tweeks.venda add if not exists venda_codigoimposto character varying default null;
alter table tweeks.posto add if not exists  posto_vermontatefaturado boolean not null default false;

truncate tweeks.codigoimposto;
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '111', 'Facturas de transmissões de bens e prestações de serviços com IVA liquidado à taxa normal de 15%' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '112', 'Facturas de transmissões de bens e prestações de serviços com IVA liquidado à taxa reduzida de 7,5%' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '201', 'Facturas isentas do IVA nos termos da al. a) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '202', 'Facturas isentas do IVA nos termos da al. b) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '203', 'Facturas isentas do IVA nos termos da al. c) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '204', 'acturas isentas do IVA nos termos da al. d) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '205', 'Facturas isentas do IVA nos termos da al. e) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '206', 'Facturas isentas do IVA nos termos da al. a) do nº 3 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '207', 'Facturas isentas do IVA nos termos da al. b) do nº 3 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '208', 'Facturas isentas do IVA nos termos da al. a) do nº 4 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '209', 'Facturas isentas do IVA nos termos da al. b) do nº 4 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '210', 'Facturas isentas do IVA nos termos da al. a) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '211', 'Facturas isentas do IVA nos termos da al. b) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '212', 'Facturas isentas do IVA nos termos da al. c) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '213', 'Facturas isentas do IVA nos termos da al. d) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '214', 'Facturas isentas do IVA nos termos da al. e) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '215', 'Facturas isentas do IVA nos termos da al. f) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '216', 'Facturas isentas do IVA nos termos da al. g) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '311', 'Nota de crédito relativa às facturas de transmissões de bens e prestações de serviços com IVA liquidado à taxa normal de 15%' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '312', 'Nota de crédito relativa às facturas de transmissões de bens e prestações de serviços com IVA liquidado à taxa normal de 7,5%' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '401', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. a) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '402', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. b) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '403', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. c) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '404', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. d) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '405', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. e) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '406', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. a) do nº 3 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '407', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. b) do nº 3 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '408', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. a) do nº 4 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '409', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. b) do nº 4 do art. do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '410', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. a) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '411', 'ota de crédito relativa às facturas isentas do IVA nos termos da al. b) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '412', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. c) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '413', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. d) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '414', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. e) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '415', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. f) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '416', 'Nota de crédito relativa às facturas isentas do IVA nos termos da al. g) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '551', 'Facturas de aquisição de serviços autoliquidados à taxa de 15%' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '611', 'Facturas de aquisição de bens e prestações de serviços com IVA liquidado à taxa normal de 15%' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '612', 'Facturas de aquisição de bens e serviços com IVA liquidado à taxa reduzida de 7,5%' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '701', 'Facturas de aquisição isentas do IVA nos termos da al. a) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '702', 'Facturas de aquisição isentas do IVA nos termos da al. b) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '703', 'Facturas de operações isentas do IVA nos termos da al. c) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '704', 'Facturas de aquisição isentas do IVA nos termos da al. d) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '705', 'acturas de aquisição isentas do IVA nos termos da al. e) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '706', 'Facturas de aquisição isentas do IVA nos termos da al. a) do nº 3 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '707', 'Facturas de aquisição isentas do IVA nos termos da al. b) do nº 3 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '708', 'Facturas de aquisição isentas do IVA nos termos da al. a) do nº 4 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '709', 'Facturas de aquisição isentas do IVA nos termos da al. b) do nº 4 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '710', 'Facturas de aquisição isentas do IVA nos termos da al. a) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '711', 'Facturas de aquisição isentas do IVA nos termos da al. b) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '712', 'Facturas de aquisição isentas do IVA nos termos da al. c) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '713', 'Facturas de aquisição isentas do IVA nos termos da al. d) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '714', 'Facturas de aquisição isentas do IVA nos termos da al. e) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '715', 'Facturas de aquisição isentas do IVA nos termos da al. f) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '716', 'Facturas isentas do IVA nos termos da al. g) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '811', 'Nota de débito relativa às facturas de aquisição de bens e serviços com IVA liquidado à taxa normal de 15%' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '812', 'Nota de débito relativa às facturas de aquisição de bens e serviços com IVA liquidado à taxa normal de 7,5%' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '901', 'Nota de débito relativa às facturas isentas do IVA nos termos da al. a) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '902', 'Nota de débito relativa às facturas isentas do IVA nos termos da al. b) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '903', 'Nota de débito relativa às facturas isentas do IVA nos termos da al. c) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '904', 'Nota de débito relativa às facturas de aquisição isentas do IVA nos termos da al. d) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '905', 'Nota de débito relativa às facturas de aquisição isentas do IVA nos termos da al. e) do nº 1 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '906', 'Nota de débito relativa às facturas de aquisição isentas do IVA nos termos da al. a) do nº 3 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '907', 'Nota de débito relativa às facturas de aquisição isentas do IVA nos termos da al. b) do nº 3 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '908', 'Nota de débito relativa às facturas de aquisição isentas do IVA nos termos da al. a) do nº 4 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '909', 'Nota de débito relativa às facturas de aquisição isentas do IVA nos termos da al. b) do nº 4 do art. 17º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '910', 'ta de débito relativa às facturas de aquisição isentas do IVA nos termos da al. a) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '911', 'Nota de débito relativa às facturas de aquisição isentas do IVA nos termos da al. b) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '912', 'Nota de débito relativa às facturas de aquisição isentas do IVA nos termos da al. c) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '913', 'Nota de débito relativa às facturas de aquisição isentas do IVA nos termos da al. d) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '914', 'Nota de débito relativa às facturas de aquisição isentas do IVA nos termos da al. e) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '915', 'Nota de débito relativa às facturas de aquisição isentas do IVA nos termos da al. f) do nº1 do art. 20º do CIVA' );
INSERT INTO tweeks.codigoimposto ( codigoimposto_codigo, codigoimposto_descricao ) VALUES ( '916', 'Nota de débito relativa às facturas isentas do IVA nos termos da al. g) do nº1 do art. 20º do CIVA' );

`;
