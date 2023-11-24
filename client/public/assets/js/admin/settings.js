var settings = {
    armazens: [],
    selected: null,
    empresa: null,
    postos: [],
    chaveDefinitiva: null,
    init(){
        settings.listarCambios();
        settings.carregarDadosEmpresa();
        settings.listarCodigosPosto();
        settings.listarPostos();
        settings.carrgarClustersBranch();
        settings.loadMainWorkspace()
    },
    carrgarClustersBranch(){
        $.ajax({
            url: "/api/clusters/branch",
            method: "GET",
            contentType: "application/json",
            success(e) {
                 $("#cluster_armazem").empty().append('<li>Sem venda</li>');
                e.clusters.forEach((clu)=>{
                    clu = clu.data;
                    $("#cluster_armazem").append(`<li class="tgl" cluster_identifier="${clu.cluster_identifier}">${clu.cluster_name}</li>`);
                });
            }
        });
    },
    listarCodigosPosto(){
        $.ajax({
            url: "/api/chave/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_chave_temporaria: null}),
            success(e) {
                let codigos_posto = $("[codigos_posto]");
                codigos_posto.empty();
                e.keys.forEach((ch) =>{
                    ch = ch.funct_load_chave;
                    if(ch.chave_temporarai === $("[posto]").text()){
                        codigos_posto.prepend(`<li key="${ch.chave_temporarai}">${ch.chave_temporarai + " "+( ' - dispositivo atual')}</li>`);
                    }
                    else{
                        codigos_posto.append(`<li key="${ch.chave_temporarai}">${ch.chave_temporarai}</li>`);
                    }
                });
            }
        });
    },
    listarPostos(){
        $.ajax({
            url: "/api/posto/load",
            method: "POST",
            contentType: "application/json",
            success(e) {
                let postosEstrutura = $(".list-postos");
                let postos_criados = $("[postos_criados]");
                let postos_espaco = $("#postos_espaco");
                postos_espaco.empty().append("<li>(Sem posto)</li>");
                settings.postos = [];
                settings.postos = e.postos;
                postos_criados.empty().append("<li>(Novo posto)</li>");
                postosEstrutura.empty();
                if(settings.postos.length === 0) postosEstrutura.addClass("empty");
                else postosEstrutura.removeClass("empty");

                e.postos.forEach((post, idx) =>{
                    post = post.funct_load_posto;
                    postos_criados.append(`<li id="${post.posto_id}">${post.posto_designacao}</li>`);
                    postosEstrutura.append(`<ul class="flex">
                                                <li class="flex column">
                                                    <span>Designação</span>
                                                    <span>${post.posto_designacao}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span>Tipo de posto</span>
                                                    <span>${post.tposto_designacao}</span>
                                                </li>
                                                     <li class="flex column">
                                                    <span>Tipo de caixa</span>
                                                    <span>${(post.posto_caixamode ? $("[tipoCaixa]").find(`li[tipo=${post.posto_caixamode}]`).text() : "Não definido")}</span>
                                                </li>                                      
                                                <li class="flex column">
                                                    <span class="noLabel"></span>
                                                        <span class="flex v-ct">
                                                        <a class="editar" title="Editar posto" i="${idx}">
                                                            <svg viewBox="0 0 512 512"><path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/><path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/></svg>
                                                        </a>
                                                        <span class="switch" tooltip="${(post.posto_ativo ? "Ativado" : "Desativado")}" flow="up">
                                                            <label class="xSwitch" i="${idx}">
                                                                <input type="checkbox" ${(post.posto_ativo ? "checked" : "")}>
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </span>
                                                     </span>
                                                </li>
                                        </ul>`);
                });
                e.postosEspaco.forEach((post, idx) =>{
                    post = post.funct_load_posto;
                    postos_espaco.append(`<li id="${post.posto_id}">${post.posto_designacao}</li>`);
                });
            }
        });
    },
    carregarDadosEmpresa(){
        $.ajax({
            url: "/api/empresa/load/data",
            method: "POST",
            contentType: "application/json",
            success(e) {
                let logo;
                settings.empresa = null;
                let impressorasEstrutura = $("#listPrinters");
                $("#xModalPrintSett").removeClass("haveKuchen");
                impressorasEstrutura.empty();
                $("#empresa_logo").val("")

                e.empresa.forEach((emp) =>{
                    emp = emp.funct_load_espaco_configuracao;
                    if(emp.espaco.espaco_configuracao !== null) {
                        settings.empresa = emp.espaco.espaco_configuracao;
                        if($("#empresa_cabecalho").val() !== ""){
                            settings.updateHeaderCompanyDocument();
                        }
                        emp = emp.espaco.espaco_configuracao;
                        logo = "/storage/" + emp.logo_referencia;
                        $("[logo_empresa]").removeClass("noPhoto").css('background-image', 'url(' + logo + ')');
                        $("[nome_empresa]").text(emp.empresa_nome);
                        $("#empresa_logo_nome").text(emp.logo_nome);
                        $("#empresa_certificacao").val((emp?.certification || ""));
                        $("[certification_empresa]").text((emp?.certification || ""));
                        if(emp?.logo_talao){
                            $("[logo_talao]").text("Sim");
                            $("#mostrarLogoTalao").addClass("active");
                        }
                        else $("[logo_talao]").text("Nao");

                        $("#empresa_cabecalho_nome").text((emp?.cabecalho_nome || ""));
                        $("[nif_empresa]").text("NIF: " + (emp.empresa_nif || ""));
                        $("[email_empresa]").text(emp.empresa_email);
                        $("[telef_empresa]").text(emp.empresa_telef);
                        $("[endereco_empresa]").text(emp.empresa_endereco);
                        $("[gerente_empresa]").text((emp.empresa_gerente || ""));
                        $("#empresa_nome").val(emp.empresa_nome);
                        $("#empresa_nif").val(emp.empresa_nif);
                        $("#empresa_email").val(emp.empresa_email);
                        $("#empresa_telef").val(emp.empresa_telef);
                        $("#empresa_endereco").val(emp.empresa_endereco);
                        $("#empresa_gerente").val(emp.empresa_gerente);
                        $("#empresa_textcolor").val(emp?.empresa_textcolor || "#ffffff");
                        $("#empresa_basecolor").val(emp?.empresa_basecolor || "#000000");
                        if(settings.empresa?.configuracao_impressoras === undefined){
                            settings.empresa["configuracao_impressoras"] = [];
                        }

                        $("#printTalaoA5, #printTalaoA6").removeClass( "active");
                        $(" #hasKuchen ").removeClass("active");
                        $(" #xModalPrintSett ").removeClass("haveKuchen");

                        if(!settings?.empresa?.impressoras_cozinha){
                            settings.empresa["impressoras_cozinha"] = {
                                nome: null,
                                ip: null
                            }
                        }

                        $(" #cosinha-margin-right ").val( "");
                        $(" #cosinha-margin-left ").val("");
                        if(!!settings?.empresa?.impressoras_cozinha?.nome || !!settings?.empresa?.impressoras_cozinha?.ip){
                            $("#nome_impressora_cozinha").val(settings.empresa.impressoras_cozinha.nome || "");
                            $("#ip_impressora_cozinha").val(settings.empresa.impressoras_cozinha.ip || "");

                            $("#cosinha-margin-right").val(settings?.empresa?.impressoras_cozinha?.marginRight || "");
                            $("#cosinha-margin-left").val(settings?.empresa?.impressoras_cozinha?.marginLeft || "");

                            $("#hasKuchen").addClass("active");
                            $("#xModalPrintSett").addClass("haveKuchen");
                        }

                        $("#margin-right").val(settings?.empresa?.impressorasTalao?.marginRight || "");
                        $("#margin-left").val(settings?.empresa?.impressorasTalao?.marginLeft || "");

                        $("#printTalaoA5").addClass(settings.empresa.printTalaoA5 ? "active" : "");
                        $("#printTalaoA6").addClass(settings.empresa.printTalaoA6 ? "active" : "");
                        if(emp.configuracao_impressoras.length === 0) impressorasEstrutura.addClass("empty");
                        else impressorasEstrutura.removeClass("empty");

                        emp.configuracao_impressoras.forEach((imp, idx) =>{
                            let tiposImpressao = ((imp.tipos_impressao.talao || " ")+" "+(imp.tipos_impressao.pdf || " "));
                            let impressoras_operacao = ((imp.impressoras.nome || "|")+" "+(imp.impressoras.ip || "|"));
                            tiposImpressao = tiposImpressao.trim().length >= 9 ? tiposImpressao.split(" ").join(" e ") : tiposImpressao.trim();
                            impressoras_operacao = impressoras_operacao.split("|").length === 1 ? impressoras_operacao.split(" ").join(" e ") : impressoras_operacao.split("|").join("").trim();
                            $("#printOperations").find(`li[operation=${imp.operacao.codigo}]`).remove();
                            impressorasEstrutura.append(`<ul class="flex">
                                                            <li class="flex column">
                                                                <span>Operação</span>
                                                                <span>${imp.operacao.nome}</span>
                                                            </li>
                                                            <li class="flex column">
                                                                <span>Tipos de impressão</span>
                                                                 <span>${tiposImpressao}</span>
                                                            </li>
                                                            <li class="flex column">
                                                                <span>Impressoras</span>
                                                                <span>${(impressoras_operacao || "N/D")}</span>
                                                            </li>
                                                            <li class="flex column">
                                                                <span class="noLabel"></span>
                                                                <span class="flex v-ct">
                                                                    <a>
                                                                    <svg class="edit" viewBox="0 0 512 512"  i="${idx}"><path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/><path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/></svg>
                                                                    </a>
                                                                <svg title="Remover" i="${idx}"  class="delete" viewBox="-40 0 427 427.00131"><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"/><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/></svg>
                                                                </span>
                                                            </li>
                                                        </ul>`);
                        });
                    }
                });
            }
        });
    },
    adicionarArmazem(){
        $("[bt_armazem]").attr("disabled", true).addClass("loading");
        let posto_uuid = $("#postos_espaco li.active").attr("id") || null;
        $.ajax({
            url: "/api/armazem",
            method: "POST",
            contentType: "application/json",
            error(){$("[bt_armazem]").attr("disabled", false).removeClass("loading")},
            data: JSON.stringify({arg_espaco_vender: $("#cluster_armazem").find("li.active").attr("cluster_identifier") || null,
                arg_espaco_nome: $("#armazem_designacao").val().trim(), arg_espaco_gerarfatura: $("#armazem_fatura_independente").hasClass("active"),
                arg_espaco_configurar: $("#armazem_config_independente").hasClass("active"), arg_espaco_codigo: null, arg_espaco_descricao: null,
                arg_espaco_posto_admin: posto_uuid}),
            success(e) {
                $("[bt_armazem]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    settings.listarArmazens();
                    $("#xModalCtrlArmazem li").removeClass("active").css("pointer-events", "auto");
                    $("#xModalCtrlArmazem input").val("");
                    xAlert("Adicionar armazém", "Operação efetuada com sucesso!");
                    $("#xModalCtrlArmazem").find(".hideTarget").click();
                    if(posto_uuid !== null)
                        $("#colaborador_logado_armazens li.active").attr("posto_admin", posto_uuid);
                }
                else{
                    xAlert("Adicionar armazém", e.message, "error");
                }
            }
        });
    },
    listarCambios(){
        $.ajax({
            url: "/api/cambio/load",
            method: "POST",
            contentType: "application/json",
            success(e) {
                let cambios = $("[cambios]");
                cambios.empty();
                e.currency.forEach((cu) =>{
                    cambios.append(`<li class="flex">
                                        <span>1 ${cu.currency_code}</span>
                                        <span>=</span>
                                        <span value="" code="${cu.currency_code.toLowerCase()}" currency="${cu.currency_id}"></span>
                                    </li>`);
                });
                e.cab.forEach((ca) =>{
                    ca = ca.data;
                    cambios.find(`span[code=${ca.currency_code.toLowerCase()}]`).attr("value", ca.cambio_taxa).text(ca.cambio_taxa.dc().formatter()+" STN");
                });
            }
        });
    },
    editarArmazem(){
        $("[bt_armazem]").attr("disabled", true).addClass("loading");
        let posto_uuid = $("#postos_espaco li.active").attr("id") || null;
        $.ajax({
            url: "/api/armazem/edit",
            method: "POST",
            contentType: "application/json",
            error(){$("[bt_armazem]").attr("disabled", false).removeClass("loading")},
            data: JSON.stringify({arg_espaco_vender:  $("#cluster_armazem").find("li.active").attr("cluster_identifier") || null,
                arg_espaco_change: this.selected.espaco_id,
                arg_espaco_nome: $("#armazem_designacao").val().trim(), arg_espaco_gerarfatura: $("#armazem_fatura_independente").hasClass("active"),
                arg_espaco_posto_admin: posto_uuid,
                arg_espaco_configurar: $("#armazem_config_independente").hasClass("active"), arg_espaco_codigo: null, arg_espaco_descricao: null}),
            success(e) {
                $("[bt_armazem]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    settings.listarArmazens();
                    $("#xModalCtrlArmazem li").removeClass("active").css("pointer-events", "auto");
                    $("#xModalCtrlArmazem input").val("");
                    xAlert("Atualizar armazém", "Operação efetuada com sucesso!");
                    $("#xModalCtrlArmazem").find(".hideTarget").click();
                    if(posto_uuid !== null)
                         $("#colaborador_logado_armazens li.active").attr("posto_admin", posto_uuid);
                }
                else{
                    xAlert("Atualizar armazém", e.message, "error");
                }
            }
        });
    },
    listarArmazens(){
        $.ajax({
            url: "/api/armazem/load",
            method: "POST",
            contentType: "application/json",
            success(e) {
                settings.armazens = [];
                settings.armazens = e.armazens;
                let estruturaArmazem = $(".list-armazens");
                let armazens_dados_empresa = $("#armazens_dados_empresa");
                let armazens_efatura = $("#armazem_efatura, #armazem_efaturav2");
                let imposto_espacos = $("#imposto_espacos");
                let spaceOptions;
                armazens_dados_empresa.empty();
                estruturaArmazem.empty();
                armazens_efatura.empty();
                imposto_espacos.empty();
                if(settings.armazens.length === 0) estruturaArmazem.addClass("empty");
                else estruturaArmazem.removeClass("empty");

                settings.armazens.forEach((arm, idx) =>{
                    arm = arm.funct_load_espaco;
                    spaceOptions = "";
                    spaceOptions = ` <li class="flex column">
                                                <span class="noLabel"></span>
                                                <span class="flex v-ct">
                                                    <a tTitle="Editar Armazém" class="editar" i="${idx}">
                                                      <svg viewBox="0 0 512 512"><path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/><path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/></svg>
                                                  </a>   
                                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right migrate" viewBox="0 0 16 16" style="height: 2rem;" i="${idx}">
                                                      <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                                      <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                                    </svg>    
                                                </span>
                                            </li>`;
                    if(settings.main_workspace !== arm.espaco_id){
                        spaceOptions = ` <li class="flex column">
                                                <span class="noLabel"></span>
                                                <span class="flex v-ct">
                                                    <a tTitle="Editar Armazém" class="editar" i="${idx}">
                                                      <svg viewBox="0 0 512 512"><path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/><path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/></svg>
                                                  </a>   
                                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right migrate" viewBox="0 0 16 16" style="height: 2rem;" i="${idx}">
                                                      <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                                      <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                                    </svg>    
                                                </span>
                                            </li>`;
                    }
                    else{
                        spaceOptions = ` <li class="flex column">
                                                <span class="noLabel"></span>
                                                <span class="flex v-ct">
                                                    <a tTitle="Editar Armazém" class="editar" i="${idx}">
                                                      <svg viewBox="0 0 512 512"><path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/><path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/></svg>
                                                  </a>   
                                                </span>
                                            </li>`;
                    }
                    if(arm.espaco_gerarfatura){
                        armazens_efatura.append(`<li armazem_id="${arm.espaco_id}" class="tgl">${arm.espaco_nome}</li>`);
                    }
                    estruturaArmazem.append(`<ul class="flex">
                                                <li class="flex column">
                                                    <span>Código</span>
                                                    <span>${arm.espaco_codigo}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span>Designação</span>
                                                    <span>${arm.espaco_nome}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span>Tipo</span>
                                                    <span>${(arm.espaco_vender ? "Armazém e loja" : "Armazém")}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span>Cluster</span>
                                                    <span>${(arm.cluster_name || "------")}</span>
                                                </li>
                                                 <li class="flex column">
                                                    <span>Afiliação</span>
                                                    <span>${(arm.affilhado_nome || "------")}</span>
                                                </li>
                                                ${spaceOptions}
                                        </ul>`);
                    armazens_dados_empresa.append(`<li id="${arm.espaco_id}">${arm.espaco_nome}</li>`);
                    imposto_espacos.append(`<li class="stgl" id="${arm.espaco_id}" uuid="${arm.espaco_id.replaceAll("-", "")}">${arm.espaco_nome}</li>`);
                });
            }
        });
    },
    configurarDadosEmpresa(){
        let dados = { ...this.empresa };
        $("[bt_empresa]").attr("disabled", true).addClass("loading");
        dados.empresa_nome = $("#empresa_nome").val().trim();
        dados.empresa_nif = $("#empresa_nif").val();
        dados.empresa_email = $("#empresa_email").val().trim();
        dados.empresa_telef = $("#empresa_telef").val();
        dados.empresa_endereco = $("#empresa_endereco").val().trim();
        dados.empresa_gerente = $("#empresa_gerente").val().trim() || null;
        dados.empresa_basecolor = $("#empresa_basecolor").val().trim() || null;
        dados.empresa_textcolor = $("#empresa_textcolor").val().trim() || null;
        dados.logo_nome = this.empresa?.logo_nome || null;
        dados.logo_talao = $("#mostrarLogoTalao").hasClass("active");
        if($("#remove_header").hasClass("active")){
            $("#empresa_cabecalho").val("");
            dados.cabecalho_nome = null;
            dados.cabecalho_referencia = null;
        }
        else{
            dados.cabecalho_nome = this.empresa?.cabecalho_nome || null;
            dados.cabecalho_referencia = this.empresa?.cabecalho_referencia || null;
        }
        dados.logo_referencia = this.empresa?.logo_referencia || null;
        dados.certification = $("#empresa_certificacao").val().trim() || null;
        dados.configuracao_impressoras = this.empresa?.configuracao_impressoras || [];
        dados.impressoras_cozinha = this.empresa?.impressoras_cozinha || {};
        dados.printTalaoA5 = !!this.empresa?.printTalaoA5;
        dados.printTalaoA6 = !!this.empresa?.printTalaoA6;
        dados.impressorasTalao = this?.empresa?.impressorasTalao || {};

        let formData = new FormData();
        formData.append("data", JSON.stringify({dados_empresa: dados}));
        formData.append("file", $("#empresa_logo")[0].files[0]);

        $.ajax({
            url: "/api/empresa/change",
            method: "POST",
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            dataType: "json",
            data: formData,
            error(){$("[bt_empresa]").attr("disabled", false).removeClass("loading")},
            complete(){$("[bt_empresa]").attr("disabled", false).removeClass("loading")},
            success(e){
                $("[bt_empresa]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    $("#remove_header, #mostrarLogoTalao").removeClass("active");
                    settings.carregarDadosEmpresa();
                    xAlert("Atualizar dados da empresa", "Dados atualizados com sucesso!");
                    $("#xModalAboutEnterprise").find(".hideTarget").click();
                }
                else
                    xAlert("Atualizar dados da empresa", e.message, "error");
            }
        });
    },
    updateHeaderCompanyDocument(){
        let formData = new FormData();
        formData.append("data", JSON.stringify({dados_empresa: this.empresa}));
        formData.append("file", $("#empresa_cabecalho")[0].files[0]);
        $.ajax({
            url: "/api/empresa/cabecalho",
            method: "POST",
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            dataType: "json",
            data: formData,
            success(e){
                if(e.result){
                    $("#empresa_cabecalho").val("");
                    settings.carregarDadosEmpresa();
                }
            }
        });
    },
    atualizarCambio(){
        $("[bt_cambio]").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/cambio",
            method: "POST",
            contentType: "application/json",
            error(){$("[bt_cambio]").attr("disabled", false).removeClass("loading")},
            data: JSON.stringify({euro: $("#cambio_euro").val().unFormatter(), usd: $("#cambio_usd").val().unFormatter(), euro_currency: $("#cambio_euro").attr("currency"),
                usd_currency: $("#cambio_usd").attr("currency"), xaf_currency: $("#cambio_xaf").attr("currency"), data: new Date().getDateEn(), xaf: $("#cambio_xaf").val().unFormatter()}),
            success(e) {
                $("[bt_cambio]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    settings.listarCambios();
                    $("#xModalCtrlCambio").find(".hideTarget").click();
                    xAlert("Câmbio", "Câmbio definido com sucesso!");
                }
                else{
                    xAlert("Câmbio", e.message, "error");
                }
            }
        });
    },
    get armazensSelecionados(){
        let armazens = [];
        $("[armazens_posto]").find("li.active").each(function () {
            let espaco_id = $(this).attr("id");
            let series = $(this).closest(".xform").find(`[armazem="${espaco_id}"]`)
            let {serie_faturarecibo} = series.find("[recibo] li.active").data() || {};
            let {serie_fatura} = series.find("[fatura] li.active").data() || {};

            armazens.push({
                espaco_id,
                serie_faturarecibo,
                serie_fatura
            });
        });
        return armazens;
    },
    get armazensSelecionadosChange(){
        let armazens = [];
        $("[armazens_posto_edit]").find("li.active").each(function () {
            let espaco_id = $(this).attr("id");
            let series = $(this).closest(".xform").find(`[armazem="${espaco_id}"]`)
            let {serie_faturarecibo} = series.find("[recibo] li.active").data() || {};
            let {serie_fatura} = series.find("[fatura] li.active").data() || {};

            armazens.push({
                espaco_id,
                serie_faturarecibo,
                serie_fatura
            });
        });
        return armazens;
    },
    adicionarPosto(){
        $("[bt_posto]").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/posto",
            method: "POST",
            contentType: "application/json",
            error(){$("[bt_posto]").attr("disabled", false).removeClass("loading")},
            data: JSON.stringify({arg_tposto_id: $("[tipoPosto]").find("li.active").attr("id"),
                arg_espaco_destino: this.armazensSelecionados,
                arg_posto_id: null, posto_caixamode: $("[tipoCaixa]").find("li.active").attr("tipo"),
                posto_authmode: $("[pinAuthPOS]").find("li.active").attr("tipo"),
                arg_posto_designacao: $("#posto_designacao").val().trim(),
                arg_posto_multiplecaixa: $("#posto_varias_caixas_abertas").hasClass("active"),
                posto_vermontatefaturado: $("#posto_ver_montate_faturado").hasClass("active"),
                posto_definirmontanteautomaticamente: $("#posto_definir_montante_automaticamente").hasClass("active"),
                arg_posto_matricula: $("[codigos_posto]").find("li.active").attr("key"),
                arg_posto_montanteinicial: 0
            }),
            success(e) {
                $("[bt_posto]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    $("[armazens_posto], [tipoposto], [tipoCaixa], [pinAuthPOS]").find("li").removeClass("active");
                    $("#posto_varias_caixas_abertas").removeClass("active");
                    $("#posto_ver_montate_faturado").removeClass("active");
                    $("#posto_definir_montante_automaticamente_edit").removeClass("active");
                    $("#xModalCtrlPosto input").val("").attr("disabled", false);
                    settings.listarPostos();
                    $("#xModalCtrlPosto").find(".hideTarget").click();
                    xAlert("Adicionar posto", "Posto criado com sucesso!");
                }
                else{
                    xAlert("Adicionar posto", e.message, "error");
                }
            }
        });
    },
    associarPosto(){
        $("[bt_posto]").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/posto/associar",
            method: "POST",
            contentType: "application/json",
            error(){$("[bt_posto]").attr("disabled", false).removeClass("loading")},
            data: JSON.stringify({arg_chave_temporaria: $("[codigos_posto]").find("li.active").attr("key"),
                arg_chave_definitiva:  settings.chaveDefinitiva}),
            success(e) {
                $("[bt_posto]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    $("[armazens_posto], [tipoposto], [tipoCaixa], [pinAuthPOS]").find("li").removeClass("active").css("pointer-events", "auto");
                    $("#posto_varias_caixas_abertas").removeClass("active").css("pointer-events", "auto");
                    $("#xModalCtrlPosto input").val("").attr("disabled", false);
                    settings.listarPostos();
                    $("#xModalCtrlPosto").find(".hideTarget").click();
                    xAlert("Associar posto", "Posto associado com sucesso!");
                    socket.sendPostChange();
                }
                else{
                    xAlert("Associar posto", e.message, "error");
                }
            }
        });
    },
    changeStatusPost(){
        let title = settings.selected.posto_ativo ? "Desativar posto" : "Ativar posto";
        $.ajax({
            url: "/api/posto/status",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_posto_id: this.selected.posto_id}),
            success(e) {
                if(e.result){
                    settings.listarPostos();
                    $("#xModalStatusPost").find(".hideTarget").click();
                    xAlert(title, "Operação efetuada com sucesso!");
                }
                else{
                    xAlert(title, e.message, "error");
                }
            }
        });
    },
    editarPosto(){
        $("[bt_edit_posto]").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/posto",
            method: "POST",
            contentType: "application/json",
            error(){$("[bt_edit_posto]").attr("disabled", false).removeClass("loading")},
            data: JSON.stringify({arg_tposto_id: $("[tipoPostoEdit]").find("li.active").attr("tipo_id"),
                arg_espaco_destino: this.armazensSelecionadosChange,
                arg_posto_id:  settings.selected.posto_id,
                arg_posto_designacao: $("[postoDesignacao]").val().trim(),
                arg_posto_multiplecaixa: $("#posto_varias_caixas_abertas_edit").hasClass("active"),
                posto_vermontatefaturado: $("#posto_ver_montate_faturado_edit").hasClass("active"),
                posto_definirmontanteautomaticamente: $("#posto_definir_montante_automaticamente_edit").hasClass("active"),
                arg_posto_matricula: null,
                posto_authmode: $("[pinAuthEdit]").find("li.active").attr("tipo"),
                posto_caixamode:  $("[tipoCaixaEdit]").find("li.active").attr("tipo")
            }),
            success(e) {
                $("[bt_edit_posto]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    $("[armazens_posto_edit], [tipoPostoEdit], [pinAuthEdit], [tipoCaixaEdit]").find("li").removeClass("active");
                    $("#posto_varias_caixas_abertas_edit").removeClass("active");
                    $("#posto_definir_montante_automaticamente_edit").removeClass("active");
                    $("#posto_ver_montate_faturado_edit").removeClass("active");
                    $("#xModalCtrlEditPosto input").val("");
                    settings.listarPostos();
                    $("#xModalCtrlEditPosto").find(".hideTarget").click();
                    xAlert("Editar posto", "Posto editado com sucesso!");
                }
                else{
                    xAlert("Editar posto", e.message, "error");
                }
            }
        });
    },
    loadMainWorkspace() {
        $.ajax({
            url: "/api/user/main/workspace/load",
            method: "POST",
            contentType: "application/json",
            success(e) {
                settings.main_workspace = e.mainWorkspace;
                settings.listarArmazens();
            }
        });
    },
    migrateSpace(){
        $("[migrate_space]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/space/migrate",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({espaco_espaco_id: $("[armazem_migracao]").find("li.active").attr("armazem_id"),
                espaco_id: settings.selected.espaco_id}),
            error(){$("[migrate_space]").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("[migrate_space]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    settings.listarArmazens();
                    $("#xModalMigrateSpaceToAnother").find(".hideTarget").click();
                    xAlert("Migrar armazém", "Operação efetuada com sucesso!");
                }
                else{
                    xAlert("Migrar armazém", e.data, "error");
                }
            }
        });
    },
    loadSpacesMigrate(space_uuid){
        $.ajax({
            url: "/api/spaces/migrate/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_espaco_migracao: space_uuid}),
            success(e) {
                e.spaces.forEach((space) =>{
                        $("[armazem_migracao]").append(`<li class="tgl" armazem_id="${space.data.espaco_id}">${space.data.espaco_nome}</li>`);
                    });
                showTarget("xModalMigrateSpaceToAnother", "Migrar armazém");
            }
        });
    }
};
settings.init();

$("[bt_armazem]").on("click", function () {
    if(!validation1($("#armazem_designacao"))) return;
    if($("#cluster_armazem").find("li.active").length === 0){
        xAlert("Armazém", "Selecione o núcleo!", "info");
        return;
    }
    if($("#xModalCtrlArmazem").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")) settings.adicionarArmazem();
    else settings.editarArmazem();
});
$(".list-armazens").on("click", ".editar", function () {
    settings.selected = settings.armazens[$(this).attr("i")].funct_load_espaco;
    $("#xModalCtrlArmazem").find("h3").text("Editar armazém");
    $("#armazem_designacao").val(settings.selected.espaco_nome);
    $("#cluster_armazem li").removeClass("active");
    $("#postos_espaco li").removeClass("active");
    $("#cluster_armazem").closest(".xselect").find("input").val((settings.selected.cluster_name || ""));
    $("#postos_espaco").closest(".xselect").find("input").val((settings.selected.posto_designacao || ""));
    $("#armazem_fatura_independente, #armazem_config_independente").removeClass("active").css("pointer-events", "auto");
    if(settings.selected.espaco_posto_admin){
        $("#postos_espaco").find(`li[id=${settings.selected.espaco_posto_admin}]`).addClass("active");
    }
    if(settings.selected.cluster_identifier){
        $("#cluster_armazem").find(`li[cluster_identifier=${settings.selected.cluster_identifier}]`).addClass("active");
    }
    if(settings.selected.espaco_configurar){
        $("#armazem_config_independente").addClass("active");
        if(settings.main_workspace === settings.selected.espaco_id &&  settings.selected.espaco_nivel === 1)
             $("#armazem_config_independente").css("pointer-events", "none");
    }
    if(settings.selected.espaco_gerarfatura){
        $("#armazem_fatura_independente").addClass("active");
        if(settings.main_workspace === settings.selected.espaco_id &&  settings.selected.espaco_nivel === 1)
             $("#armazem_fatura_independente").css("pointer-events", "none");
    }
    showTarget("xModalCtrlArmazem", "Editar Armazém");
}).on("click", ".migrate", function () {
    settings.selected = settings.armazens[$(this).attr("i")].funct_load_espaco;
    let armazem_migracao = $("[armazem_migracao]");
    armazem_migracao.empty();
    armazem_migracao.parents(".xselect").find("input").val("");
    settings.loadSpacesMigrate(settings.selected.espaco_id);
});
$("#empresa_logo").on("change", function (){
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) return;
    if (this.files.length === 0) return;

    let file = this.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        $("#empresa_logo_nome").text(file.name);
    };
    reader.readAsDataURL(file);
});
$("#empresa_cabecalho").on("change", function (){
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) return;
    if (this.files.length === 0) return;

    let file = this.files[0];
    let reader = new FileReader();
    reader.onloadend= function (e){
        let image = new Image();
        image.src = e.target.result;
        image.onload = function () {
            let height = this.height;
            let width = this.width;
            if(width === 892 && height === 196){
                $("#empresa_cabecalho_nome").text(file.name);
            }
            else{
                xAlert("Cabeçalho da instituição", "Tamanho de ficheiro negado. Permitido (892 x 196)!", "error");
                $("#empresa_cabecalho").val("");
                $("#empresa_cabecalho_nome").text("");
            }
        };

    };
    reader.readAsDataURL(file);
});
$("[bt_empresa]").on("click", function () {
    if(!validation1($("#xModalAboutEnterprise").find("input:text"))) return;
    if(!isMailValid($("#empresa_email"))){
        xAlert("Atualizar dados da empresa", "Email inválido. Digite um email válido!", "error");
        $("#empresa_email").focus();
        return;
    }
    if(settings.empresa === null && $("#empresa_logo")[0].files.length === 0){
        xAlert("Atualizar dados da empresa", "Carregue o logótipo da empresa", "info");
        return;
    }
    settings.configurarDadosEmpresa();
});
$("[bt_cambio]").on("click", function () {
    if(validation1($("#xModalCtrlCambio").find("input:text"))){
        settings.atualizarCambio();
    }
});
$("#editarCambio").on("click", function () {
    let cambiosData = $("[cambios]");
    $("#cambio_stn").val(cambiosData.find("span[code=stn]").attr("value")).attr("currency", cambiosData.find("span[code=stn]").attr("currency"));
    $("#cambio_euro").val(cambiosData.find("span[code=eur]").attr("value")).attr("currency", cambiosData.find("span[code=eur]").attr("currency"));
    $("#cambio_usd").val( cambiosData.find("span[code=usd]").attr("value")).attr("currency", cambiosData.find("span[code=usd]").attr("currency"));
    $("#cambio_xaf").val(cambiosData.find("span[code=xaf]").attr("value")).attr("currency", cambiosData.find("span[code=xaf]").attr("currency"));
    showTarget("xModalCtrlCambio", "Atualizar câmbio");
});
$("[bt_posto]").on("click", function () {
    let posto_id = $("[postos_criados]").find("li.active").attr("id") || null;
    if($("[codigos_posto]").find("li.active").length === 0){
        xAlert("Posto", "Selecione o código do posto!", "info");
        return;
    }
    if($("[postos_criados]").find("li.active").attr("id") === undefined){
        if(!validation1($("#posto_designacao"))) return;
        if($("[tipoPosto]").find("li.active").length === 0){
            xAlert("Posto", "Selecione o tipo de posto!", "info");
            return;
        }
        if($("[tipoCaixa]").find("li.active").length === 0){
            xAlert("Posto", "Selecione o tipo de caixa!", "info");
            return;
        }
        if($("[pinAuthPOS]").find("li.active").length === 0){
            xAlert("Posto", "Selecione a forma de autenticação no POS!", "info");
            return;
        }
        if($("[armazens_posto]").find("li.active").length === 0){
            xAlert("Posto", "Selecione o(s) armazém(s)!", "info");
            return;
        }
    }
    if($("#xModalCtrlPosto").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")){
        if(posto_id === null)
             settings.adicionarPosto();
        else settings.associarPosto();
    }
});
$("body").on("mousedown", "[postos_criados] li", function () {
    if($(this).attr("id") !== undefined){
        $("[armazens_posto], [tipoposto], [tipoCaixa], [pinAuthPOS]").find("li").removeClass("active").css("pointer-events", "none");
        $("#posto_varias_caixas_abertas, #posto_ver_montate_faturado, #posto_definir_montante_automaticamente").removeClass("active").css("pointer-events", "none");
        let posto = settings.postos.filter((post => post.funct_load_posto.posto_id === $(this).attr("id")));
         $("#posto_designacao").val(posto[0].funct_load_posto.posto_designacao).attr("disabled", true);
         $("#postoTipoDesc").val(posto[0].funct_load_posto.tposto_designacao).attr("disabled", true);
        if (posto[0].funct_load_posto.posto_multiplecaixa) {
            $("#posto_varias_caixas_abertas").addClass("active");
        }
        if (posto[0].funct_load_posto.posto_vermontatefaturado) {
            $("#posto_ver_montate_faturado").addClass("active");
        }
        if (posto[0].funct_load_posto.posto_definirmontanteautomaticamente) {
            $("#posto_definir_montante_automaticamente").addClass("active");
        }
         $("#tipoCaixaDesc").val((posto[0].funct_load_posto.posto_caixamode !== null ? $("[tipoCaixa]").find(`li[tipo=${posto[0].funct_load_posto.posto_caixamode}]`).text() : "")).attr("disabled", true);
         $("#tipoAuthPOS").val((posto[0].funct_load_posto.posto_authmode !== null ? $("[pinAuthPOS]").find(`li[tipo=${posto[0].funct_load_posto.posto_authmode}]`).text() : "")).attr("disabled", true);
         $("[tipoposto]").find(`li[id=${posto[0].funct_load_posto.tposto_id}]`).addClass("active");
         posto[0].funct_load_posto.posto_alocacao.forEach((al) =>{
             $("[armazens_posto]").find(`li[uuid=${al.espaco_id.replaceAll("-", "")}]`).addClass("active").attr("disabled", true);
         });
         settings.chaveDefinitiva = posto[0].funct_load_posto.posto_chave;
    }
    else{
        $("[armazens_posto], [tipoposto], [pinAuthPOS], [tipoCaixa]").find("li").removeClass("active").css("pointer-events", "auto");
        $("#posto_varias_caixas_abertas").removeClass("active").css("pointer-events", "auto");
        $("#posto_designacao, #postoTipoDesc, #tipoAuthPOS, #tipoCaixaDesc").val("").attr("disabled", false);
    }
});
$(".list-postos").on("click", ".editar", function () {
    settings.selected = settings.postos[$(this).attr("i")].funct_load_posto;
    $("[postoDesignacao]").val(settings.selected.posto_designacao);
    $("[armazens_posto_edit], [tipoPostoEdit], [pinAuthEdit], [tipoCaixaEdit]").find("li").removeClass("active");
    $("[armazem]").addClass("hide");
    $("#posto_varias_caixas_abertas_edit").removeClass("active");
    $("#posto_definir_montante_automaticamente_edit").removeClass("active");
    $("#posto_ver_montate_faturado_edit").removeClass("active");
    $("[postoTipoDesc]").val(settings.selected.tposto_designacao);
    $("#tipoCaixaDescEdit").val((settings.selected.posto_caixamode !== null ? $("[tipoCaixaEdit]").find(`li[tipo=${settings.selected.posto_caixamode}]`).text() : ""));
    $("#pinAuthDescEdit").val((settings.selected.posto_authmode !== null ? $("[pinAuthEdit]").find(`li[tipo=${settings.selected.posto_authmode}]`).text() : ""));
    if(settings.selected.posto_multiplecaixa){
        $("#posto_varias_caixas_abertas_edit").addClass("active");
    }
    if(settings.selected.posto_vermontatefaturado){
        $("#posto_ver_montate_faturado_edit").addClass("active");
    }
    if(settings.selected.posto_definirmontanteautomaticamente){
        $("#posto_definir_montante_automaticamente_edit").addClass("active");
    }
    $("[tipoPostoEdit]").find(`li[tipo_id=${settings.selected.tposto_id}]`).addClass("active");
    $("[tipoCaixaEdit]").find(`li[tipo=${settings.selected.posto_caixamode}]`).addClass("active");
    $("[pinAuthEdit]").find(`li[tipo=${settings.selected.posto_authmode}]`).addClass("active");
    let postosAlocados =  settings.selected.posto_alocacao || [];
    let armazens_posto_edit = $("[armazens_posto_edit]");
    postosAlocados.forEach(({espaco_id, aloca_serie_faturarecibo, aloca_serie_fatura}) =>{
        armazens_posto_edit.find(`li[uuid=${espaco_id.replaceAll("-", "")}]`).click();

        let localSerie = armazens_posto_edit.closest(".xform").find(`[armazem="${espaco_id}"]`).removeClass("hide");
        localSerie.find(`li[data-serie_faturarecibo='${aloca_serie_faturarecibo}']`).mousedown();
        localSerie.find(`li[data-serie_fatura='${aloca_serie_fatura}']`).mousedown()
    });
    showTarget("xModalCtrlEditPosto", "Editar posto");
}).on("click", ".xSwitch", function (e){
    e.preventDefault();
    settings.selected = settings.postos[$(this).attr("i")].funct_load_posto;
    showTarget("xModalStatusPost", (settings.selected.posto_ativo ? "Desativar posto" : "Ativar posto"));
});
$("[newPrinter]").on("click", function () {
    if(settings.empresa !== null)
        showTarget("xModalPrintSett", "Adicionar impressora");
    else
        xAlert("Adicionar impressora", "Primeiramente, atualize os dados da empresa!", "info");
});
$("[changeStatusPost]").on("click", function () {
    settings.changeStatusPost();
});
$("[bt_edit_posto]").on("click", function () {
    if(!validation1($("[postoDesignacao]"))) return;
    if($("[tipoPostoEdit]").find("li.active").length === 0){
        xAlert("Editar posto", "Selecione o tipo de posto!", "info");
        return;
    }
    if($("[tipoCaixaEdit]").find("li.active").length === 0){
        xAlert("Editar posto", "Selecione o tipo de caixa!", "info");
        return;
    }
    if($("[pinAuthEdit]").find("li.active").length === 0){
        xAlert("Editar posto", "Selecione a forma de autenticação no POS!", "info");
        return;
    }
    if($("[armazens_posto_edit]").find("li.active").length === 0){
        xAlert("Posto", "Selecione o(s) armazém(s)!", "info");
        return;
    }
    settings.editarPosto();
});
$("[novoArmazem]").on("click", function () {
    if(!$("#xModalCtrlArmazem").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")){
        $("#xModalCtrlArmazem li").removeClass("active").css("pointer-events", "auto");
        $("#xModalCtrlArmazem input").val("");
    }
    showTarget("xModalCtrlArmazem", "Adicionar Armazém");
});
$("[migrate_space]").on("click", function () {
    if($("[armazem_migracao]").find("li.active").length === 0){
        xAlert("Migrar armazém", "Selecione o armazém!", "info");
    }
    else{
        settings.migrateSpace();
    }
});

$("[armazens_posto_edit], [armazens_posto]").on("click", "li",function (){
    let espaco_id = $(this).attr("id");
    let armazens_posto_faturas = $(`[armazem="${espaco_id}"]`).toggleClass("hide");
    if(!armazens_posto_faturas.hasClass()){
        armazens_posto_faturas.find("input").val("")
        armazens_posto_faturas.find("li").removeClass("active")
    }
});
