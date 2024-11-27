let credito = {
    monto: 0,
    tasaInteresAnual: 0,
    anios: 0,
    saldo: 0
};

let pagos = [];

async function capturarEntradas() {
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
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensaje,
        confirmButtonText: 'Ok'
    });
}

function registrarPago(mes, cuotaMensual, interes, abonoCapital, saldo) {
    const pago = { mes, cuotaMensual, interes, abonoCapital, saldo };
    pagos.push(pago);
    localStorage.setItem('pagos', JSON.stringify(pagos));
}

async function simuladorCredito() {
    pagos = [];  // Reinicia el array antes de comenzar una nueva simulación
    localStorage.removeItem('pagos');  // Borra los pagos previos de localStorage

    let entradas = await capturarEntradas();
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

        if (saldo < 0) saldo = 0;  // Evita valores negativos

        registrarPago(mes, cuotaMensual, interes, abonoCapital, saldo);

        document.getElementById('resultado').innerHTML += `
            <p>Mes ${mes}: Pago mensual: $${cuotaMensual.toFixed(2)}, 
            Interés: $${interes.toFixed(2)}, 
            Abono a capital: $${abonoCapital.toFixed(2)}, 
            Saldo restante: $${saldo.toFixed(2)}</p>
        `;

        if (saldo === 0) break;  // Detenemos si el saldo es 0
    }

    generarGrafico();
}



async function cargarTasas() {
    try {
        const response = await fetch('tasas.json');
        const tasas = await response.json();

        document.getElementById('resultado').innerHTML += `
            <h3>Tasas de interés disponibles:</h3>
            <ul>
                ${tasas.map(tasa => `<li>Plazo: ${tasa.plazo} años - Tasa: ${tasa.tasa}%</li>`).join('')}
            </ul>
        `;
    } catch (error) {
        console.error('Error al cargar tasas:', error);
        mostrarMensajeError('No se pudieron cargar las tasas de interés.');
    }
}

let graficoActual = null;  

function generarGrafico() {
    const ctx = document.getElementById('graficoSaldo').getContext('2d');

    if (graficoActual) {
        graficoActual.destroy();
    }

    if (pagos.length === 0) {
        console.warn('No hay datos para generar el gráfico.');
        return;
    }

    const meses = pagos.map(pago => `Mes ${pago.mes}`);
    const saldos = pagos.map(pago => pago.saldo.toFixed(2));

    graficoActual = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Saldo restante',
                data: saldos,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { enabled: true }
            },
            scales: {
                x: { title: { display: true, text: 'Mes' } },
                y: { title: { display: true, text: 'Saldo ($)' } }
            }
        }
    });
}





window.onload = function () {
    cargarTasas();
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
    generarGrafico();
};
document.getElementById('resetearSimulacion').addEventListener('click', () => {
    localStorage.removeItem('credito');
    localStorage.removeItem('pagos');
    document.getElementById('resultado').innerHTML = '';
    pagos = [];
    Swal.fire({
        icon: 'success',
        title: 'Simulación reiniciada',
        text: 'Ahora puedes ingresar nuevos datos.',
        confirmButtonText: 'Ok'
    });
});



