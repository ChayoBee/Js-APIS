const inputCLP = document.getElementById('inputPesoChile');
const selector = document.getElementById('conversor');
const btn = document.getElementById('btn');
const answer = document.getElementById('answer');

const endpoint = "https://mindicador.cl/api";
let myChart = null;

//------------------------------------------------------------
selector.addEventListener('change', monedaSelec);
btn.addEventListener('click', btnConversor);

inputCLP.addEventListener('input', function(){
    if (this.value.length > 9){
        this.value = this.value.slice(0.9);
    };
});
//------------------------------------------------------------

//Obtener datos y filtro monedas

async function getMonedas(url){
    try {
        const resp = await fetch(url);
        const {dolar, uf, euro} = await resp.json();
        return [dolar, uf, euro];
    } catch (error) {
        window.alert('¡Uy, algo salió mal!');
    }
};

//Render Opciones

async function renderResult(url) {
    try {
        const monedas = await getMonedas(url);
        
        monedas.forEach((moneda) =>{
            const option = document.createElement('option');
            option.value = moneda.codigo;
            option.innerText = moneda.nombre;
            
            selector.appendChild(option);
        });
    } catch (error) {
        window.alert('¡Uy, algo salió mal!');
    };
};

//Consultar API moneda seleccionada

async function monedaSelec() {
    let selectCoin = selector.value;
    let selectURL = `${endpoint}/${selectCoin}`;
    try {
        const resp = await fetch(selectURL);
        const data = await resp.json();
        return data;
    } catch (error) {
        window.alert('Por favor, elije una moneda a convertir');
    };
};

// Función del Botón

async function btnConversor(){
    try {
        if (selector.value != '0'){
            const valorCLP = parseInt(inputCLP.value); //Valor del input
            const selectCoin = await monedaSelec(); //Datos de la moneda seleccionada
            const selectValor = selectCoin.serie[0].valor; //Valor de la moneda seleccionada
            
            if (valorCLP > 0){
                const conversion = (valorCLP / selectValor).toFixed(2);
                answer.innerText = `${selectCoin.codigo === 'euro' ? '€' : '$'} ${conversion}`;
                renderGrafic();
            } else {
                window.alert('Ingresa un número válido');
            };
        };
    } catch (error) {
        window.alert('¡Uy, algo salió mal!');
    };
};

//-------------------------------------------------------------

//Grafico

//Consigue los datos de la API

async function getCreatDataChart() {
    const selectCoin = await monedaSelec();
    const dataResp = await selectCoin.json();
    
    console.log(dataResp);
    const labels = serie.map(({fecha}) => {
        return fecha;
    });

    const data = serie.map(({valor}) => {
        return valor;
    });

    const datasets = [{
        label: 'Precio últimos días',
        borderColor: 'rgb(255, 99, 132)',
        data,
    }];
    return { labels, datasets};
    
};

// Renderiza la gráfica

async function renderGrafic(){
    const optionSelect =document.getElementById('conversor').value;

    const data = await getCreatDataChart(endpoint, optionSelect);
    const config = {
        type: 'line',
        data,
    };

    const canvas = document.getElementById('myChart');
    canvas.style.backgroundColor = 'white';

    if (myChart) {
        myChart.destroy();
    };

    myChart = new Chart(canvas, config);
};

renderResult(endpoint);
