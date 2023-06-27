import {block} from "../../../core/updater";

//language=PostgreSQL
block( module, { identifier: "funct_reg_precario", flags:[]}).sql`
create or replace function tweeks.funct_reg_precario(args jsonb) returns lib.result
  language plpgsql
as
$$
declare
  /**
    Essa função serve para registrar e atualizar os preços dos itens
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_forced: boolean,
      arg_precario_referencia: {
        artigo_id: ID,
      },
      arg_links :[
        {  espaco_id: *ID,
           stock_minimo: QUNT
           precario_custo: CUSTO,
           precario_quantidade: QUANT_CUSTO }
      ]
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';

  arg_precario_referencia jsonb not null default args->>'arg_precario_referencia';
  arg_forced boolean default args->>'arg_forced';
  arg_artigo_id uuid;

  arg_espacos_destino uuid[] default array ( select ( e.doc->>'espaco_id' )::uuid from jsonb_array_elements( args->'arg_links') e( doc ) );
  arg_espaco_child uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );

  _const map.constant;
  _artigo tweeks.artigo;
  _branch uuid := tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );

begin
  _const := map.constant();
  arg_forced := coalesce( arg_forced, false );

  arg_artigo_id := arg_precario_referencia->>'artigo_id';


  if not arg_forced and arg_artigo_id is not null then
    _artigo := tweeks._get_artigo( arg_artigo_id );

    -- Alterar o preço apenas quando o artigo não estiver em nenhuma conta aberta
    if (
         select count( * ) > 0
         from tweeks.venda ag
         where ag.venda_artigo_id = arg_artigo_id
           and ag.venda_estado in ( _const.maguita_venda_estado_aberto )
          and ag._branch_uid = _branch
       ) then
      return false ? '@tweeks.artigo.price-can-not-update-open-account';
    end if;
  end if;

  -- Desativar o precario atual
  update tweeks.link
    set link_estado = _const.maguita_link_estado_fechado,
        link_dataatualizacao = now(),
        link_colaborador_atualizacao = arg_colaborador_id
    where link_referencia @> arg_precario_referencia
      and link_estado = _const.maguita_link_estado_ativo
      and link_espaco_destino = any( arg_espaco_child )
      and _branch_uid = _branch
      and link_tlink_id = _const.maguita_tlink_preco   
  ;

   -- Criar os novos precarios
   insert into tweeks.link(
      link_tlink_id,
      link_espaco_destino,
      link_espaco_auth,
      link_colaborador_id,
      link_referencia,
      link_posicao,
      link_nome,
      link_metadata
    ) select
      (map.constant()).maguita_tlink_preco,
      ( lp.doc->>'espaco_id' )::uuid,
      arg_espaco_auth,
      arg_colaborador_id,
      arg_precario_referencia,
      0,
      format( 'Preço de %s para %s', _artigo.artigo_nome, e.espaco_nome ),
      jsonb_build_object(
          'precario_custo', ( lp.doc->>'precario_custo' )::double precision,
          'stock_minimo', ( lp.doc->>'stock_minimo' )::double precision,
          'precario_quantidade', (lp.doc->>'precario_quantidade')::double precision
      )
      from jsonb_array_elements( args->'arg_links' ) lp( doc )
        inner join tweeks.espaco e on (lp.doc->>'espaco_id')::uuid = e.espaco_id
    ;
  
  return true? jsonb_build_object(
    'precario', array(
        select to_jsonb( l )
          from tweeks.link l
          where l.link_espaco_destino = any( arg_espacos_destino )
            and (l.link_referencia ->>'artigo_id')::uuid = arg_precario_referencia
            and l.link_estado = _const.maguita_link_estado_ativo
            and l.link_tlink_id = _const.maguita_tlink_preco
            and l._branch_uid = _branch
    )
  );
end;
$$;

`;