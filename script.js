//jquery selector
$("#btn").on("click", function () {
  var input = $("#input").val();
  weather(input);
  $("#input").val("");

  if (!searchHistory.includes(input)) {
    var searchButton = $("<button>")
      .addClass("btn col-12 btn-secondary my-2")
      .text(input);
    $("#history").append(searchButton);
    searchHistory.push(input);
  } else {
    return;
  }
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
});

//jquery selector
$("#history").on("click", function (event) {
  var history = $(event.target).text();
  weather(history);
});

refresh();

function refresh() {
  var local = JSON.parse(localStorage.getItem("search-history")) || [];
  if (local === null) {
    return;
  } else {
    for (var i = 0; i < local.length; i++) {
      var searchButton = $("<button>")
        .addClass("btn col-12 btn-secondary my-2")
        .text(local[i]);
      $("#history").append(searchButton);
    }
  }
}

var searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];
var today = moment().format("M/D/YYYY");

function weather(input) {
  $("#weather").empty();
  var apikey = "c7990a8de2e17434740eaea2a1570d6d";
  var url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    input +
    "&appid=" +
    apikey +
    "&units=imperial";
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var city = $("<h2>")
        .addClass("d-inline-flex fw-bold city pt-2")
        .text(data.name + " " + today + "  ");
      var iconLink =
        "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
      var icon = $("<img>")
        .addClass("align-top pt-2")
        .attr("src", iconLink)
        .attr("style", "height:50px;");
      var temp = $("<p>").text("Temp: " + data.main.temp + " ℉");
      var wind = $("<p>").text("Wind: " + data.wind.speed + " MPH");
      var humidity = $("<p>").text("Humidity: " + data.main.humidity + " %");
      var feels_like = $("<p>").text(
        "Feels Like: " + data.main.feels_like + " ℉"
      );

      $("#weather").append(city, icon, temp, wind, humidity, feels_like);

      var lat = data.coord.lat;
      var lon = data.coord.lon;

      forecast(lat, lon);
    });
}

function forecast(lat, lon) {
  $("#forecast").empty();
  var apikey = "c7990a8de2e17434740eaea2a1570d6d";
  var url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apikey +
    "&units=imperial";
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var uv = $("<p>").text("UV Index: " + data.current.uvi);
      $("#weather").append(uv);

      var fore = $("<h3>").addClass("fw-bold mt-3").text("5-Day Forecast:");
      $("#forecast").append(fore);

      var div = $("<div>").addClass(
        "col-32  d-inline-flex justify-content-between"
      );

      for (var i = 1; i < 6; i++) {
        var temp = $("<p>")
          .addClass("text-white px-2")
          .text("Temp: " + data.daily[i].temp.day + " ℉");
        var wind = $("<p>")
          .addClass("text-white px-2")
          .text("Wind: " + data.daily[i].wind_speed + " MPH");
        var humidity = $("<p>")
          .addClass("text-white px-2 pb-2")
          .text("Humidity: " + data.daily[i].humidity + " %");
        var feels_like = "<p>"
          .addClass("text-white px-2 pb-2")
          .text("Wind: " + data.daily[i].feels_like + " ℉");
        var iconLink =
          "http://openweathermap.org/img/wn/" +
          data.daily[i].weather[0].icon +
          "@2x.png";
        var icon = $("<img>")
          .attr("src", iconLink)
          .attr("style", "height:30px;");

        var col = $("<div>").addClass("col-6");
        var box = $("<div>").addClass("bg-primary bg-opacity-100");
        var date = moment().add(i, "days").format("M/D/YYYY");
        var date = $("<h5>").addClass("text-white px-2 pt-2").text(date);

        $("#forecast").append(div);
        $(div).append(col);
        $(col).append(box);
        $(box).append(date, icon, temp, wind, humidity, feels_like);
      }
    });
}
