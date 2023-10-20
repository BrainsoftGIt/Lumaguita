var serieOperation = {
    tipo: {
        fatura: 1,
        fatura_recibo: 2,
        recibo: 3,
        notaCredito: 4,
        guiaSaida: 5,
        faturaProforma: 6,
        faturaSimplificada: 7,
        notaDebito: 8,
    },
    missing: [],
    loadSerieOperation(series, place="admin"){
        $.ajax({
            url: "/api/efatura/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({place: place, list_type_series: series}),
            success(e) {
                serieOperation.missing = serieOperation.missing = e.series;
            }
        });
    },
};
