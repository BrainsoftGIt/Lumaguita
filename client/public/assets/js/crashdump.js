var crashdump = {
    send(){
        $.ajax({
            url : "/api/send/crashdump",
            method: "POST",
            contentType: "application/json",
            success:function (e) {

            }
        });
    }
};

$("[sendCrashDump]").on("click", function () {
    crashdump.send();
});