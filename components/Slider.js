import React from 'react';
import { View, Text, Slider, StyleSheet } from 'react-native';
import { gray } from '../utils/colors';

export default UdaciSlider = ({ value, onChange, step, unit, max }) => (
  <View style={styles.row}>
    <Slider
      style={{ flex: 1 }}
      maximumValue={max}
      minimumValue={0}
      value={value}
      onValueChange={onChange}
      step={step}
    />
    <View style={styles.metricCounter}>
      <Text style={{ fontSize: 24, textAlign: 'center' }}>{value}</Text>
      <Text style={{ fontSize: 10, color: gray }}>{unit}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  metricCounter: {
    width: 85,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
