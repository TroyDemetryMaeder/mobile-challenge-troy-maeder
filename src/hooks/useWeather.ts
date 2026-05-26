/**
 * Optional custom hook for fetching weather.
 *
 * You don't have to use a hook here — local state in the screen is fine,
 * Context is fine, a state management library is fine. We left this file
 * empty so you can decide.
 *
 * If you do implement a hook, it might expose something like:
 *   { weather, loading, error, refetch }
 *
 * Delete this file if you don't end up using it.
 *
 */

import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {IWeatherService} from '../services/IWeatherService';
import {WeatherServiceError} from '../services/types';
import {validateLocation} from '../validation/locationValidator';

function toFetchError(
  error: Error | null,
  location: string,
): string | undefined {
  if (!error) {
    return undefined;
  }
  if (error instanceof WeatherServiceError) {
    if (error.code === 'NOT_FOUND') {
      return `Location "${location}" not found.`;
    }
    if (error.code === 'NETWORK') {
      return 'Check your connection.';
    }
    return 'Service unavailable. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

export function useWeather(service: IWeatherService) {
  const [location, setLocation] = useState('');

  const validationResult = validateLocation(location);
  const query = validationResult.valid ? validationResult.value : '';

  const {
    data: weather,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['weather', query, service.name],
    queryFn: () => service.fetchWeather({query}),
    enabled: validationResult.valid,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const inputError =
    location.length > 0 && !validationResult.valid
      ? validationResult.reason
      : undefined;

  return {
    weather: weather ?? null,
    isLoading,
    inputError,
    fetchError: toFetchError(error as Error | null, location),
    location,
    setLocation,
  };
}
