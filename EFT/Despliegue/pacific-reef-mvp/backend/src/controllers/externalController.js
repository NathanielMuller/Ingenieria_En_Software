import { asyncHandler } from '../utils/asyncHandler.js';
import { getCurrentWeather } from '../services/weatherService.js';

export const getWeather = asyncHandler(async (request, response) => {
  const language = request.query.lang === 'en' ? 'en' : 'es';
  const weather = await getCurrentWeather(language);

  response.json({
    success: true,
    data: weather
  });
});