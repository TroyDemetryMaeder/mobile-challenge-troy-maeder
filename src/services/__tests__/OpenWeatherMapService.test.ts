import {
  mapOpenWeatherMapResponse,
  OpenWeatherMapService,
} from '../OpenWeatherMapService';

jest.mock('@env', () => ({OPENWEATHERMAP_API_KEY: 'test-key'}), {
  virtual: true,
});

const baseResponse = {
  name: 'London',
  main: {temp: 31.19},
  weather: [{description: 'clear sky'}],
};

describe('mapOpenWeatherMapResponse', () => {
  it('maps location and source correctly', () => {
    const result = mapOpenWeatherMapResponse(baseResponse);
    expect(result.location).toBe('London');
    expect(result.source).toBe('OpenWeatherMap');
  });

  it('rounds temperature to the nearest whole number', () => {
    expect(
      mapOpenWeatherMapResponse({
        ...baseResponse,
        main: {...baseResponse.main, temp: 31.4},
      }).temperature,
    ).toBe(31);
    expect(
      mapOpenWeatherMapResponse({
        ...baseResponse,
        main: {...baseResponse.main, temp: 31.6},
      }).temperature,
    ).toBe(32);
  });

  it('capitalises the first letter of the condition', () => {
    const result = mapOpenWeatherMapResponse(baseResponse);
    expect(result.condition).toBe('Clear sky');
  });
});

describe('OpenWeatherMapService.fetchWeather', () => {
  let service: OpenWeatherMapService;

  beforeEach(() => {
    service = new OpenWeatherMapService();
    (global as any).fetch = jest.fn();
  });

  it('returns mapped WeatherData on success', async () => {
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => baseResponse,
    });

    const result = await service.fetchWeather({query: 'London'});
    expect(result.location).toBe('London');
    expect(result.source).toBe('OpenWeatherMap');
    expect(result.temperature).toBe(31);
  });

  it('throws WeatherServiceError with NOT_FOUND on 404', async () => {
    (global as any).fetch.mockResolvedValueOnce({ok: false, status: 404});

    await expect(service.fetchWeather({query: 'xyz'})).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('throws WeatherServiceError with NETWORK on fetch failure', async () => {
    (global as any).fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(service.fetchWeather({query: 'London'})).rejects.toMatchObject(
      {code: 'NETWORK'},
    );
  });

  it('throws WeatherServiceError with SERVICE_UNAVAILABLE on 500', async () => {
    (global as any).fetch.mockResolvedValueOnce({ok: false, status: 500});

    await expect(service.fetchWeather({query: 'London'})).rejects.toMatchObject(
      {code: 'SERVICE_UNAVAILABLE'},
    );
  });
});
