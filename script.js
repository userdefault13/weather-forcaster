$(document).ready(function() {
    // Event listener for the form submission
    $("#weather-form").submit(function(event) {
      event.preventDefault(); // Prevent form submission from refreshing the page
  
      // Get the city input value
      var city = $("#city-input").val().trim();
  
      // Call the function to retrieve weather data
      getWeather(city);
    });
  
    // Function to retrieve weather data
    function getWeather(city) {
      // Your API key from OpenWeatherMap
      var apiKey = "fe252cfb869d01d8dcdbd7718caecdcc";
  
      // Construct the API URL
      var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  
      // Make the API call
      $.ajax({
        url: apiUrl,
        method: "GET",
        dataType: "json",
        success: function(response) {
          // Extract the necessary data from the response
          var cityName = response.name;
          var temperature = response.main.temp;
          var description = response.weather[0].description;
  
          // Update the HTML elements with the weather data
          $("#city-name").text(`City: ${cityName}`);
          $("#temperature").text(`Temperature: ${temperature} K`);
          $("#description").text(`Description: ${description}`);
        },
        error: function(error) {
          console.log("Error:", error);
        }
      });
    }
  });
  