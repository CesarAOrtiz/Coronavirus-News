window.addEventListener('DOMContentLoaded', storage, false);

function storage() {
    if (localStorage.getItem('dataCovid')) {
        var data = JSON.parse(localStorage.getItem('dataCovid'))
        var utc = new Date().toJSON().slice(0, 10)
        if (data[0].Date == String(utc)) {
            showAll(data)
        }
    } else {
        callAPI()
    }
}

function callAPI() {
    fetch("https://api.covid19api.com/summary", {
            cache: 'no-cache'
        })
        .then(response => { return response.json() })
        .then(saveResponse)
        .then(document.getElementById("sub-container").innerHTML = "<h2>Cargando...<h2>")
        .then(showAll)
        .catch((err) => { console.log(err) })
}

function saveResponse(response) {
    var data = []
    var iter = 0
    for (let object of response.Countries) {
        data.push({
            Country: object.Country,
            Current_Infected: (object.TotalConfirmed - (object.TotalDeaths + object.TotalRecovered)).toLocaleString("es-MX"),
            Total_Confirmed: object.TotalConfirmed.toLocaleString("es-MX"),
            Total_Deaths: object.TotalDeaths.toLocaleString("es-MX"),
            Total_Recovered: object.TotalRecovered.toLocaleString("es-MX"),
            New_Confirmed: object.NewConfirmed.toLocaleString("es-MX"),
            New_Deaths: object.NewDeaths.toLocaleString("es-MX"),
            New_Recovered: object.NewRecovered.toLocaleString("es-MX"),
            Death_Rate: ((object.TotalDeaths / object.TotalConfirmed) * 100).toFixed(2),
            Recovery_Rate: ((object.TotalRecovered / object.TotalConfirmed) * 100).toFixed(2),
            Date: String(object.Date).slice(0, 10),
            id: iter
        })
        iter++
    }
    localStorage.setItem('dataCovid', JSON.stringify(data))
    return data
}

function showAll(data) {
    table = createBlocks(data);
    document.getElementById("sub-container").innerHTML = table
    document.getElementById('id_Country').value = ''
    activateLinks(data)
}

function activateLinks(data) {
    const objects = document.querySelectorAll(".detail-link")
    for (let object of objects) {
        object.addEventListener("click", (e) => { showDetails(e, data) }, false);
    }

    if (document.getElementById("close")) {
        document.getElementById("close").addEventListener("click", (e) => {
            e.preventDefault()
            document.getElementById('container').style.display = 'none'
        }, false);
    }

    document.getElementById('id_Country').placeholder = 'Search';
    document.getElementById("id_Country").addEventListener("keyup", (e) => { showSearch(e, data) }, false);

    document.getElementById("search").addEventListener("click", (e) => { showSearch(e, data) }, false);

    document.getElementById("index").addEventListener("click", (e) => {
        e.preventDefault()
        showAll(data)
    }, false);
}

function createBlocks(array) {
    let table = "";
    for (let object of array) {
        table += `
    <div class="block">
        <p id="${object.id}" class='detail-link'>${object.Country}</p>
        <ul class="header">
            <li class="header-digits">Total Confirmed</li>
            <li class="header-digits">Total Deaths</li>
            <li class="header-digits">Total Recovered</li>
        </ul>
        <ul>
            <li>${object.Total_Confirmed}</li>
            <li>${object.Total_Deaths}</li>
            <li>${object.Total_Recovered}</li>
        </ul>
    </div>`;
    }
    table += `
    <div id="container" style="display: none;">
        <div id="details">
            <table id="table"></table>
            <a href="#" id="close">X</a>
        </div>
    </div>`
    return table
}

function showSearch(event, data) {
    event.preventDefault();
    let search = document.getElementById("id_Country").value.toLowerCase().trim();
    var results = []
    for (let object of data) {
        if (object.Country.toLowerCase().includes(search)) {
            results.push(object)
        }
    }
    if (results.length > 0) {
        table = createBlocks(results);
    } else {
        table = "<h2>Search Not Found</h2>"
    }
    document.getElementById("sub-container").innerHTML = table
    activateLinks(data)
}

function showDetails(event, data) {
    event.preventDefault();

    object = data[event.currentTarget.id]

    table = `
        <thead>
            <tr>
                <th colspan="2">${object.Country}</th>
            </tr>
            <tr>
                <th colspan="2">${object.Date}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Total Confirmed</td>
                <td class="digits">${object.Total_Confirmed}</td>
            </tr>
            <tr>
                <td>Total Deaths</td>
                <td class="digits">${object.Total_Deaths}</td>
            </tr>
            <tr>
                <td>Total Recovered</td>
                <td class="digits">${object.Total_Recovered}</td>
            </tr>
            <tr>
                <td>New Confirmed</td>
                <td class="digits">${object.New_Confirmed}</td>
            </tr>
            <tr>
                <td>New Deaths</td>
                <td class="digits">${object.New_Deaths}</td>
            </tr>
            <tr>
                <td>New Recovered</td>
                <td class="digits">${object.New_Recovered}</td>
            </tr>
            <tr>
                <td>Death Rate</td>
                <td class="digits">${object.Death_Rate}%</td>
            </tr>
            <tr>
                <td>Recovery Rate</td>
                <td class="digits">${object.Recovery_Rate}%</td>
            </tr>
            <tr>
                <td>Current Infected</td>
                <td class="digits">${object.Current_Infected}</td>
            </tr>
        </tbody>`;
    document.getElementById("table").innerHTML = table;
    document.getElementById("container").style.display = 'block';
}