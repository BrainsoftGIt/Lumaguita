
function checkSession(){
    $.ajax({
        url: "/api/session",
        method: "GET",
        contentType: "application/json",
        success(e) {
            if(!e.result){
                window.top.location.href = "./index";
            }
        }
    });
}
checkSession();
