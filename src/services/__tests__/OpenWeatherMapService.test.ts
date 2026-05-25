import { mapOpenWeatherMapResponse } from '../OpenWeatherMapService';

const baseResponse = {
  name: 'London',
  main: { temp: 31.19 },
  weather: [{ description: 'clear sky' }],
};

describe('mapOpenWeatherMapResponse', () => {
  it('maps location and source correctly', () => {
    const result = mapOpenWeatherMapResponse(baseResponse);
    expect(result.location).toBe('London');
    expect(result.source).toBe('OpenWeatherMap');
  });

  it('rounds temperature to the nearest whole number', () => {
    expect(mapOpenWeatherMapResponse({ ...baseResponse, main: { ...baseResponse.main, temp: 31.4 } }).temperature).toBe(31);
    expect(mapOpenWeatherMapResponse({ ...baseResponse, main: { ...baseResponse.main, temp: 31.6 } }).temperature).toBe(32);
  });

  it('capitalises the first letter of the condition', () => {
    const result = mapOpenWeatherMapResponse(baseResponse);
    expect(result.condition).toBe('Clear sky');
  });
});
