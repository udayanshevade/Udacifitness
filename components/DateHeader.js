import React from 'react';
import { View, Text } from 'react-native';
import { purple } from '../utils/colors';

export default DateHeader = ({ date }) => (
  <Text style={{ color: purple, fontSize: 25 }}>{date}</Text>
);
