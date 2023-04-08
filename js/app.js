import { API_KEY } from "./config.js";

const greeting = document.getElementById("greeting");
const weekday = document.getElementById("weekday");
const weather = document.getElementById("weather");
const now = new Date();
const dateNow = now.getHours();

function setGreeting() {
  if (dateNow >= 6 && dateNow < 12) {
    greeting.textContent = "Bom dia!";
  } else if (dateNow >= 12 && dateNow < 18) {
    greeting.textContent = "Boa tarde!";
  } else {
    greeting.textContent = "Boa noite!";
  }

  let day = now.toLocaleDateString("pt-BR", { weekday: "long" }).split("");
  day[0] = day[0].toUpperCase();
  weekday.textContent = day.join("");
}

function setWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=pt_br&units=metric`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.cod === 200) {
              const description = data.weather[0].description;
              const descriptionCapitalized =
                description.charAt(0).toUpperCase() + description.slice(1);
              const temp = data.main.temp;
              const tempFormatted = temp.toFixed(0);
              const city = data.name;
              const weatherIconCode = data.weather[0].icon;
              const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;

              weather.innerHTML = `
              <div class="info-weather">
              <img src="${weatherIconUrl}" alt="${descriptionCapitalized}"/> ${descriptionCapitalized} e temperatura de ${tempFormatted}°C em ${city}
              </div>`;
            } else {
              weather.textContent =
                "Não foi possível obter a previsão do tempo";
            }
          })

          .catch((error) => {
            console.error(error);
            weather.textContent = "Não foi possível obter a previsão do tempo";
          })
          .finally(() => {
            weather.style.display = "flex";
          });
      },
      (error) => {
        console.error(error);
        weather.textContent = "Não foi possível obter a localização";
      }
    );
  } else {
    weather.textContent = "Geolocalização não suportada pelo navegador";
  }
}

window.onload = function () {
  setGreeting();
  setWeather();
};
