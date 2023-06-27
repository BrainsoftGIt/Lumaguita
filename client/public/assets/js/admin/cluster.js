var cluster = {
    list: [],
    tipo_master: 2,
    tipo_filho: 4,
    init(){
        cluster.loadClusters();
        this.loadPeriodsValidation();
    },
    loadPeriodsValidation(){
        $.ajax({
            url: "/api/cluster/validation/period",
            method: "GET",
            contentType: "application/json",
            success(e) {
                let periods_validation = $("#periods_validation");
                let periods_change_validation = $("#periods_change_validation");
                periods_validation.empty();
                e.periods.forEach((period) =>{
                    periods_validation.append(`<li class="tgl" period_id="${period.tperiod_id}">${period.tperiod_desc}</li>`);
                    periods_change_validation.append(`<li class="tgl" period_id="${period.tperiod_id}">${period.tperiod_desc}</li>`);
                });
            }
        });
    },
    loadClusters(){
        $.ajax({
            url: "/api/clusters/load",
            method: "POST",
            contentType: "application/json",
            success(e) {
                let listClusters = $("#listClusters");
                listClusters.empty();
                let tipoDescricao;
                let licenseStructureOption;
                let statusClusterStructureOption;
                let licenseChangeIcon;
                cluster.list = [];
                cluster.list = e.clusters;
                if(cluster.list.length === 0) $("#listClusters").addClass("empty");
                else $("#listClusters").removeClass("empty");

                cluster.list.forEach(function (clus, idx) {
                    clus = clus.data;
                    statusClusterStructureOption = "";
                    licenseStructureOption = "";
                    licenseChangeIcon = "";
                    if(clus.cluster_type === 1) tipoDescricao = "Local";
                    else if(clus.cluster_type === 2) tipoDescricao = "Master";
                    else if(clus.cluster_type === 3) tipoDescricao = "Remoto";
                    else{
                        tipoDescricao = "Filho";
                        licenseChangeIcon = `<a class="editar" title="Editar licença" i="${idx}">
                                                            <svg viewBox="0 0 512 512"><path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/><path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/></svg>
                                                        </a>`;
                        statusClusterStructureOption = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="reload" i="${idx}">
                                                          <path
                                                             d="M13.1459 11.0499L12.9716 9.05752L15.3462 8.84977C14.4471 7.98322 13.2242 7.4503 11.8769 7.4503C9.11547 7.4503 6.87689 9.68888 6.87689 12.4503C6.87689 15.2117 9.11547 17.4503 11.8769 17.4503C13.6977 17.4503 15.2911 16.4771 16.1654 15.0224L18.1682 15.5231C17.0301 17.8487 14.6405 19.4503 11.8769 19.4503C8.0109 19.4503 4.87689 16.3163 4.87689 12.4503C4.87689 8.58431 8.0109 5.4503 11.8769 5.4503C13.8233 5.4503 15.5842 6.24474 16.853 7.52706L16.6078 4.72412L18.6002 4.5498L19.1231 10.527L13.1459 11.0499Z"
                                                                  fill="currentColor"
                                                            />
                                                        </svg>`;
                        licenseStructureOption = `<svg viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="download_license" i="${idx}">
                                        <g>
                                            <g>
                                                <path d="M339.093,246.464c-3.627-7.232-11.008-11.797-19.093-11.797h-42.667V21.333C277.333,9.557,267.797,0,256,0
                                                    s-21.333,9.557-21.333,21.333v213.333H192c-8.085,0-15.467,4.565-19.093,11.797c-3.584,7.232-2.816,15.872,2.027,22.336l64,85.333
                                                    c0.277,0.363,0.704,0.491,1.003,0.832c1.408,1.664,3.072,2.944,4.928,4.117c0.768,0.469,1.365,1.088,2.197,1.472
                                                    c2.731,1.28,5.717,2.112,8.939,2.112s6.208-0.832,8.96-2.112c0.811-0.384,1.429-1.003,2.176-1.472
                                                    c1.856-1.173,3.52-2.453,4.928-4.117c0.277-0.341,0.725-0.469,1.003-0.832l64-85.333
                                                    C341.931,262.336,342.699,253.696,339.093,246.464z" />
                                            </g>
                                        </g>
                                        <g>
                                            <g>
                                                <path d="M490.667,320c-11.797,0-21.333,9.557-21.333,21.333v64c0,35.285-28.715,64-64,64H106.667c-35.285,0-64-28.715-64-64v-64
                                                    c0-11.776-9.536-21.333-21.333-21.333C9.536,320,0,329.557,0,341.333v64C0,464.149,47.851,512,106.667,512h298.667
                                                    C464.149,512,512,464.149,512,405.333v-64C512,329.557,502.464,320,490.667,320z" />
                                            </g>
                                        </g>
                                    </svg>`;
                    }

                    listClusters.append(`<ul class="flex" i="${idx}" style="cursor: pointer;">
                            <li class="flex column">
                                <span>Tipo</span>
                                <span>${tipoDescricao}</span>
                            </li>
                            <li class="flex column">
                                <span>Identificador</span>
                                <span>${(clus.cluster_identifier || "-----")}</span>
                            </li>
                            <li class="flex column">
                                <span>Nome</span>
                                <span>${(clus.cluster_name || "-----")}</span>
                            </li>
                            <li class="flex column">
                                <span>Qtd. vida</span>
                                <span>${(clus.cluster_licenselife || "-----")}</span>
                            </li>
                             <li class="flex column">
                                <span>Período de validade</span>
                                <span>${(clus.tperiod_desc || "-----")}</span>
                            </li>
                             <li class="flex column">
                                <span>Caminho</span>
                               <span>${(clus.cluster_path || "------")}</span>
                            </li>     
                             <li class="flex column">
                                <span>Sequência</span>
                               <span>${clus.cluster_sequence}</span>
                            </li>  
                              <li class="flex column">
                                <span>Versão</span>
                               <span>${clus.cluster_version}</span>
                            </li>     
                            <li class="flex column">
                                <span class="noLabel"></span>                        
                                <span class="flex v-ct">
                                    ${licenseStructureOption}
                                    ${statusClusterStructureOption}                                                                       
                                    ${licenseChangeIcon}                                                                       
                                </span>
                            </li>                       
                        </ul>`);
                });
            }
        });
    },
    get selectedGrants(){
        let revisions = [];
        $("#cluster_revision").find("li.active").each(function () {
            revisions.push($(this).attr("grant"));
        });
        return revisions;
    },
    addClusterMaster(){
        $.ajax({
            url: "/api/cluster",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({cluster_grants: [],
                cluster_identifier: $("#cluster_identify").val().trim(),
                cluster_type: $("#tipo_cluster").find("li.active").attr("tipo_id"),
                cluster_api: $("#cluster_api").val().trim(), cluster_domain: $("#cluster_host").val().trim(),
                cluster_port: $("#cluster_port").val().trim()
            }),
            success(e) {
                if(e.result){
                    cluster.loadClusters();
                    branch.loadPaths();
                    $("#cluster_revision").find("li").removeClass("active");
                    xAlert("Cluster", "Cluster registado com sucesso!");
                    $("#xModalCluster").find("input:text").val("").prop("disabled", false);
                    $("#xModalCluster .hideTarget").click();
                }
                else xAlert("Cluster", e.data, "error");
            }
        });
    },
      addClusterChild(){
          $("[bt_cluster]").attr("disabled", true).addClass("loading");
          $.ajax({
              url: "/api/cluster",
              method: "POST",
              contentType: "application/json",
              data: JSON.stringify({cluster_grants: [], cluster_type: this.tipo_filho,
                  cluster_tperiod_id: $("#periods_validation").find("li.active").attr("period_id"),
                  cluster_licenselife: $("#cluster_amount_life").val(),
                  cluster_name: $("#cluster_name").val().trim(), cluster_path: $("#cluster_group").val().trim(),
               }),
              error(){$("[bt_cluster]").attr("disabled", false).removeClass("loading")},
              success(e) {
                  $("[bt_cluster]").attr("disabled", false).removeClass("loading");
                    if(e.result){
                        cluster.loadClusters();
                        branch.loadPaths();
                        $("#cluster_revision, #periods_validation").find("li").removeClass("active");
                        xAlert("Cluster", "Cluster registado com sucesso!");
                        $("#xModalCluster").find("input:text").val("").prop("disabled", false);
                        $("#xModalCluster .hideTarget").click();
                    }
                    else xAlert("Cluster", e.data, "error");
              }
          });
      },
      downloadLicense(){
          open("../api/cluster/license/"+cluster.selected.cluster_uid);
          $("#xModalDownloadLicense .hideTarget").click();
      },
    reload(){
        $("[clusterReload]").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/cluster/reload",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({cluster_uid: cluster.selected.cluster_uid}),
            error(){$("[clusterReload]").attr("disabled", false).removeClass("loading")},
            success(e) {
                $("[clusterReload]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    cluster.loadClusters();
                    $("#xModalLinkUnlinkCluster .hideTarget").click();
                     xAlert("Redefinição de cluster", "Operação efetuada com sucesso!");
                }
                else  xAlert("Redefinição de cluster", e.data, "error");
            }
        });
    },
    changeLicense(){
        $("[bt_restore_change_license]").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/cluster/change/license",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({cluster_uid: cluster.selected.cluster_uid,  cluster_tperiod_id: $("#periods_change_validation").find("li.active").attr("period_id"),
                cluster_licenselife: $("#cluster_change_amount_life").val()}),
            error(){$("[bt_restore_change_license]").attr("disabled", false).removeClass("loading")},
            success(e) {
                $("[bt_restore_change_license]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    $("#periods_change_validation").find("li").removeClass("active");
                    $("#cluster_change_amount_life, #period_change_validation_desc").val("");
                    cluster.loadClusters();
                    $("#xModalChangeLicense .hideTarget").click();
                    xAlert("Renovar licença", "Operação efetuada com sucesso!");
                }
                else  xAlert("Renovar licença", e.data, "error");
            }
        });
    }
};
cluster.init();
$("#novoCluster").on("click", function () {
    $("#xModalCluster input").val("");
    $("#clusterReceiveData, #clusterReceiveData").find("li").removeClass("active");
    showTarget("xModalCluster", "Adicionar cluster filho");
});

$("[bt_cluster]").on("click", function () {
    if(!validation1($("#xModalCluster").find("input:text"))) return;
    if($("#periods_validation").find("li.active").length === 0){
        xAlert("Cluster", "Selecione o período de validade!", "info");
        return;
    }
    cluster.addClusterChild();
});
$("#listClusters").on("dblclick", "ul", function () {
    cluster.selected = cluster.list[$(this).attr("i")].data;
    $("#cluster_details_identifier").val( ( cluster.selected.cluster_identifier || "-----"));
    $("#cluster_details_name").val( ( cluster.selected.cluster_name || "-----"));
    $("#cluster_details_path").val( ( cluster.selected.cluster_path || "-----"));
    $("#cluster_details_address").val( ( cluster.selected.cluster_domain || "-----"));
    $("#cluster_details_sequence").val( ( cluster.selected.cluster_sequence || "-----"));
    $("#cluster_details_version").val( ( cluster.selected.cluster_version || "-----"));
    $("#cluster_details_port").val( ( cluster.selected.cluster_port || "-----"));
    $("#cluster_amount_life_details").val( ( cluster.selected.cluster_licenselife || "-----"));
    $("#cluster_amount_life_details").val( ( cluster.selected.cluster_licenselife || "-----"));
    $("#cluster_period_details").val( ( cluster.selected.tperiod_desc || "-----"));
    showTarget("xModalAboutCluster");
}).on("click", ".download_license", function () {
    cluster.selected = cluster.list[$(this).attr("i")].data;
    showTarget("xModalDownloadLicense", "Transferir licença");
}).on("click", ".reload", function () {
    cluster.selected = cluster.list[$(this).attr("i")].data;
     showTarget("xModalLinkUnlinkCluster", "Redefinição de cluster");
}).on("click", ".editar", function () {
    cluster.selected = cluster.list[$(this).attr("i")].data;
    $("#periods_change_validation").find("li").removeClass("active");
    $("#periods_change_validation").find(`li[period_id=${cluster.selected.tperiod_id}]`).addClass("active");
    $("#period_change_validation_desc").val((cluster.selected.tperiod_desc || ""));
    $("#cluster_change_amount_life").val((cluster.selected.cluster_licenselife || ""));
    showTarget("xModalChangeLicense", "Renovar licença");
});
$("[downloadLicense]").on("click", function () {
    cluster.downloadLicense();
});
$("[copyApi]").on("click", function () {
    new Clipboard("[copyApi]");
    xAlert("Cluster", "API do cluster copiado", "info");
    setTimeout(() =>{
        $("#xModalCopyApi").find(".hideTarget").click();
    }, 800);
});
$("[clusterReload]").on("click", function () {
     cluster.reload();
});
$("[bt_restore_change_license]").on("click", function () {
    if(!validation1($("#cluster_change_amount_life"))) return;
    if($("#periods_change_validation").find("li.active").length === 0){
        xAlert("Cluster", "Selecione o período de validade!", "info");
        return;
    }
    cluster.changeLicense();
});