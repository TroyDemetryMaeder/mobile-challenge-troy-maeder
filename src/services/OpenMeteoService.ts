import { IWeatherService } from './IWeatherService';
import { Location, WeatherData } from './types';

/**
 * Weather service backed by Open-Meteo (https://open-meteo.com/).
 * No API key required.
 *
 * TODO: Implement fetchWeather.
 *
 * Hints (not requirements):
 *   - Open-Meteo separates geocoding and forecast endpoints; you'll likely
 *     need to call the geocoding endpoint first to turn a place name into
 *     coordinates, then call the forecast endpoint.
 *   - https://open-meteo.com/en/docs/geocoding-api
 *   - https://open-meteo.com/en/docs
 *   - Map weather codes to a human-readable condition string yourself, or
 *     pick whichever fields make sense. Don't over-engineer this.
 */
const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export function weatherCodeToCondition(code: number): string {
  return WEATHER_CODES[code] ?? 'Unknown';
}

export class OpenMeteoService implements IWeatherService {
  readonly name = 'Open-Meteo';

  async fetchWeather(_location: Location): Promise<WeatherData> {
    throw new Error('OpenMeteoService.fetchWeather not implemented');
  }
}
