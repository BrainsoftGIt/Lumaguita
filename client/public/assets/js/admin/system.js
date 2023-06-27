var currentSystem = {
    type: null,
    get() {
        $.ajax({
            url: "/api/system/type",
            method: "GET",
            contentType: "application/json",
            success(e) {
                currentSystem.type = e.system.currentType;
            }
        });
    }
}
currentSystem.get();
