import {mapOpenMeteoResponse, OpenMeteoService} from '../OpenMeteoService';

const baseGeoResponse = {
  results: [{name: 'London', latitude: 51.5085, longitude: -0.1257}],
};

const baseForecastResponse = {
  current: {temperature_2m: 18.5, weathercode: 1},
};

describe('mapOpenMeteoResponse', () => {
  it('maps raw response to WeatherData', () => {
    const result = mapOpenMeteoResponse({
      name: 'London',
      current: {temperature_2m: 18.5, weathercode: 1},
    });
    expect(result).toEqual({
      temperature: 18.5,
      condition: 'Mainly clear',
      location: 'London',
      source: 'Open-Meteo',
    });
  });
});

describe('OpenMeteoService.fetchWeather', () => {
  let service: OpenMeteoService;

  beforeEach(() => {
    service = new OpenMeteoService();
    (global as any).fetch = jest.fn();
  });

  it('returns mapped WeatherData on success', async () => {
    (global as any).fetch
      .mockResolvedValueOnce({ok: true, json: async () => baseGeoResponse})
      .mockResolvedValueOnce({
        ok: true,
        json: async () => baseForecastResponse,
      });

    const result = await service.fetchWeather({query: 'London'});
    expect(result.location).toBe('London');
    expect(result.source).toBe('Open-Meteo');
    expect(result.temperature).toBe(18.5);
    expect(result.condition).toBe('Mainly clear');
  });

  it('throws WeatherServiceError with NOT_FOUND when geocoding returns no results', async () => {
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({results: []}),
    });

    await expect(service.fetchWeather({query: 'xyz'})).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('throws WeatherServiceError with SERVICE_UNAVAILABLE when geocoding fails', async () => {
    (global as any).fetch.mockResolvedValueOnce({ok: false, status: 500});

    await expect(service.fetchWeather({query: 'London'})).rejects.toMatchObject(
      {code: 'SERVICE_UNAVAILABLE'},
    );
  });

  it('throws WeatherServiceError with SERVICE_UNAVAILABLE when forecast fails', async () => {
    (global as any).fetch
      .mockResolvedValueOnce({ok: true, json: async () => baseGeoResponse})
      .mockResolvedValueOnce({ok: false, status: 500});

    await expect(service.fetchWeather({query: 'London'})).rejects.toMatchObject(
      {code: 'SERVICE_UNAVAILABLE'},
    );
  });

  it('throws WeatherServiceError with NETWORK on fetch failure', async () => {
    (global as any).fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(service.fetchWeather({query: 'London'})).rejects.toMatchObject(
      {code: 'NETWORK'},
    );
  });
});
