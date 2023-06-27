
var branch = {
    selected: null,
    menus: [],
    list: [],
    init(){
        branch.load();
        branch.loadMenus();
        branch.loadPaths();
    },
    loadPaths(){
        $.ajax({
            url: "/api/path/clusters",
            method: "GET",
            contentType: "application/json",
            success(e) {
                $("#branch_path").empty();
                e.paths.forEach((path)=>{
                    $("#branch_path").append(`<li class="tgl" path="${path.data}" path_formatted="${path.data.replace("/", "")}">${path.data}</li>`);
                });
            }
        });
    },
    load(){
        $("body").addClass("loading");
        $.ajax({
            url: "/api/branch",
            method: "GET",
            contentType: "application/json",
            error(){ $("body").removeClass("loading")},
            success(e) {
                $("body").removeClass("loading");
                branch.list = [];
                branch.list = e.branchs;
                $("#listBranches").empty();
                if(branch.list.length === 0) $("#listBranches").addClass("empty");
                else $("#listBranches").removeClass("empty");

                branch.list.forEach((brach, idx)=>{
                    brach = brach.data;
                    $("#listBranches").append(`<ul class="flex">
                        <li class="flex column">
                            <span>Nome</span>
                            <span>${brach.branch_name}</span>
                        </li>
                        <li class="flex column">
                            <span>Tipo</span>
                            <span>${brach.tbranch_name}</span>
                        </li>
                        <li class="flex column">
                            <span>Nome do(a) colaborador(a)</span>
                            <span>${brach.colaborador_nome}</span>
                        </li>   
                          <li class="flex column">
                            <span>Email do(a) colaborador(a)</span>
                            <span>${brach.colaborador_email}</span>
                        </li>                  
                         <li class="flex column">
                            <span>Caminho</span>
                           <span>${brach.branch_path}</span>
                        </li>  
                        <li class="flex column">
                            <span>Data de registo</span>
                           <span>${alterFormatDate(brach.branch_date.substring(0, 10)) + ", " + brach.branch_date.substring(11, 13) + "h" + brach.branch_date.substring(14, 16)}</span>
                        </li>   
                       <li class="flex column">
                                <span class="noLabel"></span>
                                <span class="flex v-ct">
                                    <a class="editar" i="${idx}">
                                      <svg viewBox="0 0 512 512"><path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/><path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/></svg>
                                  </a>       
                                </span>
                        </li>                 
                    </ul>`);
                });
            }
        });
    },
    get selectedMasterMenus() {
        let menusSelecionados = [];
        $("[allMenus]").find(".xcheck.multiple").each(function () {
            if($(this).find(".fkcheck").hasClass("parcial") || $(this).find(".fkcheck").hasClass("full")){
                menusSelecionados.push(parseInt($(this).attr("menu_id")));
                $(this).find("li.active").each(function () {
                    menusSelecionados.push(parseInt($(this).attr("menu_id")));
                });
            }
        });
        return menusSelecionados;
    },
    loadMenus() {
        $.ajax({
            url: "/api/all/menus",
            method: "GET",
            contentType: "application/json",
            success(e) {
                branch.menus = [];
                branch.menus = e.menus;
                let allMenus = $("[allMenus]");
                let funcionalidades = [];
                allMenus.find(".xcheck.multiple").remove();
                branch.menus.forEach((me) => {
                    me = me.data;
                    if (me.menu_menu_id === null){
                        allMenus.append(`<div class="xcheck multiple mainMenu" menu_id="${me.menu_id}">
                                            <div class="tit flex">
                                                <span class="j-stp fkcheck"></span>
                                                <span>${me.menu_nome}</span>
                                            </div>
                                        </div>`);
                        funcionalidades = branch.menus.filter((func => func.data.menu_menu_id === me.menu_id));
                        if(funcionalidades.length > 0){
                            allMenus.find(`.xcheck.multiple[menu_id=${me.menu_id}] .tit.flex`).after(`<ul></ul>`);
                            funcionalidades.forEach((fu) =>{
                                fu = fu.data;
                                allMenus.find(`.xcheck.multiple[menu_id=${me.menu_id}] ul`).append(`<li menu_id="${fu.menu_id}" menu_menu_id="${fu.menu_menu_id}">${fu.menu_nome}</li>`);
                            });
                        }
                    }
                });
            }
        });
    },
    add(){
        let branch_data = {};
        branch_data.branch_name = $("#branch_nome").val().trim();
        branch_data.branch_tbranch_id = $("#tipo_branch").find("li.active").attr("tbranch_id");
        branch_data.branch_path =  $("#branch_path").find("li.active").attr("path");
        branch_data.branch_user = {
            arg_colaborador_id: null, arg_espaco_auth: null,
            arg_colaborador_email: $("#colaborador_master_email").val().trim(),
            arg_colaborador_nome: $("#colaborador_master_nome").val().trim(),
            arg_colaborador_apelido: null, arg_colaborador_nif: null,
            arg_colaborador_datanascimento: null, arg_colaborador_ficha: null,
            arg_colaborador_foto: null, arg_tsexo_id: null,
            arg_menu_list: branch.selectedMasterMenus, arg_espaco: [],
            arg_colaborador_pin: 1234, arg_colaborador_senha: 1234
        };
        branch_data.branch_workspace = {
            arg_colaborador_id: null, arg_espaco_auth: null,
            arg_espaco_vender: $("#clustersBranch input:radio:checked").attr("identificador"),
            arg_espaco_nome: $("#branch_nome").val().trim(),
             arg_espaco_descricao: null,
            arg_espaco_gerarfatura: true, arg_espaco_configurar: true
        };
        branch_data.branch_licence = null;
        branch_data.branch_grants = {menu: branch.selectedMasterMenus};
        branch_data.branch_clusters = this.selectedClustersPath;

        $("[bt_branch]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/branch",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(branch_data),
            error() { $("[bt_branch]").prop("disabled", false).removeClass("loading") },
            complete() { $("[bt_branch]").prop("disabled", false).removeClass("loading") },
            success(e) {
                $("[bt_branch]").prop("disabled", false).removeClass("loading");
                if (e.result) {
                    branch.load();
                    xAlert("Adicionar branch", "Branch registado com sucesso!");
                    $("#clustersBranch").empty();
                    $("[allMenus]").find(".xcheck.multiple .fkcheck").removeClass("parcial full");
                    $("[allMenus], #branch_path").find("li").removeClass("active");
                    $("#xModalCreateBranch input").val("").prop("disabled", false);
                    $("#tipo_branch").find("li").removeClass("active");
                    $("#xModalCreateBranch").find(".hideTarget").click();
                }
                else xAlert("Adicionar branch", e.data, "error");
            }
        });
    },
    get selectedClustersPath(){
        let clustersSelected = [];
        $("#clustersBranch").find("li.active").each(function () {
            clustersSelected.push($(this).attr("cluster_identificador"));
        });
        return clustersSelected;
    },
    edit(){
        let branch_data = {};
        branch_data.branch_uid = branch.selected.branch_uid;
        branch_data.branch_name = $("#branch_nome").val().trim();
        branch_data.branch_tbranch_id = $("#tipo_branch").find("li.active").attr("tbranch_id");
        branch_data.branch_path =  $("#branch_path").find("li.active").attr("path");
        branch_data.branch_user = {
            arg_colaborador_editar: branch.selected.colaborador_id,
            arg_colaborador_id: null, arg_espaco_auth: null,
            arg_colaborador_email: $("#colaborador_master_email").val().trim(),
            arg_colaborador_nome: $("#colaborador_master_nome").val().trim(),
            arg_colaborador_apelido: null, arg_colaborador_nif: null,
            arg_colaborador_datanascimento: null, arg_colaborador_ficha: null,
            arg_colaborador_foto: null, arg_tsexo_id: null,
            arg_menu_list: branch.selectedMasterMenus, arg_espaco: []
        };
        branch_data.branch_workspace = {
            arg_espaco_change: branch.selected.espaco_id,
            arg_colaborador_id: null, arg_espaco_auth: null,
            arg_espaco_vender:  $("#clustersBranch input:radio:checked").attr("identificador"),
            arg_espaco_nome: $("#branch_nome").val().trim(),
             arg_espaco_descricao: null,
            arg_espaco_gerarfatura: true, arg_espaco_configurar: true
        };
        branch_data.branch_licence = branch.selected.branch_licence;
        branch_data.branch_grants = {menu: branch.selectedMasterMenus};
        branch_data.branch_clusters = this.selectedClustersPath;

        $("[bt_branch]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/branch",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(branch_data),
            error() { $("[bt_branch]").prop("disabled", false).removeClass("loading") },
            complete() { $("[bt_branch]").prop("disabled", false).removeClass("loading") },
            success(e) {
                $("[bt_branch]").prop("disabled", false).removeClass("loading");
                if (e.result) {
                    branch.load();
                    branch.selected = null;
                    xAlert("Editar branch", "Branch atualizado com sucesso!");
                    $("#clustersBranch").empty();
                    $("[allMenus]").find(".xcheck.multiple .fkcheck").removeClass("parcial full");
                    $("[allMenus], #branch_path").find("li").removeClass("active");
                    $("#xModalCreateBranch input").val("").prop("disabled", false);
                    $("#tipo_branch").find("li").removeClass("active");
                    $("#xModalCreateBranch").find(".hideTarget").click();
                }
                else xAlert("Editar branch", e.data, "error");
            }
        });
    },
    showClustersPath(path, selectedClusters = false){
        let clustersBranch =  $("#clustersBranch");
        clustersBranch.empty();

        const clusterCaminho = cluster.list.filter(clu => clu.data.cluster_path === path);
        clusterCaminho.forEach((clustC)=>{
            clustersBranch.append(`<div class="flex h-sb">
                                                 <li class="stgl" cluster_identificador="${clustC.data.cluster_identifier}">${clustC.data.cluster_name}</li>
                                                <span class="flex v-ct" style="padding-bottom: 0.1rem;padding-left: 0.5rem;">
                                                    <span>Cluster de venda</span>
                                                    <input type="radio" name="cluster_venda" identificador="${clustC.data.cluster_identifier}" style="padding-left: 0.2rem;">
                                                </span>
                                           </div>`);
        });
        if(selectedClusters){
            $(`#clustersBranch input:radio[identificador=${branch.selected.espaco_vender}]`).prop("checked", true);
            branch.selected.branch_clusters.forEach((clu) =>{
                clustersBranch.find(`li[cluster_identificador=${clu}]`).addClass("active");
            });
        }
        if(clusterCaminho.length === 1)
            $("#clustersBranch input:radio").prop("checked", true);
    }

};

branch.init();


$('#sys_config').on('click', '.control-access .tit', function () {
    $(this).parent().toggleClass('opened');
});

$('#sys_config').on('click', '.control-access .xcheck li', function () {
    $(this).toggleClass("active");
    let mainSelect = $(this).closest('.xcheck').find('.fkcheck');
    let li = $(this).parent().children().length;
    let activeLI = $(this).parent().children('li.active').length;
    if(activeLI === 0){
        mainSelect.removeClass('parcial full');
    } else if(activeLI !== li){
        mainSelect.removeClass('full').addClass('parcial');
    } else{
        mainSelect.removeClass('parcial').addClass('full');
    }
});
$('#sys_config').on('click', '.control-access .fkcheck', function () {
    if($(this).hasClass('full')){
        $(this)
            .removeClass('full')
            .closest('.xcheck').find('li').removeClass('active');
    } else{
        $(this)
            .addClass('full')
            .removeClass('parcial')
            .closest('.xcheck').find('li').addClass('active');
    }
});
$("#newBranch").on("click", function () {
     if(branch.selected){
         $("#clustersBranch").empty();
         $("[allMenus]").find(".xcheck.multiple .fkcheck").removeClass("parcial full");
         $("[allMenus]").find("li").removeClass("active");
         $("#xModalCreateBranch input").val("").prop("disabled", false);
         $("#tipo_branch").find("li").removeClass("active");
         branch.selected = null;
     }
     showTarget("xModalCreateBranch", "Adicionar branch")
});
$("[bt_branch]").on("click", function () {
    if(!validation1($("#xModalCreateBranch").find('input:text'))) return;
    if(!isMailValid($("#colaborador_master_email"))){
        xAlert("Branch", "Email incorreto!", "error");
        $("#colaborador_master_email").focus();
        return;
    }
    if ($("[allMenus]").find(".fkcheck.parcial").length === 0 && $("[allMenus]").find(".fkcheck.full").length === 0) {
        xAlert("Branch", "Selecione todos os acessos para o colaborador master!", "info");
        return;
    }
    if($("#clustersBranch").find("li.active").length === 0){
        xAlert("Branch", "Selecione pelo menos um dos clusters", "info");
        return;
    }
    if($("#clustersBranch input:radio:checked").length === 0){
        xAlert("Branch", "Selecione o cluster de venda!", "info");
        return;
    }
    if($("input:radio:checked").closest(".flex.h-sb").find("li.active").length === 0){
        xAlert("Branch", "O cluster de venda escolhido não foi o escolhido como cluster", "error");
        return;
    }

    /*if(branch.list.filter(value => value.data.branch_path === $("#branch_path").find("li.active").attr("path")).length > 0){
        xAlert("Branch", "Já existe um branch com esse caminho!", "error");
        return;
    }*/
    if ($("#xModalCreateBranch").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")) branch.add();
    else branch.edit();
});
$("#listBranches").on("click", ".editar", function () {
    branch.selected = branch.list[$(this).attr("i")].data;
    let allMenus = $("[allMenus]");
    allMenus.find(".xcheck.multiple .fkcheck").removeClass("parcial full");
    allMenus.find("li").removeClass("active");
    $("#tipo_branch, #branch_path").find(`li`).removeClass("active");
    $("#tipo_branch").find(`li[tbranch_id=${branch.selected.branch_tbranch_id}]`).addClass("active");
    $("#tipoBranchDesc").val(branch.selected.tbranch_name);
    $("#branch_path").find(`li[path_formatted='${branch.selected.branch_path.replace("/", "")}']`).addClass("active");
    $("#branch_path").closest(".xselect").find("input").val(branch.selected.branch_path);
    $("#branch_nome").val(branch.selected.branch_name);
    $("#colaborador_master_nome").val(branch.selected.colaborador_nome);
    $("#colaborador_master_email").val(branch.selected.colaborador_email);
    branch.showClustersPath(branch.selected.branch_path, true);
    branch.selected.branch_grants.menu.forEach((m) =>{
        if(allMenus.find(`li[menu_id=${m}]`).length === 0){
            if(allMenus.find(`li[menu_menu_id=${m}]`).length === 0){
                $(`[allMenus] .mainMenu[menu_id=${m}]`).find(`span.fkcheck`).click();
            }
        }
        else $("[allMenus]").find(`li[menu_id=${m}]`).click();
    });
    showTarget("xModalCreateBranch", "Editar branch");
});
$("#branch_path").on("mousedown", "li", function () {
     if($(this).attr("path") !== undefined){
         branch.showClustersPath($(this).attr("path"));
     }
});
