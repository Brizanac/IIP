function getCryptoData(layoutType = 'list') {

    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=EUR&order=market_cap_desc&per_page=50&page=1&sparkline=false")
        .then((response) => {
            if (!response.ok) {
                alert("No data found.");
                throw new Error("No data found.");
            }
            return response.json();
        })
        .then((data) => this.loadData(data, layoutType))
}

function loadData(data, layoutType) {

    if (layoutType === 'list') {
        let colH = ['', 'Ticker', 'Naziv', 'Trenutna cijena', 'Market Cap', 'Volume', '% Promjena u 24h'];
        let col = ['image', 'symbol', 'name', 'current_price', 'market_cap', 'total_volume', 'price_change_percentage_24h'];
        let colPrice = ['current_price', 'market_cap', 'total_volume'];

        let table = document.createElement("table"); // TABLE
        table.setAttribute('class', 'table  table-dark table-hover');

        let tr = table.insertRow(-1); // TABLE ROW.
        tr.setAttribute('class', 'col');

        for (let i = 0; i < colH.length; i++) {
            let th = document.createElement("th"); // TABLE HEADER.
            th.setAttribute('class', 'col pb-3')
            th.innerHTML = colH[i].toUpperCase();
            tr.appendChild(th);
        }

        for (let i = 0; i < data.length; i++) {
            tr = table.insertRow(-1);
            for (let j = 0; j < col.length; j++) {
                let tabCell = tr.insertCell(-1);
                if (col[j] === 'symbol') {
                    let x = document.createElement('a');
                    x.setAttribute('href', '#charts');
                    x.setAttribute('class', 'nav-link');
                    x.setAttribute('onClick', 'goToPage(event)');
                    x.innerHTML = data[i][col[j]].toUpperCase();
                    tabCell.appendChild(x);
                } else if (col[j] === 'image') {
                    let x = document.createElement("IMG");
                    x.setAttribute("src", data[i][col[j]]);
                    x.setAttribute("width", "25");
                    x.setAttribute("height", "25");
                    x.setAttribute("alt", "coin");
                    tabCell.appendChild(x);
                } else if (col[j] === 'price_change_percentage_24h') {
                    let val = data[i][col[j]].toFixed(2);
                    let x = document.createElement("span");
                    if (val < 0) {
                        x.setAttribute("class", 'text-danger fw-bold');
                    } else if (val > 0) {
                        x.setAttribute("class", 'text-success fw-bold');
                    }
                    x.innerHTML = `${val} %`;
                    tabCell.appendChild(x);

                } else if (colPrice.includes(col[j])) {
                    tabCell.innerHTML = `€ ${data[i][col[j]].toLocaleString()}`;
                } else {
                    tabCell.innerHTML = data[i][col[j]];
                }
            }
        }
        let divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.setAttribute('class', 'container');
        divContainer.appendChild(table);
        document.getElementById('layoutButton').value = 'gridLayout';
        document.getElementById("showDataGrid").setAttribute('class', 'visually-hidden');



    } else if (layoutType === 'grid') {
        let colTwo = ['image', 'symbol', 'name', 'current_price', 'market_cap', 'price_change_percentage_24h'];
        let colPriceTwo = ['current_price'];
        let div = document.createElement("div");
        div.setAttribute('class', 'd-flex flex-wrap  main-ho')

        for (let i = 0; i < data.length; i++) {
            let divChild = document.createElement("div");
            divChild.setAttribute('class', 'card text-dark bg-light  ww p-3 m-7')
            for (let j = 0; j < colTwo.length; j++) {
                if (colTwo[j] === 'symbol') {
                    let x = document.createElement('a');
                    x.setAttribute('href', '#charts');
                    x.setAttribute('class', 'nav-link text-center');
                    x.setAttribute('onClick', 'goToPage(event)');
                    x.innerHTML = data[i][colTwo[j]].toUpperCase();
                    divChild.appendChild(x);
                } else if (colTwo[j] === 'image') {
                    let x = document.createElement("IMG");
                    x.setAttribute("src", data[i][colTwo[j]]);
                    x.setAttribute('class', 'rounded mx-auto d-block')
                    x.setAttribute("width", "25");
                    x.setAttribute("height", "25");
                    x.setAttribute("alt", "coin");
                    divChild.appendChild(x);
                } else if (colTwo[j] === 'price_change_percentage_24h') {
                    let val = data[i][colTwo[j]].toFixed(2);
                    let x = document.createElement("p");
                    if (val < 0) {
                        x.setAttribute("class", 'text-danger fw-bold text-center');
                    } else if (val > 0) {
                        x.setAttribute("class", 'text-success fw-bold text-center');
                    }
                    x.innerHTML = `${val} %`;
                    divChild.appendChild(x);
                } else if (colPriceTwo.includes(colTwo[j])) {
                    let x = document.createElement('p');
                    x.setAttribute('class', 'text-center')
                    x.innerHTML = `€ ${data[i][colTwo[j]].toLocaleString()}`;
                    divChild.appendChild(x);
                }
            }
            div.appendChild(divChild);
        }

        let divContainerTwo = document.getElementById('showDataGrid');
        divContainerTwo.innerHTML = '';
        divContainerTwo.setAttribute('class', 'd-flex m-3 bg-dark');
        divContainerTwo.appendChild(div);
        document.getElementById('layoutButton').value = 'listLayout';
        document.getElementById("showData").setAttribute('class', 'visually-hidden');

    }

}

function changeLayout(event) {
    if (event.target.value === 'gridLayout') {
        getCryptoData('grid');
    } else if (event.target.value === 'listLayout') {
        getCryptoData('list');
    }
}

getCryptoData();

function goToPage(event) {
    let coinVal = `${event.target.innerHTML}EUR`;
    
    document.querySelector(".coin-val").innerHTML = `TradingView Grafovi - ${coinVal}`;

    let obj = new TradingView.widget({
        "width": 980,
        "height": 610,
        "symbol": coinVal,
        "interval": "D",
        "timezone": "Europe/Warsaw",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "withdateranges": true,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_9dff1"
    });
    document.querySelector('.script_content').innerHTML = obj;

    let objTwoA = new TradingView.MediumWidget({
        "symbols": [
            [
                coinVal,
                coinVal
            ]
        ],
        "chartOnly": false,
        "width": 800,
        "height": 450,
        "locale": "en",
        "colorTheme": "dark",
        "gridLineColor": "rgba(240, 243, 250, 0)",
        "trendLineColor": "#2962ff",
        "fontColor": "#787b86",
        "underLineColor": "rgba(41, 98, 255, 0.3)",
        "underLineBottomColor": "rgba(41, 98, 255, 0)",
        "isTransparent": false,
        "autosize": false,
        "container_id": "tradingview_24aac"
    });

    document.querySelector('.script_content_two_a').innerHTML = objTwoA;

    let objTwoBB = `{"interval": "1M", 
                    "width": 450, 
                    "isTransparent": "${false}",
                    "height": 480,
                    "symbol": "${coinVal}",
                    "showIntervalTabs": "${true}",
                    "locale": "en",
                    "colorTheme": "${'dark'}"}`;

    let divChildScript = document.createElement('script');
    divChildScript.setAttribute('type', 'text/javascript');
    divChildScript.setAttribute('src', "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js");
    divChildScript.setAttribute('async', '');
    divChildScript.innerHTML = objTwoBB;
    document.querySelector('.chart_two_b').appendChild(divChildScript);

    scrollingleft();
}

function scrollingleft() {
    let elmnt = document.getElementById("slistrDD");
    elmnt.scrollLeft += 500;
};