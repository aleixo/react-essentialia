import React from "react";

import context from "./context";

import { I18nProvider } from "./useI18n";
import { ThemeProvider } from "./useTheme";
import * as types from "./types";
import { defaultSizes } from "./defaults";
const ProviderContext = context.Provider;

interface ProviderProps {
  children: any;
  // UI
  modifiers?: types.TModifiers;
  fontFamily?: string;
  // Themes
  colors?: types.colors;
  sizes?: types.sizes;
  theme?: string;
  // I18n
  strings?: object;
  initialLang?: string;
}

const Provider = ({
  children,
  fontFamily,
  colors = { default: {} },
  theme,
  initialLang = "",
  sizes = defaultSizes,
  strings = {},
  modifiers,
}: ProviderProps) => {
  return (
    <I18nProvider lang={initialLang} strings={strings}>
      <ThemeProvider colors={colors} sizes={sizes} theme={theme}>
        <ProviderContext
          value={{
            state: {
              fontFamily,
              modifiers,
            },
            subscribers: {},
          }}
        >
          {children}
        </ProviderContext>
      </ThemeProvider>
    </I18nProvider>
  );
};

export default Provider;
