window.version = await new Promise((resolve) => {
    fetch(`${location.origin}/VERSION`).then(function (response) {
        return response.text();
    }).then(function (text) {
        resolve(text)
    });
})

let _version = window.document.getElementById("version");
if(_version) {
    _version.textContent = `v${window.version}`;
}
