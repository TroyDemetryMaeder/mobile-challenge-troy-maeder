import { IWeatherService } from './IWeatherService';
import { Location, WeatherData } from './types';

/**
 * Weather service backed by OpenWeatherMap (https://openweathermap.org/).
 * Requires a free API key — put it in .env as OPENWEATHERMAP_API_KEY.
 *
 * TODO: Implement fetchWeather.
 *
 * Hints (not requirements):
 *   - The "Current Weather Data" endpoint accepts a `q=<city>` parameter
 *     directly, so you may not need a separate geocoding step.
 *   - https://openweathermap.org/current
 *   - Read the API key from @env via react-native-dotenv:
 *       import {OPENWEATHERMAP_API_KEY} from '@env';
 *   - Decide what to do if the key is missing — fail loudly is usually
 *     better than failing silently.
 */

interface OpenWeatherMapRawResponse {
  name: string;
  main: { temp: number };
  weather: Array<{ description: string }>;
}

export function mapOpenWeatherMapResponse(raw: OpenWeatherMapRawResponse): WeatherData {
  const description = raw.weather[0].description;
  return {
    temperature: Math.round(raw.main.temp),
    condition: description.charAt(0).toUpperCase() + description.slice(1),
    location: raw.name,
    source: 'OpenWeatherMap',
  };
}

export class OpenWeatherMapService implements IWeatherService {
  readonly name = 'OpenWeatherMap';

  async fetchWeather(_location: Location): Promise<WeatherData> {
    throw new Error('OpenWeatherMapService.fetchWeather not implemented');
  }
}
