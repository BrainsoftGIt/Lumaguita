
function checkSession(){
    $.ajax({
        url: "/api/session",
        method: "GET",
        contentType: "application/json",
        success(e) {
            if(!e.result){
                location.href = "index.html";
            }
        }
    });
}
checkSession();