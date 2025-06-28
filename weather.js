const apiKey = "8adda756db2fa1af4ae49ad2cc00a42a";

async function getWeather() {
  const city = document.getElementById("search-input").value.trim();
  if (!city) return;
  fetchWeatherByCity(city);
}

function updateUI(weatherData, uvValue) {
  document.getElementById("weather-card").classList.remove("hidden");
  document.getElementById("city-name").innerText = weatherData.name;
  document.getElementById("temp").innerText = `${Math.round(weatherData.main.temp)}°`;
  document.getElementById("description").innerText = weatherData.weather[0].description;
  document.getElementById("humidity").innerText = weatherData.main.humidity;
  document.getElementById("wind").innerText = weatherData.wind.speed;
  document.getElementById("visibility").innerText = (weatherData.visibility / 1000).toFixed(1);
  document.getElementById("uv").innerText = uvValue;
  document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
}

async function fetchWeatherByCity(city) {
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) {
      alert("City not found!");
      return;
    }

    const lat = weatherData.coord.lat;
    const lon = weatherData.coord.lon;

    const uvRes = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const uvData = await uvRes.json();

    updateUI(weatherData, uvData.value);
  } catch (error) {
    alert("Failed to fetch weather data.");
  }
}

function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const weatherData = await weatherRes.json();

        const uvRes = await fetch(
          `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        const uvData = await uvRes.json();

        updateUI(weatherData, uvData.value);
        document.getElementById("search-input").value = weatherData.name;
      } catch (error) {
        alert("Unable to get current location weather.");
      }
    }, () => {
      alert("Location access denied.");
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}
