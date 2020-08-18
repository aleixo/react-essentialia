import React from "react";
import { colors } from "../types";

export const context = React.createContext({
  state: {
    colors: { default: {} },
    color: {},
    fontScale: 1,
    theme: "default",
  },
  subscribers: {},
});

const Provider = context.Provider;

interface IProvider {
  children: any;
  theme?: string;
  colors: colors;
  fontScale?: number;
  sizes: {};
}

export const ThemeProvider = ({
  children,
  colors = { default: {} },
  fontScale = 1,
  theme = "default",
  sizes = {},
}: IProvider) => {
  console.log("PROviDER ", sizes);
  return (
    <Provider
      value={{
        state: {
          color: colors[theme],
          originalSizes: sizes,
          fontScale,
          colors,
          theme,
          sizes,
        },
        subscribers: {},
      }}
    >
      {children}
    </Provider>
  );
};
