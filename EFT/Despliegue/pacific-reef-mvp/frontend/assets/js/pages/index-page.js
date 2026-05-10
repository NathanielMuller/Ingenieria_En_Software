import { apiRequest } from '../api.js';
import { buildUrl, getLanguage, getSearchContext, setSearchContext } from '../session.js';

const form = document.querySelector('#search-form');
const weatherElements = {
  title: document.querySelector('#weather-title'),
  location: document.querySelector('#weather-location'),
  status: document.querySelector('#weather-status'),
  temperatureLabel: document.querySelector('#weather-temperature-label'),
  temperature: document.querySelector('#weather-temperature'),
  rangeLabel: document.querySelector('#weather-range-label'),
  range: document.querySelector('#weather-range'),
  windLabel: document.querySelector('#weather-wind-label'),
  wind: document.querySelector('#weather-wind')
};

const weatherText = {
  es: {
    title: 'Clima actual',
    loading: 'Consultando...',
    temperatureLabel: 'Temperatura',
    rangeLabel: 'Max / Min',
    windLabel: 'Viento',
    windUnit: 'km/h',
    error: 'Sin datos',
    fallback: 'Servicio externo no disponible'
  },
  en: {
    title: 'Current weather',
    loading: 'Loading...',
    temperatureLabel: 'Temperature',
    rangeLabel: 'High / Low',
    windLabel: 'Wind',
    windUnit: 'km/h',
    error: 'No data',
    fallback: 'External service unavailable'
  }
};

function getWeatherText() {
  return weatherText[getLanguage()] || weatherText.es;
}

async function loadWeather() {
  const text = getWeatherText();
  weatherElements.title.textContent = text.title;
  weatherElements.status.textContent = text.loading;
  weatherElements.temperatureLabel.textContent = text.temperatureLabel;
  weatherElements.rangeLabel.textContent = text.rangeLabel;
  weatherElements.windLabel.textContent = text.windLabel;

  try {
    const weather = await apiRequest(`/external/weather?lang=${getLanguage()}`);
    weatherElements.location.textContent = weather.location;
    weatherElements.status.textContent = weather.weatherLabel;
    weatherElements.temperature.textContent = `${Math.round(weather.temperature)}°C`;
    weatherElements.range.textContent = `${Math.round(weather.maxTemperature)}° / ${Math.round(weather.minTemperature)}°`;
    weatherElements.wind.textContent = `${Math.round(weather.windSpeed)} ${text.windUnit}`;
  } catch (error) {
    weatherElements.status.textContent = text.error;
    weatherElements.temperature.textContent = '--';
    weatherElements.range.textContent = '--';
    weatherElements.wind.textContent = '--';
    weatherElements.location.textContent = text.fallback;
  }
}

if (form) {
  const savedSearch = getSearchContext();
  if (savedSearch) {
    form.checkIn.value = savedSearch.checkIn || form.checkIn.value;
    form.checkOut.value = savedSearch.checkOut || form.checkOut.value;
    form.guests.value = savedSearch.guests || form.guests.value;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const searchContext = {
      checkIn: form.checkIn.value,
      checkOut: form.checkOut.value,
      guests: form.guests.value
    };

    setSearchContext(searchContext);
    window.location.href = buildUrl('/habitaciones.html', searchContext);
  });
}

loadWeather();