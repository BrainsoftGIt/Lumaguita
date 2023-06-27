create table tweeks._save_table_link as select * from tweeks.link;


drop function _get_link(uuid);
drop table tweeks.link;

-- auto-generated definition
create table link (
  link_id                      uuid                     default uuid_generate_v4()                                     not null,
  link_link_id                 uuid,
  link_link_associacao         uuid,
  link_tlink_id                smallint                                                                                not null
    constraint fk_link_to_tlink
      references tlink,
  link_espaco_destino          uuid                                                                                    not null
    constraint fk_link_to_espaco_destino
      references espaco,
  link_espaco_auth             uuid                                                                                    not null
    constraint fk_link_to_espaco_auth
      references espaco,
  link_colaborador_id          uuid                                                                                    not null
    constraint fk_link_to_colaborador
      references auth.colaborador,
  link_colaborador_atualizacao uuid
    constraint fk_link_to_colaborador_atualizacao
      references auth.colaborador,
  link_referencia              jsonb,
  link_posicao                 smallint,
  link_nome                    varchar                                                                                 not null,
  link_metadata                jsonb,
  link_config                  jsonb,
  link_estado                  smallint                 default (map.get('maguita_link_estado_ativo'::name))::smallint not null,
  link_dataregistro            timestamp with time zone default CURRENT_TIMESTAMP                                      not null,
  link_dataatualizacao         timestamp with time zone,
  constraint pk_link_id primary key (link_id )
);

comment on table link is 'Essa entidade serve para registar o item que deve ocupar uma tecla';
comment on column link.link_id is 'Identificador único do link';
comment on column link.link_link_id is 'Identificador da link parent';
comment on column link.link_espaco_destino is 'Identificador do espaço o qual a link pertence';
comment on column link.link_colaborador_id is 'Identificador do colaborador responsavél pelo registro do link';
comment on column link.link_colaborador_atualizacao is 'Identificador do colaborador responsável pela atualização da link';
comment on column link.link_referencia is 'Corresponde a referencia a que o link se aponta (artigo, link, classe ...)';
comment on column link.link_posicao is 'Corresponde a posição em que a link deve ocupar';
comment on column link.link_nome is 'Corresponde ao nome da link';
comment on column link.link_config is 'Corresponde a cofifuração da link';
comment on column link.link_estado is 'Corresponde ao estado da link
<ul>
  <li> 2 - Ligação </ul>
  <li> 1 - Ativo </ul>
  <li> 0 - Fechado </ul>
</ul>
';
comment on column link.link_dataregistro is 'Corresponde ao instante em que a link foi registrada';
comment on column link.link_dataatualizacao is 'Corresponde ao instante em que a link foi atualizado pela última vez';


create function tweeks._get_link(arg_link_id uuid) returns link
  language sql
as
$$
  -- Essa função serve para devolver a instancia de uma link
select * from tweeks.link where link_id = arg_link_id;
$$;

insert into tweeks.link select * from _save_table_link;
drop table tweeks._save_table_link;
