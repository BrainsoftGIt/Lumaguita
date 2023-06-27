create or replace function tweeks.funct_reg_entrada( args jsonb) returns lib.result
  language plpgsql
as
$$
declare
  /**
    Essa funcao serve para registar as entradas de produto
    args = {
      arg_colaborador_id: *ID,
      arg_espaco_destino: *ID,
      arg_espaco_auth: *ID,



      arg_entradas: [
        artigo_id: *ID,
        entrada_quantidade: *QT,
        entrada_lote: LOTE,
        entrada_validade: LOTE,
        entrada_descricao: DESCRICAO
        entrada_custounitario: PRECO
        entrada_metadata: { ... any extras data }
      ]

      //Relativos a GUIA
      guia_refuid: FORNECEDOR-ID
      guia_documentoperacao: CODIGO,
      guia_dataopeacao: DATA,
      guia_observacao: DESCRICAO
      guia_metadata: { ... any extras data }

      custos:[{
        custoguia_montante: MONTANTE,
        custoguia_descricao: DESCRICAO PARA O CUSTO
        custoguia_tcusto_id: 1 - DESPESA | 2 - RECEITA
      }]
    }
   */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_destino uuid not null default args->>'arg_espaco_destino';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_entrada_codigofatura character varying default args->>'arg_entrada_codigofatura';

  arg_entrada_next int ;

  _entreda tweeks.entrada;
  _new tweeks.entrada;
  __entreda tweeks.entrada[] default array[]::tweeks.entrada[];
  _espaco tweeks.espaco;
  _entrada_group uuid;
  _const map.constant;
  _data record;
  _guia tweeks.guia;
  _branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin

  _const := map.constant();

  _espaco := tweeks._get_espaco( arg_espaco_destino );

  if arg_entrada_codigofatura is null then
    arg_entrada_codigofatura := lib.str_nospace( to_char( arg_entrada_next, '"EN#"000-000' ) );
  end if;

  _entrada_group := public.uuid_generate_v4();

  _guia := jsonb_populate_record( _guia, args );
  _guia.guia_tguia_id := _const.maguita_tguia_entrada;
  _guia.guia_espaco_entrada := arg_espaco_destino;
  _guia.guia_toperacao_id := _const.maguita_toperacao_entrada;
  _guia.guia_refclass := cluster.__format( 'tweeks.fornecedor'::regclass );
  _guia.guia_refs := jsonb_build_object(
      'fornecedor', jsonb_build_object( 'fornecedor_id', _guia.guia_refuid ),
      'destino', jsonb_build_object( 'espaco_id', arg_espaco_destino )
  );

  _guia := tweeks.funct_sets_guia( jsonb_build_object(
    'guia', _guia,
    'custoguia', args->'custos',
    'arg_colaborador_id', arg_colaborador_id,
    'arg_espaco_auth', arg_espaco_auth

  ));

  for _data in
    select
        ( e.doc->>'artigo_id' )::uuid as artigo_id,
        ( e.doc->>'entrada_descricao' ) as entrada_descricao,
        ( e.doc->>'entrada_quantidade' )::double precision as entrada_quantidade,
        ( e.doc->>'entrada_custounitario' )::double precision entrada_custounitario,
        ( e.doc->>'entrada_metadata' )::json entrada_metadata,
        ( e.doc->>'entrada_lote' )::character varying as  entrada_lote,
        ( e.doc->>'entrada_validade' )::date as  entrada_validade
      from jsonb_array_elements( args->'arg_entradas' ) e( doc )
  loop
    _new.entrada_descricao :=       _data.entrada_descricao;
    _new.entrada_artigo_id :=       _data.artigo_id;
    _new.entrada_custounitario :=        _data.entrada_custounitario;
    _new.entrada_quantidade :=      _data.entrada_quantidade;
    _new.entrada_lote :=          _data.entrada_lote;
    _new.entrada_validade :=      _data.entrada_validade;
    _new.entrada_metadata :=      _data.entrada_metadata;

    _new.entrada_espaco_destino :=  arg_espaco_destino;
    _new.entrada_espaco_auth :=     arg_espaco_auth;
    _new.entrada_colaborador_id :=  arg_colaborador_id;
    _new.entrada_guia_id :=         _guia.guia_uid;

    select ( "returning" ).* into _entreda
      from lib.sets_in( _new )
    ;
  end loop;

  return true? jsonb_build_object(
    'guia', _guia,
    'entrada', array(
      select ent
        from tweeks.entrada ent
        where ent.entrada_guia_id = _guia.guia_uid
          and ent.entrada_estado = _const.entrada_estado_ativo
    ),'custoguia', array(
      select cg
        from tweeks.custoguia cg
        where cg.custoguia_guia_uid = _guia.guia_uid
          and cg.custoguia_estado = _const.maguita_custoguia_estado_ativo
    )
  );
end;
$$;


