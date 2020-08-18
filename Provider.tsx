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
  styleExtensions?: types.styleExtensions;
  familyName?: string;
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
  familyName,
  colors = { default: {} },
  theme,
  initialLang = "",
  sizes = defaultSizes,
  styleExtensions = {},
  strings = {},
}: ProviderProps) => {
  console.log("OK OK ", sizes);
  return (
    <I18nProvider lang={initialLang} strings={strings}>
      <ThemeProvider colors={colors} sizes={sizes} theme={theme}>
        <ProviderContext
          value={{
            state: {
              familyName,
              styleExtensions,
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
