import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';

/**
 * Stub for the service toggle. The starter shows two named options as
 * buttons; feel free to use a switch, segmented control, or anything else.
 */
export interface ServiceToggleProps {
  options: ReadonlyArray<string>;
  selected: string;
  onSelect: (name: string) => void;
}

const ServiceToggle: React.FC<ServiceToggleProps> = ({
  options,
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {options.map(name => {
        const isSelected = name === selected;
        return (
          <Pressable
            key={name}
            onPress={() => onSelect(name)}
            style={[styles.button, isSelected && styles.buttonSelected]}>
            <Text
              style={[styles.label, isSelected && styles.labelSelected]}>
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  label: {
    fontSize: 14,
    color: colors.text,
  },
  labelSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ServiceToggle;
