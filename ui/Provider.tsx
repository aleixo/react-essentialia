import React, { useContext } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import context from './context';
import { objects } from '../helpers';
import * as types from './types';

const ProviderContext = context.Provider;

interface ProviderProps {
  children: any;
  colors?: types.colors;
  sizes?: types.sizes;
  layoutThemes?: {
    [key: string]: ViewStyle;
  };
  styleExtensions?: types.styleExtensions;
}

const Provider = ({
  children,
  colors = {},
  sizes = {},
  styleExtensions = {},
  layoutThemes = {},
}: ProviderProps) => {
  const contextValues = useContext(context);
  const newSizes = objects.merge(contextValues.state.sizes, sizes);
  const newColors = objects.merge(contextValues.state.colors, colors);

  // Build native styles based on template given
  const styles = StyleSheet.create(layoutThemes);

  const state = {
    ...contextValues,
    state: {
      ...contextValues.state,
      colors: newColors,
      sizes: newSizes,
    },
  };

  return (
    <ProviderContext value={{ ...state, styles, styleExtensions }}>
      {children}
    </ProviderContext>
  );
};

export default Provider;
