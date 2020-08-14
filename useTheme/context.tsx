import React from "react";

import { colors } from "./colors";

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

interface IProvider {
  children: any;
  dark?: boolean;
  colors: object;
  fontScale?: number;
}

export const ThemeProvider = ({
  children,
  colors,
  dark = false,
  fontScale = 1,
}: IProvider) => {
  return (
    <Provider
      value={{
        state: {
          dark: dark,
          colors: colors.light,
          fontScale: fontScale,
        },
        subscribers: {},
      }}
    >
      {children}
    </Provider>
  );
};
