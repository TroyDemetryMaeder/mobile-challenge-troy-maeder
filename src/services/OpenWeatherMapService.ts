import {OPENWEATHERMAP_API_KEY} from '@env';
import {IWeatherService} from './IWeatherService';
import {Location, WeatherData, WeatherServiceError} from './types';

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
  main: {temp: number};
  weather: Array<{description: string}>;
}

export function mapOpenWeatherMapResponse(
  raw: OpenWeatherMapRawResponse,
): WeatherData {
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

  async fetchWeather(location: Location): Promise<WeatherData> {
    if (!OPENWEATHERMAP_API_KEY) {
      throw new WeatherServiceError(
        'OpenWeatherMap API key is missing',
        'SERVICE_UNAVAILABLE',
      );
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location.query,
    )}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;

    try {
      const response = await fetch(url);

      if (response.status === 404) {
        throw new WeatherServiceError(
          `Location not found: ${location.query}`,
          'NOT_FOUND',
        );
      }

      if (!response.ok) {
        throw new WeatherServiceError(
          'OpenWeatherMap service unavailable',
          'SERVICE_UNAVAILABLE',
        );
      }

      return mapOpenWeatherMapResponse(await response.json());
    } catch (error) {
      if (error instanceof WeatherServiceError) {
        throw error;
      }
      throw new WeatherServiceError('Network request failed', 'NETWORK');
    }
  }
}
