var postKey = {
    codePost() {
        $(".systatus span").removeClass("on off");
        $.ajax({
            url: "/api/post/key",
            method: "POST",
            contentType: "application/json",
            success(e) {
                $("[posto]").text(e.key);
                $(".systatus span").addClass((e.statusCluster ? "on" : "off"));
            }
        });
    }
}
postKey.codePost();