drop function if exists cluster.__generate_code();

create or replace function cluster.__generate_cluster_code()
returns character varying
language plpgsql as $$
declare
  chars character varying default '0123456789';
  code character varying;
  repeate integer default 0;
  codeLen integer default 3;
begin
  while code is null loop
    code := lib.dset_random_text( chars, codeLen );
    if exists(
        select *
          from cluster.cluster
          where  code in ( cluster.cluster_code, lpad('', codeLen, '0' ) )
    ) then
      code := null;
      if repeate  = 9999 then
        chars := '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      elseif repeate = 99999 then
        chars := '012345678901234567890123456789012345678901234567890123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      elseif repeate = 999999 then
        chars := '012345678901234567890123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      elseif repeate = 9999999 then
        chars := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      elseif repeate = 99999999 then
        raise exception 'O sistema não consegue determinar um codigo para o cluster';
      end if;
    end if;
    repeate := repeate +1;
  end loop;

  return code;
end;
$$;

drop function if exists cluster.next(name varchar, sub varchar, zero_base boolean, steep integer, lpad integer, lpad_char char);
drop function if exists cluster.next(name character varying, sub character varying, zero_base boolean, steep int, lpad int, lpad_char character, exist text, exist_limit int);
drop function if exists cluster.next( name character varying, zero_base boolean, steep int, lpad int, lpad_char character);
drop function if exists cluster.next( name character varying, zero_base boolean, steep int, lpad int, lpad_char character, exist text, exist_limit int );
drop function if exists cluster.next(name varchar, sub varchar, zero_base boolean, steep integer, lpad integer, lpad_char char, exist text, exists_limit integer);

create or replace function cluster.next(
  name character varying, sub character varying default null,
  zero_base boolean default false, steep int default 1,
  lpad int default 0, lpad_char character default '',
  exist text default null,
  exist_limit int default 1000
)
returns character varying
language plpgsql as $$
declare
  _sequence cluster.sequence;
  _cluster cluster.cluster;
  _repeat boolean default true;
  _next_value character varying;
  _record record;
  _iterate int default 0;
begin

  if sub is null then sub := ''; end if;
  if next.name is null then
    raise exception 'Sequence name is required!';
  end if;

  if next.steep = 0 then
    raise exception 'Sequence steep can not by zero!';
  end if;

  if exist is not null then
    exist_limit := coalesce( exist_limit, 1000 );
  end if;

  _cluster := cluster._get_cluster_local();

  while _repeat loop

    update cluster.sequence
      set sequence = sequence.sequence + sequence.steep
      where sequence.name = next.name
        and  next.sub = sequence.sub
      returning * into _sequence
    ;

    if _sequence.name is null then
      next.zero_base := coalesce( next.zero_base, false );
      next.steep := coalesce( next.steep, 1 );

      insert into cluster.sequence ( name, steep, zerobase, lpad, lpad_char, sub, sequence )
        values ( next.name, next.steep , next.zero_base, next.lpad, next.lpad_char, next.sub,
          case
            when next.zero_base then next.steep
            else next.steep
          end
        )
      returning * into _sequence;
    end if;

    if _sequence.zerobase then
      _sequence.sequence := _sequence.sequence + case
        when _sequence.steep > 0 then -1
        else 1
      end;
    end if;

    _next_value :=  format( '%s%s', _cluster.cluster_code, lpad( _sequence.sequence::text, greatest( _sequence.lpad, length( _sequence.sequence::text ) ), _sequence.lpad_char ) );
    _repeat := false;

    if exist is not null then
      <<find_duplicate>>
      for _record in execute exist using _next_value loop
        _repeat := true;
        exit find_duplicate;
      end loop;
    end if;

    _iterate := _iterate +1;
    if _iterate = exist_limit then
      raise exception 'Next code generation limit';
    end if;
  end loop;

  return _next_value;
end
$$;
