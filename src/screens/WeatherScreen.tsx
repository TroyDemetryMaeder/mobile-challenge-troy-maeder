import React, {useState} from 'react';
import {Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import LocationInput from '../components/LocationInput';
import ServiceToggle from '../components/ServiceToggle';
import WeatherDisplay from '../components/WeatherDisplay';
import {useWeather} from '../hooks/useWeather';
import {OpenMeteoService} from '../services/OpenMeteoService';
import {OpenWeatherMapService} from '../services/OpenWeatherMapService';
import {IWeatherService} from '../services/IWeatherService';
import {colors} from '../theme/colors';

const services: Record<string, IWeatherService> = {
  OpenWeatherMap: new OpenWeatherMapService(),
  'Open-Meteo': new OpenMeteoService(),
};

const serviceNames = Object.keys(services);

/**
 * Screen skeleton wiring up the three components. The state shown here is
 * the bare minimum to make the UI render — extend it (or replace this
 * whole screen) to implement the actual challenge:
 *
 *   - hold the selected service
 *   - validate the location
 *   - fetch weather when the user submits a valid location
 *   - re-fetch automatically when the service is toggled and a location is set
 *   - surface loading / error states
 *
 * You decide where this logic lives (here, a hook, context, etc.).
 */

const WeatherScreen: React.FC = () => {
  const [selectedService, setSelectedService] = useState('OpenWeatherMap');

  const {weather, isLoading, inputError, fetchError, location, setLocation} =
    useWeather(services[selectedService]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.section}>
        <LocationInput
          value={location}
          onChangeText={setLocation}
          onSubmit={() => Keyboard.dismiss()}
          errorText={inputError}
        />
      </View>

      <View style={styles.section}>
        <ServiceToggle
          options={serviceNames}
          selected={selectedService}
          onSelect={setSelectedService}
        />
      </View>

      <View style={styles.section}>
        <WeatherDisplay
          weather={weather}
          loading={isLoading}
          errorText={fetchError}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: 24,
  },
  section: {
    marginBottom: 16,
  },
});

export default WeatherScreen;
