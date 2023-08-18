let version = await new Promise((resolve) => {
    fetch(`${location.origin}/VERSION`).then(function (response) {
        return response.text();
    }).then(function (text) {
        resolve(text)
    });
})
window.document.getElementById("version").textContent = `v${version}`