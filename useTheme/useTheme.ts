import { useContext, useState, useEffect } from 'react';

import { context } from './context';
import { state as stateType, context as contextType } from './types';
import { colors } from './colors';

import { Uuid } from 'libs/helpers';

interface hookDispatcher {
  toggleDarkMode(): Function;
  changeFontScale(fontScale: number): Function;
}

const useTheme = (): [stateType, hookDispatcher] => {
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
      contextValue.subscribers[key](newState);
    });
  };

  const toggleDarkMode = () => {
    dispatchSubscribers({
      ...state,
      dark: !state.dark,
      colors: !state.dark ? colors.light : colors.dark,
    });
  };

  const changeFontScale = (fontScale: number) => {
    dispatchSubscribers({
      ...state,
      fontScale,
    });
  };

  const dispatcher = {
    toggleDarkMode,
    changeFontScale,
  };

  return [state, dispatcher];
};

export default useTheme;
