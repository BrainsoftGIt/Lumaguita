import {sql} from "kitres";

export const cluster_next_lock = sql`
create or replace function cluster.next(name character varying, sub character varying DEFAULT NULL::character varying, zero_base boolean DEFAULT false, steep integer DEFAULT 1, lpad integer DEFAULT 0, lpad_char character DEFAULT ''::bpchar, exist text DEFAULT NULL::text, exist_limit integer DEFAULT 1000) returns character varying
  language plpgsql
as
$$
declare
  _sequence cluster.sequence;
  _cluster cluster.cluster;
  _repeat boolean default true;
  _next_value character varying;
  _record record;
  _iterate int default 0;
begin
  lock table cluster.sequence;
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
`;