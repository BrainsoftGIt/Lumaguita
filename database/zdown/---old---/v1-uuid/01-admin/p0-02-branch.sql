create or replace function tweeks.__space_branch_level( _espaco_id  uuid )
  returns int
  immutable
  language sql as $$
  with recursive __espaco as (
    select
        e.espaco_id,
        e.espaco_espaco_id,
        0 as _espaco_nivel
      from tweeks.espaco e
      where e.espaco_espaco_id is null
    union all
      select
          e2.espaco_id,
          e2.espaco_espaco_id,
          e3._espaco_nivel +1
        from tweeks.espaco e2
        inner join __espaco e3  on e2.espaco_espaco_id = e3.espaco_id
  ) select e._espaco_nivel
    from __espaco e
    where e.espaco_id = $1
$$;

create or replace function tweeks.__space_branch_main(  uuid )
returns uuid
immutable
returns null on null input
language sql as $$
select coalesce( tweeks.__space_branch( $1, 1), $1 )
$$;


alter table tweeks.espaco drop espaco_nivel;
alter table tweeks.espaco add espaco_nivel int not null
  generated always as ( coalesce( tweeks.__space_branch_level( espaco_espaco_id ), -1 ) +1 ) stored;



select e.espaco_nome, e.espaco_id, __space_branch( e.espaco_id, 1), e.espaco_nivel
  from tweeks.espaco e;

create or replace function tweeks.__space_branch( _espaco_id  uuid , level int )
  returns uuid
  immutable
  language sql as $$
  with recursive __espaco as (
    select
        e.espaco_id,
        e.espaco_espaco_id,
        e.espaco_nivel,
        array[ e.espaco_id ] as _family
      from tweeks.espaco e
      where e.espaco_espaco_id is null
    union all
      select
          e2.espaco_id,
          e2.espaco_espaco_id,
          e2.espaco_nivel,
          e3._family||e2.espaco_id
        from tweeks.espaco e2
        inner join __espaco e3  on e2.espaco_espaco_id = e3.espaco_id
  ) select ep.espaco_id
    from __espaco e
      left join __espaco ep on ep.espaco_id = any( e._family )
        and ep.espaco_nivel = $2
    where e.espaco_id = $1
$$;

alter function tweeks.__space_branch(_espaco_id uuid, level int) immutable;
alter function tweeks.__space_branch_level(_espaco_id uuid ) immutable;

alter table tweeks.espaco drop espaco_branch;
alter table tweeks.espaco add espaco_branch uuid not null generated always as ( coalesce( tweeks._space_branch( espaco_espaco_id, 1), espaco_id)  ) stored;

update tweeks.espaco
  set espaco_branch = default
  where true;
