import React, { useContext, useState } from 'react';

import context from './context';
import { Uuid } from '../helpers';
import { StyleSheet, ViewStyle } from 'react-native';
let styles = {};
const createStyle = (style: { [key: string]: ViewStyle }) => {
  const namespace = Uuid();
  const newStyle = StyleSheet.create(style);

  styles[namespace] = newStyle;

  return styles[namespace];
};

export default createStyle;
