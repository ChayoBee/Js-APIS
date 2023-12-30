const endpoint = "https://mindicador.cl/api/";
let myChart = null;

async function getMonedas(url){
    try {
        const resp = await fetch(url);
        const {dolar, uf, euro} = await resp.json();
        return [dolar,uf,euro];
    } catch (error) {
        window.alert('¡Uy, algo salió mal!');
    }
};

async function renderResult(url) {
    try {
        const selector = document.getElementById('conversor')
        const monedas = await getMonedas(url);
        
        monedas.forEach((moneda) =>{
            const option = document.createElement('option');
            option.value = moneda['codigo'];
            option.innerText = moneda['nombre'];
            
            selector.appendChild(option);
        });
    } catch (error) {
        window.alert('¡Uy, algo salió mal!');
    };
};

async function inputPeso(url) {
    try {
        const inputPesoChile = document.getElementById('inputPesoChile').value;
       /* const monedas = await getMonedas(url);

        monedas.forEach((moneda) => {
            const resultado = document.createElement('string');
            resultado.value = moneda ['codigo'];
            resultado.innerText = moneda['nombre'];

            inputPesoChile.appendChild(resultado);
        });*/
    } catch (error) {
        window.alert('¡Uy, algo salió mal!');
    };
};

async function monedaSelec(url, moneID) {
    try {
        if (moneID) {
            const moneda = await fetch(`${url}${moneID}`);
            const {serie} = await moneda.json();
            const [{ valor: moneValor }] = serie;
            return moneValor;
        } else {
            alert('Selecciona una moneda');
        }
    } catch (error) {
        window.alert('¡Uy, algo salió mal!');
    };
};

async function getCreatDataChart(url, moneID) {
    const moneda = await fetch(`${url}${moneID}`);
    const {serie} = await moneda.json();

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

document.getElementById('btn').addEventListener('click', async (event) => {
    const optionSelect = document.getElementById('conversor').value;
    const moneValor = await monedaSelec(endpoint, optionSelect);

    const inputPesos =  await inputPeso(endpoint, optionSelect);

    const conversion = (inputPesos / moneValor).toFixed(2);

    //console.log(conversion);
    renderGrafic();
});

renderResult(endpoint);
