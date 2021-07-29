var apiKey = "310760b7d84d28ecd4392ab3f7177bc1";
 
var fetchCityForcast = function (cityName, lat, lon) {
    
    //fetching weather
    var WeatherApi = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    fetch(WeatherApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            var cityTitleEl = document.querySelector(".city-name");
            cityTitleEl.textContent = cityName;
            
            var myDate = new Date(data.current.dt * 1000)
            var dateEl = document.querySelector("#current-date");
            dateEl.textContent = myDate.toDateString();

            var tempEl = document.querySelector("#temp");
            tempEl.textContent = data.current.temp;

            var windEl = document.querySelector("#wind");
            windEl.textContent = data.current.wind_speed;

            var humidityEl = document.querySelector("#humidity");
            humidityEl.textContent = data.current.humidity;

            // set UV Index element
            var uvIndexEl = document.querySelector("#uvi");
            uvIndexEl.textContent = data.current.uvi;

            var uviValue = parseInt(uvIndexEl.textContent);
            if(uviValue >= 0 && uviValue <=2){
                uvIndexEl.className = "pl-3 pr-3 low"
            }
            else if(uviValue >=3 && uviValue <=5 ){
                uvIndexEl.className = "pl-3 pr-3 moderate"
            }
            else if(uviValue >= 6 && uviValue <=7){
                uvIndexEl.className = "pl-3 pr-3 high"
            }
            else if(uviValue >=8) {
                uvIndexEl.className = "pl-3 pr-3 very-high"
            }

            // set main image icon
            var imgEl = document.querySelector(".main-icon-img");
            var weatherCondition = data.current.weather[0].main;
            if (weatherCondition === "Clouds") {
                imgEl.setAttribute('src', "assets/images/cloudy.png");
            }
            else if (weatherCondition === "Clear") {
                imgEl.setAttribute('src', "assets/images/sun.png");
            }
            else if (weatherCondition === "Rain") {
                imgEl.setAttribute('src', "assets/images/rainy.png");
            }

            // set five dat forecast elements
            displayfiveDayForecast(data);
        })
};

var displayfiveDayForecast = function (data) {

    for (var index = 0; index < 5; index++) {

        var myDate = new Date(data.daily[index].dt * 1000);
        var dateEl = document.getElementById("date-" + index);
        dateEl.textContent = myDate.toLocaleDateString();

        var weatherCondition = data.daily[index].weather[0].main;
        var imgEl = document.querySelector(".icon-img-"+index);
        if (weatherCondition === "Clouds") {
            imgEl.setAttribute('src', "assets/images/cloudy.png");
        }
        else if (weatherCondition === "Clear") {
            imgEl.setAttribute('src', "assets/images/sun.png");
        }
        else if (weatherCondition === "Rain") {
            imgEl.setAttribute('src', "assets/images/rainy.png");
        }
        
        var tempEl = document.getElementById("temp-" + index);
        tempEl.textContent = data.daily[index].temp.day;

        var windEl = document.getElementById("wind-" + index);
        windEl.textContent = data.daily[index].wind_speed;

        var humidityEl = document.getElementById("humidity-" + index);
        humidityEl.textContent = data.daily[index].humidity;
    }

}

var fetchCity = function (cityName) {

    //fetching cities
    var findCityApi = "https://api.openweathermap.org/data/2.5/find?q=" + cityName + "&appid=" + apiKey;
    fetch(findCityApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data.list[0].coord.lat;
            var lon = data.list[0].coord.lon;

            return fetchCityForcast(cityName, lat, lon);

        })
        .catch((error) => {
            alert("Unable to find city." +cityName + ". An example of a city is 'San Diego'");
        });
}

$(".search-btn").on("click", function () {
    var cityName = document.getElementById("city").value;
    if (cityName === "") {

    }
    else {
        fetchCity(cityName);
        recentlySearchedCities(cityName);
    }
});

var recentlySearchedCities = function (cityName) {
    // get stored city array from local storage
    var storedcitiesArr = JSON.parse(localStorage.getItem("city")); // []
    if (!storedcitiesArr) {
        storedcitiesArr = [];
    }

    storedcitiesArr.push(cityName);//["London"]
    localStorage.setItem("city", JSON.stringify(storedcitiesArr));//"London"

    displaySearchedCities();
}

var displaySearchedCities = function () {

    var cityHistoryEl = document.querySelector(".city-history");
    cityHistoryEl.innerHTML = "";
    var city = JSON.parse(localStorage.getItem("city"));
    if (!city) {
        city = [];
    }
    for (var i = city.length - 1; i >= 0; i--) {
        var buttonEl = document.createElement("button");
        buttonEl.className = "btn btn-info btn-lg history-btn mt-3 "
        buttonEl.type = "button"
        buttonEl.innerText = city[i];

        buttonEl.addEventListener("click", function () {
            document.getElementById("city").value = this.innerText;
            fetchCity(document.getElementById("city").value);
        });

        cityHistoryEl.appendChild(buttonEl);
    }
}

// display old searched cities on page load
displaySearchedCities();