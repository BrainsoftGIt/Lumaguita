(() =>{
    const license = {
        loadLicense(){
            let formData = new FormData();
            formData.append("file",  $("#license")[0].files[0]);
            $("#license").val("");
            xAlert("Carregar licença", "A verificar licença ....", "info");
            $.ajax({
                url: "/set/load/license",
                method: "POST",
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                dataType: "json",
                data: formData,
                success(e) {
                    $("body").removeClass("loading");
                    if(e.result){
                        xAlert("Carregar licença", "Licença validada com sucesso!");
                        postKey.codePost();
                        setTimeout(()=>{
                            location.href = "./index";
                        }, 2000)
                    }
                    else xAlert("Carregar licença", e.data, "error");
                }
            });
        }
    };

    $("#loadLicense").on("click", function () {
        if($("header").length === 0)
            $("#license").click();
    });
    $("#license").on("change", function () {
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) return;
        if (this.files.length === 0) return;

        let file = this.files[0];
        let reader = new FileReader();
        reader.onload = function (e) {
            license.loadLicense();
        };
        reader.readAsDataURL(file);
    });
})();
