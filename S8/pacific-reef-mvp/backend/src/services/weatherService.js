import { HttpError } from '../utils/HttpError.js';

const hotelLocation = {
  name: 'Hotel Pacific Reef',
  latitude: -33.0472,
  longitude: -71.6127,
  timezone: 'auto'
};

const weatherCodes = {
  0: { es: 'Despejado', en: 'Clear sky' },
  1: { es: 'Mayormente despejado', en: 'Mainly clear' },
  2: { es: 'Parcialmente nublado', en: 'Partly cloudy' },
  3: { es: 'Nublado', en: 'Overcast' },
  45: { es: 'Neblina', en: 'Fog' },
  48: { es: 'Neblina con escarcha', en: 'Depositing rime fog' },
  51: { es: 'Llovizna ligera', en: 'Light drizzle' },
  53: { es: 'Llovizna moderada', en: 'Moderate drizzle' },
  55: { es: 'Llovizna intensa', en: 'Dense drizzle' },
  61: { es: 'Lluvia ligera', en: 'Light rain' },
  63: { es: 'Lluvia moderada', en: 'Moderate rain' },
  65: { es: 'Lluvia intensa', en: 'Heavy rain' },
  71: { es: 'Nieve ligera', en: 'Light snow' },
  73: { es: 'Nieve moderada', en: 'Moderate snow' },
  75: { es: 'Nieve intensa', en: 'Heavy snow' },
  80: { es: 'Chubascos ligeros', en: 'Light showers' },
  81: { es: 'Chubascos moderados', en: 'Moderate showers' },
  82: { es: 'Chubascos intensos', en: 'Violent showers' },
  95: { es: 'Tormenta', en: 'Thunderstorm' }
};

function resolveWeatherLabel(code, language) {
  const labels = weatherCodes[code] || { es: 'Condicion variable', en: 'Variable conditions' };
  return labels[language] || labels.es;
}

export async function getCurrentWeather(language = 'es') {
  const query = new URLSearchParams({
    latitude: hotelLocation.latitude,
    longitude: hotelLocation.longitude,
    timezone: hotelLocation.timezone,
    current: 'temperature_2m,wind_speed_10m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min'
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query.toString()}`);

  if (!response.ok) {
    throw new HttpError(502, 'No fue posible consultar el clima externo.');
  }

  const payload = await response.json();
  const current = payload.current || {};
  const daily = payload.daily || {};

  return {
    location: hotelLocation.name,
    temperature: current.temperature_2m,
    windSpeed: current.wind_speed_10m,
    weatherCode: current.weather_code,
    weatherLabel: resolveWeatherLabel(current.weather_code, language),
    maxTemperature: daily.temperature_2m_max?.[0] ?? null,
    minTemperature: daily.temperature_2m_min?.[0] ?? null,
    fetchedAt: current.time || new Date().toISOString()
  };
}