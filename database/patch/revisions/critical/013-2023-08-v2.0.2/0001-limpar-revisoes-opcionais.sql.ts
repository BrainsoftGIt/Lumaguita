import {block} from "../../../core/updater";


block( module, { identifier:`correcao-agosto-${new Date().toISOString()}`, flags:[ "@force" ] }).sql`
    with __keep_schare as (
        select n.share_regclass
        from unnest(array[
            'auth.colaborador',
            'auth.perfil',
            'tweeks.espaco',
            'auth.acesso',
            'auth.privilegio',
            'tweeks.trabalha',
            'cluster.branch',
            'tweeks.branch',
            'tweeks.classe',
            'cluster.resource',
            'tweeks.cambio'
            ]::text[] ) n( share_regclass )
    )
    delete from cluster.object o
    where o.object_share_regclass not in (
        select share_regclass
        from __keep_schare
    );


    with __keep_schare as (
        select n.share_regclass
        from unnest(array[
            'auth.colaborador',
            'auth.perfil',
            'tweeks.espaco',
            'auth.acesso',
            'auth.privilegio',
            'tweeks.trabalha',
            'cluster.branch',
            'tweeks.branch',
            'tweeks.classe',
            'cluster.resource',
            'tweeks.cambio'
            ]::text[] ) n( share_regclass )
    ) delete from cluster.collector o
    where o.collector_share_regclass not in (
        select share_regclass
        from __keep_schare
    );


    with __keep_schare as (
        select n.share_regclass
        from unnest(array[
            'auth.colaborador',
            'auth.perfil',
            'tweeks.espaco',
            'auth.acesso',
            'auth.privilegio',
            'tweeks.trabalha',
            'cluster.branch',
            'tweeks.branch',
            'tweeks.classe',
            'cluster.resource',
            'tweeks.cambio'
            ]::text[] ) n( share_regclass )
    ) delete from cluster.version o
    where o.version_share_regclass not in (
        select share_regclass
        from __keep_schare
    );

    with __keep_schare as (
        select n.share_regclass
        from unnest(array[
            'auth.colaborador',
            'auth.perfil',
            'tweeks.espaco',
            'auth.acesso',
            'auth.privilegio',
            'tweeks.trabalha',
            'cluster.branch',
            'tweeks.branch',
            'tweeks.classe',
            'cluster.resource',
            'tweeks.cambio'
            ]::text[] ) n( share_regclass )
    ) delete from cluster.share o
    where o.share_regclass not in (
        select share_regclass
        from __keep_schare
    );
`;


