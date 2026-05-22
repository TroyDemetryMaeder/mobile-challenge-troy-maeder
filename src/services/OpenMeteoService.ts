import {IWeatherService} from './IWeatherService';
import {Location, WeatherData} from './types';

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
export class OpenMeteoService implements IWeatherService {
  readonly name = 'Open-Meteo';

  async fetchWeather(_location: Location): Promise<WeatherData> {
    throw new Error('OpenMeteoService.fetchWeather not implemented');
  }
}
