
let credito = {
    monto: 0,
    tasaInteresAnual: 0,
    anios: 0,
    saldo: 0
};

let pagos = [];


function capturarEntradas() {
    let monto = parseFloat(document.getElementById('monto').value);
    let tasaInteresAnual = parseFloat(document.getElementById('tasa').value);
    let anios = parseInt(document.getElementById('anios').value);

    if (isNaN(monto) || isNaN(tasaInteresAnual) || isNaN(anios)) {
        alert("Por favor, ingrese valores numéricos válidos.");
        return null;
    }

    return { monto, tasaInteresAnual, anios };
}


function inicializarCredito(monto, tasa, anios) {
    credito.monto = monto;
    credito.tasaInteresAnual = tasa;
    credito.anios = anios;
    credito.saldo = monto;
}


function calcularCuotaMensual(monto, tasaInteresAnual, anios) {
    let meses = anios * 12;
    let tasaInteresMensual = tasaInteresAnual / 12 / 100;

    let cuotaMensual = (monto * tasaInteresMensual) / (1 - Math.pow(1 + tasaInteresMensual, -meses));
    return { cuotaMensual, meses, tasaInteresMensual };
}


function mostrarResultadosIniciales(monto, tasaInteresAnual, anios, cuotaMensual) {
    document.getElementById('resultado').innerHTML = `
        <p>Monto del crédito: $${monto.toFixed(2)}</p>
        <p>Tasa de interés anual: ${tasaInteresAnual}%</p>
        <p>Plazo: ${anios} años</p>
        <p>Cuota mensual: $${cuotaMensual.toFixed(2)}</p>
    `;
}


function registrarPago(mes, cuotaMensual, interes, abonoCapital, saldo) {
    pagos.push({
        mes: mes,
        cuotaMensual: cuotaMensual,
        interes: interes,
        abonoCapital: abonoCapital,
        saldo: saldo
    });
}


function simuladorCredito() {
    let entradas = capturarEntradas();
    if (!entradas) return;

    let { monto, tasaInteresAnual, anios } = entradas;
    inicializarCredito(monto, tasaInteresAnual, anios);

    let { cuotaMensual, meses, tasaInteresMensual } = calcularCuotaMensual(monto, tasaInteresAnual, anios);

    mostrarResultadosIniciales(monto, tasaInteresAnual, anios, cuotaMensual);

    let saldo = monto;

    for (let mes = 1; mes <= meses; mes++) {
        let interes = saldo * tasaInteresMensual;
        let abonoCapital = cuotaMensual - interes;
        saldo -= abonoCapital;

        registrarPago(mes, cuotaMensual, interes, abonoCapital, saldo);

        document.getElementById('resultado').innerHTML += `
            <p>Mes ${mes}: Pago mensual: $${cuotaMensual.toFixed(2)}, 
            Interés: $${interes.toFixed(2)}, 
            Abono a capital: $${abonoCapital.toFixed(2)}, 
            Saldo restante: $${saldo.toFixed(2)}</p>
        `;

        if (saldo <= 0) {
            break;
        }
    }
}


function buscarPagosConSaldoMenor(valor) {
    let pagosConSaldoMenor = pagos.filter(pago => pago.saldo < valor);
    console.log(pagosConSaldoMenor);
}
