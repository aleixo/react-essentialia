import React from 'react';

import { colors } from './colors';

export const context = React.createContext({
  state: {
    dark: false,
    colors: colors.light,
    fontScale: 1,
    subscribers: {},
  },
  subscribers: {},
});

const Provider = context.Provider;
export const ThemeProvider = ({ children }) => {
  return (
    <Provider
      value={{
        state: {
          dark: false,
          colors: colors.light,
          fontScale: 1,
          subscribers: {},
        },
        subscribers: {},
      }}>
      {children}
    </Provider>
  );
};
