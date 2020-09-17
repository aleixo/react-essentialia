import { useContext } from "react";

import { context as themeContext } from "./useTheme/context";
import { context as i18nContext } from "./useI18n/context";
import { IThemeContext, II18nContext } from "./types";

interface IDispatcher {
  theme({ theme, fontScale }: { theme?: string; fontScale?: number }): void;
  i18n({ newLanguage }: { newLanguage?: string }): void;
}

const useDispatcher = (): IDispatcher => {
  const themecontextValue = useContext<IThemeContext>(themeContext);
  const i18ncontextValue = useContext<II18nContext>(i18nContext);

  const dispatchI18nSubscribers = (newState: any) => {
    console.log("---- ", newState);
    Object.keys(i18ncontextValue.subscribers).forEach((key: string) => {
      i18ncontextValue.subscribers[key]({
        ...i18ncontextValue.state,
        ...newState,
      });
    });
  };

  const dispatchThemeSubscribers = (newState: any) => {
    Object.keys(themecontextValue.subscribers).forEach((key: string) => {
      themecontextValue.subscribers[key]({
        ...themecontextValue.state,
        ...newState,
      });
    });
  };

  const theme = ({ theme = "default", fontScale = 1 } = {}) => {
    const scaledSizes = Object.keys(
      themecontextValue.state.originalSizes
    ).reduce((acc, key) => {
      return {
        ...acc,
        [key]: themecontextValue.state.originalSizes[key] * fontScale,
      };
    }, {});

    dispatchThemeSubscribers({
      sizes: scaledSizes,
      color: themecontextValue.state.colors[theme],
      fontScale,
      theme,
    });
  };

  const i18n = ({ newLanguage }: { newLanguage?: string }) => {
    dispatchI18nSubscribers({
      lang: newLanguage,
    });
  };

  return {
    theme,
    i18n,
  };
};

export default useDispatcher;
