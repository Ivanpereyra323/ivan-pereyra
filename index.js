

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
        mostrarMensajeError("Por favor, ingrese valores numéricos válidos.");
        return null;
    }

    return { monto, tasaInteresAnual, anios };
}


function inicializarCredito(monto, tasa, anios) {
    credito = { monto, tasaInteresAnual: tasa, anios, saldo: monto };
    localStorage.setItem('credito', JSON.stringify(credito));
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


function mostrarMensajeError(mensaje) {
    document.getElementById('resultado').innerHTML = `<p style="color: red;">${mensaje}</p>`;
}

function registrarPago(mes, cuotaMensual, interes, abonoCapital, saldo) {
    const pago = { mes, cuotaMensual, interes, abonoCapital, saldo };
    pagos.push(pago);
    localStorage.setItem('pagos', JSON.stringify(pagos));
}


function simuladorCredito() {

    let entradas = capturarEntradas();
    if (!entradas) return;

    let { monto, tasaInteresAnual, anios } = entradas;
    inicializarCredito(monto, tasaInteresAnual, anios);

    let { cuotaMensual, meses, tasaInteresMensual } = calcularCuotaMensual(monto, tasaInteresAnual, anios);
    mostrarResultadosIniciales(monto, tasaInteresAnual, anios, cuotaMensual);


    let saldo = monto;
    document.getElementById('resultado').innerHTML += "<h2>Detalle de pagos mensuales:</h2>";
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

        if (saldo <= 0) break;
    }
}

function buscarPagosConSaldoMenor(valor) {
    let pagosConSaldoMenor = pagos.filter(pago => pago.saldo < valor);
    console.log("Pagos con saldo menor a " + valor + ":", pagosConSaldoMenor);
}


window.onload = function () {
    if (localStorage.getItem('credito')) {
        credito = JSON.parse(localStorage.getItem('credito'));
    }
    if (localStorage.getItem('pagos')) {
        pagos = JSON.parse(localStorage.getItem('pagos'));

        pagos.forEach(pago => {
            document.getElementById('resultado').innerHTML += `
                <p>Mes ${pago.mes}: Pago mensual: $${pago.cuotaMensual.toFixed(2)}, 
                Interés: $${pago.interes.toFixed(2)}, 
                Abono a capital: $${pago.abonoCapital.toFixed(2)}, 
                Saldo restante: $${pago.saldo.toFixed(2)}</p>
            `;
        });
    }
}
