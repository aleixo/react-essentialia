import { useContext, useState, useEffect } from "react";

import { context } from "./context";
import { IThemeState, IThemeContext } from "../types";

import { Uuid } from "../helpers";

type TDispatcher = ({
  theme,
  fontScale,
}: {
  theme?: string;
  fontScale?: number;
}) => void;

const useDispatcher = (): TDispatcher => {
  const contextValue = useContext<IThemeContext>(context);

  const dispatchSubscribers = (newState: any) => {
    Object.keys(contextValue.subscribers).forEach((key: string) => {
      contextValue.subscribers[key]({ ...contextValue.state, ...newState });
    });
  };

  const dispatcher = ({ theme = "default", fontScale = 1 } = {}) => {
    console.log(contextValue);
    const scaledSizes = Object.keys(contextValue.state.originalSizes).reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: contextValue.state.originalSizes[key] * fontScale,
        };
      },
      {}
    );

    dispatchSubscribers({
      sizes: scaledSizes,
      color: contextValue.state.colors[theme],
      fontScale,
      theme,
    });
  };

  return dispatcher;
};

export default useDispatcher;
