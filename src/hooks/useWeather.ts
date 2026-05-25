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

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OpenMeteoService } from '../services/OpenMeteoService';
import { OpenWeatherMapService } from '../services/OpenWeatherMapService';
import { IWeatherService } from '../services/IWeatherService';
import { WeatherServiceError } from '../services/types';
import { validateLocation } from '../validation/locationValidator';


const services: Record<string, IWeatherService> = {
  'Open-Meteo': new OpenMeteoService(),
  'OpenWeatherMap': new OpenWeatherMapService(),
};

export const serviceNames = Object.keys(services);

function toFetchError(error: Error | null, location: string): string | undefined {
  if (!error) return undefined;
  if (error instanceof WeatherServiceError) {
    return error.code === 'NOT_FOUND'
      ? `Location "${location}" not found.`
      : 'Service unavailable. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

export function useWeather() {
  const [location, setLocation] = useState('');
  const [selectedService, setSelectedService] = useState('OpenWeatherMap');

  const validationResult = validateLocation(location);
  const query = validationResult.valid ? validationResult.value : '';
  const service = services[selectedService];

  const { data: weather, isLoading, error } = useQuery({
    queryKey: ['weather', query, selectedService],
    queryFn: () => service.fetchWeather({ query }),
    enabled: validationResult.valid,
    retry: false,
  });

  const inputError = location.length > 0 && !validationResult.valid
    ? validationResult.reason
    : undefined;

  return {
    weather: weather ?? null,
    isLoading,
    inputError,
    fetchError: toFetchError(error as Error | null, location),
    location,
    setLocation,
    selectedService,
    setSelectedService,
  };
}