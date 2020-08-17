import { useContext, useState, useEffect } from "react";

import { context } from "./context";
import { IThemeState, IThemeContext } from "../types";

import { Uuid } from "../helpers";

interface IHookDispatcher {
  toggleTheme(theme: string): void;
  changeFontScale(fontScale: number): void;
}

const useTheme = (): [IThemeState, IHookDispatcher] => {
  const contextValue = useContext<IThemeContext>(context);
  const [subscriptionId] = useState(Uuid());
  const [state, dispatch] = useState<IThemeState>(contextValue.state);

  useEffect(() => {
    contextValue.subscribers[subscriptionId] = (newState: IThemeState) => {
      dispatch(newState);
    };

    return () => {
      delete contextValue.subscribers[subscriptionId];
    };
  }, []);

  const dispatchSubscribers = (newState: any) => {
    Object.keys(contextValue.subscribers).forEach((key: string) => {
      contextValue.subscribers[key]({ ...state, ...newState });
    });
  };

  const toggleTheme = (theme: string) => {
    dispatchSubscribers({
      theme,
      color: contextValue.state.colors[theme],
    });
  };

  const changeFontScale = (fontScale: number) => {
    const scaledSizes = Object.keys(state.originalSizes).reduce((acc, key) => {
      return {
        ...acc,
        [key]: state.originalSizes[key] * fontScale,
      };
    }, {});

    dispatchSubscribers({
      fontScale,
      sizes: scaledSizes,
    });
  };

  const dispatcher = {
    toggleTheme,
    changeFontScale,
  };

  return [state, dispatcher];
};

export default useTheme;
