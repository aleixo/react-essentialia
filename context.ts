import React from 'react';

import * as types from './types';

const initialState = {
  colors: {
    primary: '',
    secondary: '',
    neutral: '',
    background: '',
    text: '',
  },
  themes: {
    primary: {},
    secondary: {},
  },
  sizes: {
    XL: 36,
    L: 30,
    M: 24,
    S: 20,
    XS: 18,
    XXS: 16,
    label: 14,
    paragraph: 10,
  },
  familyName: '',
};

export default React.createContext<types.context>({
  state: initialState,
  subscribers: {},
  styles: {},
});
