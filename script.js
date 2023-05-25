$(document).ready(function() {
  // API key
  const apiKey = "fe252cfb869d01d8dcdbd7718caecdcc";

  // DOM elements
  const $weatherForm = $("#weather-form");
  const $cityInput = $("#city-input");
  const $searchHistory = $("#history");
  const $currentWeather = $("#current-weather");
  const $forecast = $("#forecast");

  // Event listener for form submission
  $weatherForm.on("submit", function(event) {
    event.preventDefault();
    const city = $cityInput.val().trim();
    if (city !== "") {
      getWeather(city);
      $cityInput.val("");
    }
  });

  // Fetch weather data from OpenWeatherMap API
  function getWeather(city) {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    $.ajax({
      url: currentWeatherURL,
      method: "GET",
      dataType: "json",
      success: function(data) {
        displayCurrentWeather(data);
        saveSearchHistory(city); // Save search history
        renderSearchHistory(); // Update search history display
      },
      error: function() {
        displayError("Unable to retrieve current weather data.");
      }
    });

    $.ajax({
      url: forecastURL,
      method: "GET",
      dataType: "json",
      success: function(data) {
        displayForecast(data);
      },
      error: function() {
        displayError("Unable to retrieve forecast data.");
      }
    });
  }

  // Display current weather
  function displayCurrentWeather(data) {
    const city = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;

    $currentWeather.show();
    $currentWeather.find("#city-name").text(city);
    $currentWeather.find("#temperature").text(`Temperature: ${temperature}°C`);
    $currentWeather.find("#description").text(`Description: ${description}`);
  }

  // Display forecast
  function displayForecast(data) {
    $forecast.empty();

    for (let i = 0; i < data.list.length; i += 8) {
      const forecastData = data.list[i];
      const date = forecastData.dt_txt.split(" ")[0];
      const temperature = forecastData.main.temp;
      const description = forecastData.weather[0].description;

      const $forecastItem = $("<div>", { class: "card" });
      const $forecastCardBody = $("<div>", { class: "card-body" });
      const $forecastDate = $("<h5>", { class: "card-title" }).text(date);
      const $forecastTemperature = $("<p>", { class: "card-text" }).text(`Temperature: ${temperature}°C`);
      const $forecastDescription = $("<p>", { class: "card-text" }).text(`Description: ${description}`);

      $forecastCardBody.append($forecastDate, $forecastTemperature, $forecastDescription);
      $forecastItem.append($forecastCardBody);
      $forecast.append($forecastItem);
    }
  }

  // Display error message
  function displayError(message) {
    $currentWeather.hide();
    $forecast.empty();
    alert(message);
  }

  // Function to save the search history to local storage
  function saveSearchHistory(city) {
    // Get existing search history from local storage
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Add the new city to the search history if it doesn't already exist
    if (!searchHistory.includes(city)) {
      searchHistory.push(city);
    }

    // Save the updated search history to local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  // Function to render the search history in the search history section
  function renderSearchHistory() {
    // Get the search history from local storage
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Clear the existing search history section
    $searchHistory.empty();

    // Render each city in the search history
    for (var i = 0; i < searchHistory.length; i++) {
      var city = searchHistory[i];
      var $historyItem = $("<div>").addClass("list-group-item").text(city);

      // Add a click event listener to the history item
      $historyItem.on("click", function() {
        var cityName = $(this).text();
        searchWeather(cityName);
      });

      // Append the history item to the search history section
      $searchHistory.append($historyItem);
    }
  }

  // Function to search weather for a specific city from the search history
  function searchWeather(city) {
    $cityInput.val(city);
    getWeather(city);
  }

  // Call the renderSearchHistory function to initially display the search history
  renderSearchHistory();
});
