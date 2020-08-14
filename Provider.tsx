import React, { useContext } from "react";

import context from "./context";
import { objects } from "./helpers";
import { I18nProvider } from "./useI18n";

import * as types from "./types";

const ProviderContext = context.Provider;
interface ProviderProps {
  children: any;
  // UI
  styleExtensions?: types.styleExtensions;
  // Themes
  colors?: types.colors;
  sizes?: types.sizes;
  // I18n
  strings?: object;
  initialLang: string;
}

const Provider = ({
  children,
  colors = {},
  sizes = {},
  styleExtensions = {},
  strings = {},
  initialLang,
}: ProviderProps) => {
  const contextValues = useContext(context);
  const newSizes = objects.merge(contextValues.state.sizes, sizes);
  const newColors = objects.merge(contextValues.state.colors, colors);

  // Build native styles based on template given
  const state = {
    ...contextValues,
    state: {
      ...contextValues.state,
      colors: newColors,
      sizes: newSizes,
    },
  };

  return (
    <I18nProvider lang={initialLang} strings={strings}>
      <ProviderContext value={{ ...state, styleExtensions }}>
        {children}
      </ProviderContext>
    </I18nProvider>
  );
};

export default Provider;
