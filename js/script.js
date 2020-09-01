var countries;

function storage() {
    if (localStorage.getItem('dataCovid')) {
        var data = JSON.parse(localStorage.getItem('dataCovid'))
        var utc = new Date().toJSON().slice(0, 10)
        if (data[0].Date == String(utc)) {
            countries = data
            showAll()
        } else {
            callAPI()
        }
    } else {
        callAPI()
    }
}

const callAPI = async() => {
    try {
        const response = await fetch("https://api.covid19api.com/summary", {
            cache: 'no-cache'
        })
        const data = await response.json()
        saveResponse(data)
        showAll()
    } catch (error) {
        console.log(error)
    }
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
    countries = data
    localStorage.setItem('dataCovid', JSON.stringify(data))
}

function showAll() {
    table = createBlocks(countries);
    document.getElementById("sub-container").innerHTML = table
    activateLinks()
}

function activateLinks() {
    const objects = document.querySelectorAll(".detail-link")
    for (let object of objects) {
        object.addEventListener("click", showDetails, false);
    }

    document.getElementById("close").addEventListener("click", (e) => {
        e.preventDefault()
        document.getElementById('modal-container').style.display = 'none'
    }, false);


    document.getElementById('id_Country').placeholder = 'Search';
    document.getElementById("id_Country").addEventListener("keyup", showSearch, false);

    document.getElementById("search").addEventListener("click", showSearch, false);

    document.getElementById("index").addEventListener("click", (e) => {
        e.preventDefault()
        const objects = document.querySelectorAll(".block p")
        for (let object of objects) {
            block = object.parentNode.style.display = 'block'
        }
        document.getElementById('id_Country').value = ''
    }, false);
}

function createBlocks(array) {
    let html = "";
    for (let object of array) {
        html += `
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
    </div>`
    }
    return html
}

function showSearch(e) {
    e.preventDefault();
    let search = document.getElementById("id_Country").value.toLowerCase().trim();
    const coincidense = countries.filter(object => object.Country.toLowerCase().includes(search))
    const results = coincidense.map(object => String(object.id))
    const objects = document.querySelectorAll(".block p")
    for (let object of objects) {
        block = object.parentNode
        if (results.includes(object.id)) {
            block.style.display = 'block'
        } else {
            block.style.display = 'none'
        }
    }
    if (results.length == 0) {
        document.getElementById("not-found").style.display = 'block'
    } else { document.getElementById("not-found").style.display = 'none' }
}

function showDetails(e) {
    e.preventDefault();
    object = countries[e.currentTarget.id]
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
        </tbody>`
    document.getElementById("table").innerHTML = table
    document.getElementById("modal-container").style.display = 'block';
}