import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {colors} from '../theme/colors';

/**
 * Stub for the location input. Wire up state, validation, and submission
 * however you like.
 *
 * You can extend the props, change the shape entirely, or replace this
 * file. The starter assumes nothing about how state flows.
 */
export interface LocationInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  errorText?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChangeText,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder="Enter a location"
        placeholderTextColor={colors.textSecondary}
        autoCorrect={false}
        autoCapitalize="words"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
});

export default LocationInput;
