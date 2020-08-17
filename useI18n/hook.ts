import { useContext, useState, useEffect } from "react";

import { context } from "./context";
import { II18nState as stateType, II18nContext as contextType } from "../types";

import { Uuid, objects } from "../helpers";

interface hookDispatcher {
  setLanguage(newLanguage: string): void;
  getString(path: string): string;
}

const useI18n = (): [stateType, hookDispatcher] => {
  const contextValue = useContext<contextType>(context);

  const [subscriptionId] = useState(Uuid());
  const [state, dispatch] = useState<stateType>(contextValue.state);

  useEffect(() => {
    contextValue.subscribers[subscriptionId] = (newState: stateType) => {
      if (JSON.stringify(state) === JSON.stringify(newState)) {
        return;
      }
      dispatch(newState);
    };

    return () => {
      delete contextValue.subscribers[subscriptionId];
    };
  }, []);

  const dispatchSubscribers = (newState) => {
    Object.keys(contextValue.subscribers).forEach((key: string) => {
      contextValue.subscribers[key]({ ...state, ...newState });
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
    return objects.byString(state.strings[state.lang], path);
  };

  const dispatcher = {
    setLanguage,
    getString,
  };

  return [state, dispatcher];
};

export default useI18n;
