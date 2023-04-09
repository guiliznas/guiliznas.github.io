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
        setForecast({latitude, longitude});
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
              <div class="info-weather full-center" style="flex-direction: row;">
              <img src="${weatherIconUrl}" alt="${descriptionCapitalized}"  title="${descriptionCapitalized}"/> ${tempFormatted}°C | ${city}
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

const setForecast = ({latitude, longitude}) => {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=pt_br&units=metric`)
  .then((r) => r.json())
  .then(r => {
    console.log(r);

    const el = document.createElement('div');
    el.classList.add('card');
    el.style.flexDirection = 'row';
    el.style.gap = '15px';

    const dates = [];

    r.list.forEach(item => {
      const dt = item.dt_txt.split(' ')[0];
      if (!dates.includes(dt)) {
        dates.push(dt);
        // Get day/month from date
        let dtTxt = new Date(item.dt_txt).toLocaleDateString('pt-BR').split('/');
        dtTxt = `${dtTxt[0]}/${dtTxt[1]}`;

        const description = item.weather[0].description;
        const descriptionCapitalized =
          description.charAt(0).toUpperCase() + description.slice(1);
        const temp = item.main.temp;
        const tempFormatted = temp.toFixed(0);
        const weatherIconCode = item.weather[0].icon;
        const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;
  
        const html = `
        <div class="full-center">
        <img src="${weatherIconUrl}" alt="${descriptionCapitalized}" title="${descriptionCapitalized}"/>
        <small>${tempFormatted}ºC</small>
        <small style="color: var(--text-secondary)">${dtTxt}</small>
        </div>
        `;
  
        el.innerHTML += html;
      }
    });


    console.log(el);
    const forecast = document.getElementById('forecast');
    forecast.appendChild(el);
    forecast.style.display = 'flex';
  })
  .catch((error) => {
    console.error(error);
  })
}

window.onload = function () {
  setGreeting();
  setWeather();
};
