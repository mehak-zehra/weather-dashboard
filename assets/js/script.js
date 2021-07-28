var apiKey = "310760b7d84d28ecd4392ab3f7177bc1";
var storedcitiesArr = [];
var fetchCityForcast = function (cityName,lat,lon) {
    var WeatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" +lat + "&lon=" +lon +"&appid=" + apiKey;
    fetch(WeatherApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            var cityTitleEl = document.querySelector(".city-name");
            cityTitleEl.textContent = cityName;

            var tempEl = document.querySelector("#temp");
            tempEl.textContent = data.current.temp;

            var windEl = document.querySelector("#wind");
            windEl.textContent = data.current.wind_speed;

            var humidityEl = document.querySelector("#humidity");
            humidityEl.textContent = data.current.humidity;

            var uvIndexEl = document.querySelector("#uvi");
            uvIndexEl.textContent = data.current.uvi;

            displayfiveDayForecast(data);
        })
};

var displayfiveDayForecast = function(data){

    for(var index = 0; index < 5; index++){


        var myDate = new Date(data.daily[index].dt*1000);
        var dateEl = document.getElementById("date-" +index);
        dateEl.textContent = myDate.toLocaleDateString();

        var weatherForecast = document.getElementById("icon-"+index);
        weatherForecast.textContent = data.daily[index].weather[0].main;

        var tempEl = document.getElementById("temp-" +index);
        tempEl.textContent = data.daily[index].temp.day;


        var windEl = document.getElementById("wind-" +index);
        windEl.textContent = data.daily[index].wind_speed;

        var humidityEl = document.getElementById("humidity-" +index);
        humidityEl.textContent = data.daily[index].humidity;
    } 

}

var fetchCity = function (cityName) {
    var findCityApi = "https://api.openweathermap.org/data/2.5/find?q=" + cityName + "&appid=" + apiKey;
    fetch(findCityApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data.list[0].coord.lat;
            var lon = data.list[0].coord.lon;

            return fetchCityForcast(cityName,lat,lon);

        });
        
}

$(".search-btn").on("click", function () {
    var cityName = document.getElementById("city").value;
    if(cityName === ""){

    }
    else {
        fetchCity(cityName);
        recentlySearchedCities(cityName);
    }
    
});

var recentlySearchedCities= function(cityName) {
    // get stored city array from local storage
    var storedcitiesArr = JSON.parse(localStorage.getItem("city")); // []
    if(!storedcitiesArr){
        storedcitiesArr = [];
    }

    storedcitiesArr.push(cityName);//["London"]
    localStorage.setItem("city", JSON.stringify(storedcitiesArr));//"London"

    displaySearchedCities();
}

var displaySearchedCities = function(){

    var cityHistoryEl = document.querySelector(".city-history");
    cityHistoryEl.innerHTML = "";
    var city = JSON.parse(localStorage.getItem("city"));
    if(!city){
        city = [];
    }
    for(var i = 0; i < city.length; i++){
        var buttonEl = document.createElement("button");
        buttonEl.className = "btn btn-primary btn-lg"
        buttonEl.type = "button"
        buttonEl.innerText = city[i];
        cityHistoryEl.appendChild(buttonEl);
        
    }
}

displaySearchedCities();