(() =>{
    const provider = {
        list: [],
        provider_id: null,
        load(){
            $.ajax({
                url: "/api/fornecedores",
                method: "GET",
                contentType: "application/json",
                success(e) {
                    provider.list = [];
                    provider.list = e.provds;
                    if($("[menuAcessos]").find("li.active").attr("link").includes("providers")) provider.showProvidersOwnPage();
                    else provider.showProvidersArticleMenu();
                }
            });
        },
        showProvidersArticleMenu(){
            let listFornecedores = $(".listFornecedores");
            listFornecedores.find("ul").empty();
            if(provider.list.length === 0) listFornecedores.find("ul").addClass("empty");
            else listFornecedores.find("ul").removeClass("empty");

            provider.list.forEach((forn) =>{
                forn = forn.funct_load_fornecedor;
                listFornecedores.find("ul").append(`<li class="flex h-sb v-ct tgl" provider_id="${forn.fornecedor_id}">
                                                                    <p>${forn.fornecedor_nome}</p>
                                                            </li>`);
            });
        },
        showProvidersOwnPage(){
            let listProviders = $("#listProviders");
            listProviders.empty();
            if(provider.list.length === 0) listProviders.find("ul").addClass("empty");
            else listProviders.find("ul").removeClass("empty");

            provider.list.forEach((forn, idx) =>{
                forn = forn.funct_load_fornecedor;
                listProviders.append(`<ul class="flex">
                                                 <li class="flex column">
                                                    <span>Código</span>
                                                    <span>${(forn.fornecedor_code || "N/D")}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span>Nome</span>
                                                    <span>${forn.fornecedor_nome}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span>NIF</span>
                                                    <span>${(forn.fornecedor_nif || "N/D")}</span>
                                                </li>
                                                 <li class="flex column">
                                                    <span>Telefone</span>
                                                    <span>${(forn.fornecedor_contacto || "N/D")}</span>
                                                </li>   
                                                  <li class="flex column">
                                                    <span>Email</span>
                                                    <span>${(forn.fornecedor_email || "N/D")}</span>
                                                </li>                                 
                                                <li class="flex column">
                                                    <span>Endereço</span>
                                                    <pan>${(forn.fornecedor_endereco || "N/D")}</pan>
                                                </li>                              
                                                <li class="flex column">
                                                    <span class="noLabel"></span>
                                                        <span class="flex v-ct">
                                                            <span class="flex v-ct">
                                                            <a tTitle="Editar fornecedor" class="editar" i="${idx}">
                                                              <svg viewBox="0 0 512 512"><path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/><path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/></svg>
                                                          </a>                                              
                                                        </span>
                                                         <a tooltip="Eliminar" flow="top" title="Remover">
                                                            <svg class="delete" viewBox="-40 0 427 427.00131">
                                                                <path
                                                                    d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                                                <path
                                                                    d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                                                <path
                                                                    d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0" />
                                                                <path
                                                                    d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                                            </svg>
                                                        </a>
                                                     </span>
                                                </li>
                                        </ul>`);
            });
        },
        add(){
            $("[bt_fornecedor]").attr("disabled", true).removeClass("loading");
            $.ajax({
                url: "/api/provider",
                method: "POST",
                contentType: "application/json",
                error() { $("[bt_fornecedor]").attr("disabled", false).removeClass("loading") },
                complete() { $("[bt_fornecedor]").attr("disabled", false).removeClass("loading") },
                data: JSON.stringify({ fornecedor_nif: ($("#fornecedor_nif").val() || null),
                    fornecedor_email: ($("#fornecedor_email").val().trim() || null),
                    fornecedor_nome: $("#fornecedor_nome").val().trim(),
                    fornecedor_contacto: ($("#fornecedor_telefone").val() || null),
                    fornecedor_endereco: ($("#fornecedor_endereco").val().trim() || null)}),
                success(e) {
                    $("[bt_fornecedor]").attr("disabled", false).removeClass("loading");
                    if (e.result) {
                        provider.load();
                        $("#xModalProvider").find("input:text").val("");
                        xAlert("Adicionar fornecedor", "Fornecedor registado com sucesso.");
                        $("#xModalProvider").find(".hideTarget").click();
                    }
                    else xAlert("Adicionar fornecedor", e.message, "error");
                }
            });
        },
        edit(){
            $("[bt_fornecedor]").attr("disabled", true).removeClass("loading");
            $.ajax({
                url: "/api/provider",
                method: "POST",
                contentType: "application/json",
                error() { $("[bt_fornecedor]").attr("disabled", false).removeClass("loading") },
                complete() { $("[bt_fornecedor]").attr("disabled", false).removeClass("loading") },
                data: JSON.stringify({ fornecedor_nif: ($("#fornecedor_nif").val() || null),
                    fornecedor_id: provider.selected.fornecedor_id,
                    fornecedor_email: ($("#fornecedor_email").val().trim() || null),
                    fornecedor_nome: $("#fornecedor_nome").val().trim(),
                    fornecedor_contacto: ($("#fornecedor_telefone").val() || null),
                    fornecedor_endereco: ($("#fornecedor_endereco").val().trim() || null)}),
                success(e) {
                    $("[bt_fornecedor]").attr("disabled", false).removeClass("loading");
                    if (e.result) {
                        provider.load();
                        $("#xModalProvider").find("input:text").val("");
                        xAlert("Editar fornecedor", "Fornecedor editado com sucesso.");
                        $("#xModalProvider").find(".hideTarget").click();
                    }
                    else xAlert("Editar fornecedor", e.message, "error");
                }
            });
        },
        remove(){
            $.ajax({
                url: "/api/provider/remove",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({arg_fornecedor_id: provider.provider_id }),
                success(e) {
                    if(e.result){
                        provider.load();
                        xAlert("Remover fornecedor", "Operação efetuada com sucesso!");
                        $("#xModalRemoveProvider").find(".hideTarget").click();
                    }
                    else{
                        xAlert("Remover fornecedor", e.message, "error");
                    }
                }
            });
        }
    };
    provider.load();

    $("[bt_fornecedor]").on("click", function () {
        if(!validation1($("#xModalProvider").find("input:text"))) return;
        if($("#fornecedor_email").val().trim() !== ""){
            if(!isMailValid($("#fornecedor_email"))){
                xAlert("Adicionar fornecedor", "Email inválido!", "error");
                $("#fornecedor_email").focus();
                return;
            }
        }
        if($("#xModalProvider").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")) provider.add();
        else provider.edit();
    });
    $("#listProviders").on("click", ".delete", function (e) {
        e.preventDefault();
         provider.provider_id = $(this).parents("li").attr("provider_id");
         showTarget("xModalRemoveProvider", "Remover fornecedor");
    }).on("click", ".editar", function () {
        provider.selected = provider.list[$(this).attr("i")].funct_load_fornecedor;
        $("#fornecedor_nome").val(provider.selected.fornecedor_nome);
        $("#fornecedor_nif").val((provider.selected.fornecedor_nif || ""));
        $("#fornecedor_telefone").val((provider.selected.fornecedor_contacto || ""));
        $("#fornecedor_email").val((provider.selected.fornecedor_email || ""));
        $("#fornecedor_endereco").val((provider.selected.fornecedor_endereco || ""));
        showTarget("xModalProvider", "Editar fornecedor");
    });
    $("[removeProvider]").on("click", function () {
        provider.remove();
    });
    $("#pesquisarFornecedor").on("keypress", function (e) {
        if(e.which === 13)
             advSearch($(this).val(), $(".listFornecedores"), $(".listFornecedores").find("li"));
    });
    $("[novo_fornecedor]").on("click", function () {
        if(!$("#xModalProvider").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")){
            $("#xModalProvider").find("input:text").val("");
        }
        showTarget("xModalProvider", "Adicionar fornecedor");
    });
})();