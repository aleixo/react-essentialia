import { useContext, useState, useEffect } from "react";

import { context } from "./context";
import { IThemeState, IThemeContext } from "../types";

import { Uuid } from "../helpers";

type TDispatcher = ({
  theme,
  fontScale,
}?: {
  theme?: string;
  fontScale?: number;
}) => void;

const useTheme = (): [IThemeState, TDispatcher] => {
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

  const dispatcher = ({ theme = "default", fontScale = 1 } = {}): void => {
    const scaledSizes = Object.keys(state.originalSizes).reduce((acc, key) => {
      return {
        ...acc,
        [key]: state.originalSizes[key] * fontScale,
      };
    }, {});
    dispatchSubscribers({
      sizes: scaledSizes,
      color: contextValue.state.colors[theme],
      fontScale,
      theme,
    });
  };

  return [state, dispatcher];
};

export default useTheme;
