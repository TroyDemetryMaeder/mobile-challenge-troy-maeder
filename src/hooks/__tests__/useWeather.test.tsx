import React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useWeather} from '../useWeather';
import {IWeatherService} from '../../services/IWeatherService';
import {WeatherServiceError} from '../../services/types';

const mockWeather = {
  temperature: 20,
  condition: 'Sunny',
  location: 'London',
  source: 'MockService',
};

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false, gcTime: 0}},
  });
  return ({children}: {children: React.ReactNode}) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function makeMockService(
  overrides?: Partial<IWeatherService>,
): IWeatherService {
  return {
    name: 'MockService',
    fetchWeather: jest.fn().mockResolvedValue(mockWeather),
    ...overrides,
  };
}

describe('useWeather', () => {
  it('returns null weather and no errors before a location is entered', () => {
    const {result} = renderHook(() => useWeather(makeMockService()), {
      wrapper: makeWrapper(),
    });
    expect(result.current.weather).toBeNull();
    expect(result.current.inputError).toBeUndefined();
    expect(result.current.fetchError).toBeUndefined();
  });

  it('shows inputError for a location that is too short', async () => {
    const {result} = renderHook(() => useWeather(makeMockService()), {
      wrapper: makeWrapper(),
    });
    await act(async () => result.current.setLocation('x'));
    await waitFor(() => expect(result.current.inputError).toBeDefined());
  });

  it('fetches weather for a valid location', async () => {
    const service = makeMockService();
    const {result} = renderHook(() => useWeather(service), {
      wrapper: makeWrapper(),
    });
    await act(async () => result.current.setLocation('London'));
    await waitFor(() => expect(result.current.weather).toEqual(mockWeather));
    expect(service.fetchWeather).toHaveBeenCalledWith({query: 'London'});
  });

  it.each([
    [
      'NOT_FOUND',
      new WeatherServiceError('not found', 'NOT_FOUND'),
      'Location "London" not found.',
    ],
    [
      'NETWORK',
      new WeatherServiceError('network error', 'NETWORK'),
      'Check your connection.',
    ],
    [
      'SERVICE_UNAVAILABLE',
      new WeatherServiceError('unavailable', 'SERVICE_UNAVAILABLE'),
      'Service unavailable. Please try again.',
    ],
    [
      'unexpected error',
      new Error('unexpected'),
      'Something went wrong. Please try again.',
    ],
  ])(
    'maps %s to the correct fetchError message',
    async (_, error, expected) => {
      const service = makeMockService({
        fetchWeather: jest.fn().mockRejectedValue(error),
      });
      const {result} = renderHook(() => useWeather(service), {
        wrapper: makeWrapper(),
      });
      await act(async () => result.current.setLocation('London'));
      await waitFor(() => expect(result.current.fetchError).toBe(expected));
    },
  );
});
