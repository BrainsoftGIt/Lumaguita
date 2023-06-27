import {block} from "../../../core/updater";

block( module, { identifier: "regularizacao-core", flags: [ "@unique" ] } ).sql`


drop materialized view if exists tweeks.vregularizacao;
create materialized view tweeks.vregularizacao as
        with data as (
          select
                l.lancamento_id as id,
                l.lancamento_credito as credito,
                l.lancamento_debito as debito,
                l.lancamento_montante as montante,
                l.lancamento_valor as value,
                row_number() over ( order by l.lancamento_dataregistro, l.lancamento_sequencia) as sequencia,
                l.lancamento_dataregistro as time,
                l.lancamento_operacao as operacao,
                l._branch_uid as branch,
                l.lancamento_cliente_id as client,
                l._tgrupo_id as tconta,
                l.lancamento_documento as documento
          from tweeks.lancamento l
            where  l.lancamento_estado = (map.constant()).maguita_lancamento_estado_ativo
              and ( tweeks.viewarg('branch')::uuid is null or l._branch_uid = tweeks.viewarg('branch')::uuid )
              and ( tweeks.viewarg('client')::uuid is null or l.lancamento_cliente_id = tweeks.viewarg('client')::uuid )
              and ( tweeks.viewarg('tconta')::int is null or l._tgrupo_id = tweeks.viewarg('tconta')::int )
          order by l.lancamento_dataregistro,
                   l.lancamento_sequencia
        ), __regularizacao as (

          select
                l.credito,
                l.debito,
                l.montante,
                sum(l.credito )  over ( partition by l.branch, l.tconta, l.client order by l.sequencia  rows between unbounded preceding and current row ) as running_credito,
                sum(l.debito  ) over ( partition by l.branch, l.tconta, l.client order by  l.sequencia  rows between unbounded preceding and current row ) as running_debito,
                l.id,
                l.operacao,
                l.sequencia,
                l.time,
                l.branch,
                l.client,
                l.documento,
                l.value,
                l.tconta
            from data l
          order by l.time, l.sequencia

        ) select re.*,
            re.running_credito - re.running_debito as running_saldo,
            ( re.running_credito - re.running_debito ) + ( re.montante * -1 )as before_saldo,
            case
              when re.operacao = 1 then ( re.running_credito ) - ( re.credito )
              else re.running_credito
            end as before_credito,
            case
              when re.operacao = -1 then ( re.running_debito ) - ( re.debito )
              else re.running_debito
            end as before_debito,
            case re.operacao
              when 1 then re.running_credito
              else re.running_debito
            end running_operacao,
            case re.operacao
              when 1 then re.running_debito
              else re.running_credito
            end running_reverse
        from __regularizacao re;

create index idx_vregularizacao_operacao on tweeks.vregularizacao (  operacao );
create unique index idx_vregularizacao_sequencia on tweeks.vregularizacao (  sequencia );
create index idx_vregularizacao on tweeks.vregularizacao ( running_credito, running_debito, credito, debito, operacao );
create unique index idx_vregularizacao_identifier on tweeks.vregularizacao ( id );


drop function if exists tweeks.__regulariza( variadic lancamentos uuid[] ) cascade ;
create or replace function tweeks.__regulariza( variadic lancamentos uuid[] )
returns table(
  lancamento uuid,
  credito double precision,
  debito double precision,
  running_credito double precision,
  running_debito double precision,
  running_saldo double precision,
  before_saldo double precision,
  before_credito double precision,
  before_debito double precision,
  affects uuid[],
  affects_values numeric[],
  affects_apply numeric[],
  affects_document jsonb,
  "time" timestamptz,
  client uuid,
  branch uuid,
  operacao int,
  tconta int
) language plpgsql as $$
declare
  _record record;
  _value double precision;
begin
  for _record in
    select
        ac.*,
        jsonb_agg( jsonb_build_object( 'doc', affect.documento )) filter ( where affect.running_credito > ac.running_debito - ac.debito and affect.running_credito - affect.credito < ac.running_debito ) as affects_document,
        array_agg( affect.id ) filter ( where affect.running_credito > ac.running_debito - ac.debito and affect.running_credito - affect.credito < ac.running_debito ) as affects,
        array_agg( affect.credito::numeric ) filter ( where affect.running_credito > ac.running_debito - ac.debito and affect.running_credito - affect.credito < ac.running_debito ) as affects_credito,
        array_agg( affect.debito::numeric ) filter ( where  ac.running_credito > affect.running_debito - affect.debito and ac.running_credito - ac.credito < affect.running_debito ) as affects_debitos,
        array_agg(
           (affect.running_credito - ac.before_debito) - (
            case
              when affect.running_credito - ac.running_debito >= 0 then affect.running_credito - ac.running_debito
              else 0
            end
          ) - (
            case
              when affect.before_credito - ac.before_debito > 0 then affect.before_credito - ac.before_debito
              else 0
            end
          )
        ) filter ( where affect.running_credito > ac.running_debito - ac.debito and affect.running_credito - affect.credito < ac.running_debito ) as affects_apply
    from tweeks.vregularizacao ac
        inner join tweeks.vregularizacao affect on affect.operacao != ac.operacao and (
          ( affect.running_credito > ac.running_debito - ac.debito and affect.running_credito - affect.credito < ac.running_debito )
          or ( ac.running_credito > affect.running_debito - affect.debito and ac.running_credito - ac.credito < affect.running_debito )
        )
      where ac.id = any ( lancamentos )
      group by
        ac.id,
        ac.credito,
        ac.debito,
        ac.operacao,
        ac.client,
        ac.branch,
        ac.tconta,
        ac.value,
        ac.time,
        ac.running_credito,
        ac.running_debito,
        ac.running_operacao,
        ac.running_reverse,
        ac.running_saldo,
        ac.before_saldo,
        ac.before_credito,
        ac.before_debito,
        ac.documento,
        ac.montante,
        ac.sequencia
      order by ac.sequencia
  loop
    __regulariza.lancamento := _record.id;
    __regulariza.credito := _record.credito;
    __regulariza.debito := _record.debito;
    __regulariza.running_credito := _record.running_credito;
    __regulariza.running_debito := _record.running_debito;
    __regulariza.running_saldo := _record.running_saldo;
    __regulariza.before_saldo := _record.before_saldo;
    __regulariza.before_debito := _record.before_debito;
    __regulariza.before_credito := _record.before_credito;
    __regulariza.affects := _record.affects;
    __regulariza.affects_document := _record.affects_document;
    __regulariza.time := _record.time;

    -- Quando for credito
    if _record.operacao = 1  then
      __regulariza.affects_values := _record.affects_debitos;

    -- Quando for debito
    elseif _record.operacao = -1 then
      __regulariza.affects_values := _record.affects_credito;
    end if;

    __regulariza.affects_apply := _record.affects_apply;

    __regulariza.client := _record.client;
    __regulariza.branch := _record.branch;
    __regulariza.operacao := _record.operacao;
    __regulariza.tconta := _record.tconta;
    return next;
  end loop;
end;
$$;

refresh materialized view concurrently tweeks.vregularizacao;
vacuum full verbose ;

`;
