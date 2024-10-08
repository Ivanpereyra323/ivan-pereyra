
function simuladorCredito() {
    let monto = parseFloat(prompt("Ingrese el monto del crédito:"));
    let tasaInteresAnual = parseFloat(prompt("Ingrese la tasa de interés anual (en %):"));
    let anios = parseInt(prompt("Ingrese el plazo del crédito (en años):"));

    if (isNaN(monto) || isNaN(tasaInteresAnual) || isNaN(anios)) {
        alert("Por favor, ingrese valores numéricos válidos.");
        return;
    }

    let meses = anios * 12;
    let tasaInteresMensual = tasaInteresAnual / 12 / 100;


    let cuotaMensual = (monto * tasaInteresMensual) / (1 - Math.pow(1 + tasaInteresMensual, -meses));

    alert("Monto del crédito: $" + monto.toFixed(2) + "\n" +
        "Tasa de interés anual: " + tasaInteresAnual + "%\n" +
        "Plazo: " + anios + " años\n" +
        "Cuota mensual: $" + cuotaMensual.toFixed(2));

    let saldo = monto;


    for (let mes = 1; mes <= meses; mes++) {
        let interes = saldo * tasaInteresMensual;
        let abonoCapital = cuotaMensual - interes;
        saldo -= abonoCapital;


        alert("Mes " + mes + ": \n" +
            "Pago mensual: $" + cuotaMensual.toFixed(2) + "\n" +
            "Interés: $" + interes.toFixed(2) + "\n" +
            "Abono a capital: $" + abonoCapital.toFixed(2) + "\n" +
            "Saldo restante: $" + saldo.toFixed(2));


        if (saldo <= 0) {
            break;
        }
    }
}

simuladorCredito();
