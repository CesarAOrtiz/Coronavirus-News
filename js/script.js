var countries;

function showIndex() {
    if (document.getElementById("welcome").style.display != "none") {
        document.getElementById("welcome").style.display = "none";
        document.getElementById("main-content").style.display = "block";
        document
            .getElementById("id_Country")
            .removeEventListener("keyup", showIndex, false);
    }
}

const callAPI = async () => {
    try {
        const response = await fetch("https://api.covid19api.com/summary", {
            cache: "no-cache",
        });
        const data = await response.json();
        saveResponse(data);
        showAll();
        activateLinks();
    } catch (error) {
        document.getElementById("not-found").style.display = "block";
    }
};

function saveResponse(response) {
    var data = [];
    response.Countries.forEach((object, index) => {
        data.push({
            Total_Confirmed: object.TotalConfirmed.toLocaleString("es-MX"),
            Total_Deaths: object.TotalDeaths.toLocaleString("es-MX"),
            Total_Recovered: object.TotalRecovered.toLocaleString("es-MX"),
            Country: object.Country,
            Current_Infected: (
                object.TotalConfirmed -
                (object.TotalDeaths + object.TotalRecovered)
            ).toLocaleString("es-MX"),
            New_Confirmed: object.NewConfirmed.toLocaleString("es-MX"),
            New_Deaths: object.NewDeaths.toLocaleString("es-MX"),
            New_Recovered: object.NewRecovered.toLocaleString("es-MX"),
            Death_Rate: (
                (object.TotalDeaths / object.TotalConfirmed) *
                100
            ).toFixed(2),
            Recovery_Rate: (
                (object.TotalRecovered / object.TotalConfirmed) *
                100
            ).toFixed(2),
            Date: String(object.Date).slice(0, 10),
            id: index,
        });
    });
    countries = data;
}

function showAll() {
    let html = "";
    for (let object of countries) {
        html += `
    <div class="block" id="${object.id}">
        <p class='detail-link background'>${object.Country}</p>
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
    document.getElementById("sub-container").innerHTML = html;
}

function activateLinks() {
    document.querySelectorAll(".detail-link").forEach((object) => {
        object.addEventListener("click", showDetails, false);
    });

    document.getElementById("close").addEventListener(
        "click",
        (e) => {
            e.preventDefault();
            document.getElementById("modal-container").style.display = "none";
        },
        false
    );

    document
        .getElementById("id_Country")
        .addEventListener("keyup", showSearch, false);

    document
        .getElementById("search")
        .addEventListener("click", showSearch, false);

    document.getElementById("index").addEventListener(
        "click",
        (e) => {
            e.preventDefault();
            document.querySelectorAll(".block").forEach((object) => {
                object.style.display = "block";
            });
            document.getElementById("id_Country").value = "";
        },
        false
    );
}

function showSearch(e) {
    e.preventDefault();
    let search = document
        .getElementById("id_Country")
        .value.toLowerCase()
        .trim();
    const coincidense = countries.filter((object) =>
        object.Country.toLowerCase().includes(search)
    );
    const results = coincidense.map((object) => String(object.id));
    document.querySelectorAll(".block").forEach((object) => {
        if (results.includes(object.id)) {
            object.style.display = "block";
        } else {
            object.style.display = "none";
        }
    });
    if (results.length < 1) {
        document.getElementById("not-found").style.display = "block";
    } else {
        document.getElementById("not-found").style.display = "none";
    }
}

function showDetails(e) {
    e.preventDefault();
    object = countries[e.target.parentNode.id];
    document.getElementById("Country").textContent = object.Country;
    document.getElementById("Date").textContent = object.Date;
    document.getElementById("TConfirmed").textContent = object.Total_Confirmed;
    document.getElementById("TDeaths").textContent = object.Total_Deaths;
    document.getElementById("TRecovered").textContent = object.Total_Recovered;
    document.getElementById("NConfirmed").textContent = object.New_Confirmed;
    document.getElementById("NDeaths").textContent = object.New_Deaths;
    document.getElementById("NRecovered").textContent = object.New_Recovered;
    document.getElementById("DeathR").textContent = object.Death_Rate;
    document.getElementById("RecoveryR").textContent = object.Recovery_Rate;
    document.getElementById("CInfected").textContent = object.Current_Infected;
    document.getElementById("modal-container").style.display = "block";
}
