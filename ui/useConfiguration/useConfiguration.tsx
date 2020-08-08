import { useEffect, useContext, useState } from 'react';
import context from '../context';
import { Uuid, objects } from '../../helpers';

import * as types from '../types';

interface HookDispatcher {
  setColors(colors: types.colors): void;
  setSizes(sizes: types.sizes): void;
}

const subscriptionId = Uuid();

const useConfiguration = (): [object, HookDispatcher] => {
  const contextValue = useContext(context);
  const [state, dispatcher] = useState(contextValue.state);

  useEffect(() => {
    contextValue.subscribers[subscriptionId] = (newState) => {
      if (JSON.stringify(state) === JSON.stringify(newState)) {
        return;
      }
      dispatcher(newState);
    };

    return () => {
      delete contextValue.subscribers[subscriptionId];
    };
  }, []);

  useEffect(() => {
    Object.keys(contextValue.subscribers).forEach((key: string) => {
      if (key === subscriptionId) {
        return;
      }
      contextValue.subscribers[key](state);
    });
  }, [JSON.stringify(state)]);

  const setColors = (colors: types.colors) => {
    const newColors = objects.merge(state.colors, colors);

    contextValue.state = {
      ...contextValue.state,
      colors: newColors,
    };
    dispatcher({
      ...state,
    });
  };

  const setSizes = (sizes: types.sizes) => {
    const newSizes = objects.merge(state.sizes, sizes);

    dispatcher({
      ...state,
      sizes: newSizes,
    });
  };

  const hookDispatcher = {
    setColors,
    setSizes,
  };

  contextValue.state = state;
  return [state, hookDispatcher];
};

export default useConfiguration;
