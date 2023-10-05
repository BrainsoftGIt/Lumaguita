
window.version = await new Promise((resolve) => {

    fetch(`${location.origin}/VERSION`).then(function (response) {
        return response.text();
    }).then(function (text) {
        resolve(text)
    });
})

window.vStatus = await new Promise((resolve) => {

    fetch(`${location.origin}/api/cluster/STATUS`).then(function (response) {
        return response.json();
    }).then(function ({dataDesejadaFormatada, cluster_class, diasRestantes}) {
        resolve({dataDesejadaFormatada, cluster_class, diasRestantes})
    });
})

var _version = window.document.getElementById("version");
if (_version) {
    _version.textContent = `v${window.version}`;
    let {dataDesejadaFormatada, cluster_class, diasRestantes} = window.vStatus;
    window.document.getElementById("diasRestantes").className = cluster_class;
    let textRestante = `dia${diasRestantes === 1 ? "" : "s"} restante${diasRestantes === 1 ? "" : "s"}`
    window.document.getElementById("dataDesejadaFormatada").textContent = `${dataDesejadaFormatada}.`;
    window.document.getElementById("diasRestantes").textContent = `${diasRestantes} ${textRestante}`;
}
