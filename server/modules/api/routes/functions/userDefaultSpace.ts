export function validate_user_space(user_spaces, post_spaces){
    if(user_spaces.length === 0) return {result: false, message: "Não estás associado a nenhum armazém de venda!"};
    user_spaces = post_spaces.filter(value => user_spaces.find(espaCol => espaCol.espaco_id === value.data.espaco_id));
    if(user_spaces.length === 0) return {result: false, message: "Nenhum dos armazéns que trabalhas fazem parte deste posto neste dispositivo!"};
    return {result: true, spaces: user_spaces};
}
export function getDefaultSpace(req, colaborador_id, user_spaces ){
    let space;
    req.session.default_space = req.session.default_space || [];
    space = req.session.default_space.find(sp => sp.colaborador_id === colaborador_id);
    if(space) return (user_spaces.find(value => value.data.espaco_id === space.space_id)?.data?.espaco_id || null);
    else return null;
}
