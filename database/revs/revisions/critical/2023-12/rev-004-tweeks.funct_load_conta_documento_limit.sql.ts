import {sql} from "kitres";

export const Rev004TweeksFunct_load_conta_documento_limitSql = sql`
create or replace function tweeks.funct_load_conta_documento_limit( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  _limit int8 default args->>'limit';
  _offset int8 default args->>'offset';
begin
  return query 
    select e.document || jsonb_build_object(
        '_rowcounts', count( e.document ) over ()
      )
      from tweeks.funct_load_conta_documento( args ) e( document )
      limit _limit
      offset _offset
  ;
end;
$$;
`;