var apiKey = "310760b7d84d28ecd4392ab3f7177bc1";
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
        console.log(myDate.toLocaleString());

        console.log("Temp:" +data.daily[index].temp.day);
        console.log("Humidity:" +data.daily[index].humidity);
        console.log("Wind:" +data.daily[index].wind_speed);
        console.log("It's going to be: " +data.daily[index].weather[0].main);
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
    fetchCity(cityName);
});

