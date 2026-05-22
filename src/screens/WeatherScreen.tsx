import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import LocationInput from '../components/LocationInput';
import ServiceToggle from '../components/ServiceToggle';
import WeatherDisplay from '../components/WeatherDisplay';
import {colors} from '../theme/colors';

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
  const [locationText, setLocationText] = useState('');
  const [selectedService, setSelectedService] = useState<string>('Open-Meteo');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.section}>
        <LocationInput
          value={locationText}
          onChangeText={setLocationText}
          onSubmit={() => {
            // TODO: trigger weather fetch
          }}
        />
      </View>

      <View style={styles.section}>
        <ServiceToggle
          options={['Open-Meteo', 'OpenWeatherMap']}
          selected={selectedService}
          onSelect={setSelectedService}
        />
      </View>

      <View style={styles.section}>
        <WeatherDisplay weather={null} />
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
