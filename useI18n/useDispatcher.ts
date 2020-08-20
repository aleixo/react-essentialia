import { useContext, useState, useEffect } from "react";

import { context } from "./context";
import { II18nState as stateType, II18nContext as contextType } from "../types";

import { Uuid, objects } from "../helpers";

interface IDIspatcher {
  setLanguage(newLanguage: string): void;
  getString(path: string): string;
}

const useDispatcher = (): IDIspatcher => {
  const contextValue = useContext<contextType>(context);

  const dispatchSubscribers = (newState) => {
    Object.keys(contextValue.subscribers).forEach((key: string) => {
      contextValue.subscribers[key]({ ...contextValue.state, ...newState });
    });
  };

  const setLanguage = (newLanguage) => {
    dispatchSubscribers({
      lang: newLanguage,
    });
  };

  const getString = (path) => {
    if (typeof path !== "string") {
      return path;
    }
    return objects.byString(
      contextValue.state.strings[contextValue.state.lang],
      path
    );
  };

  const dispatcher = {
    setLanguage,
    getString,
  };

  return dispatcher;
};

export default useDispatcher;
