import React from 'react';
import { Context as ContextType, PublicProps } from './types';

const initialContext: ContextType = {
  state: { highlights: [], html: '' },
  dispatch: () => {},
};

export const context = React.createContext<ContextType>(initialContext);
const Provider = context.Provider;

export const withProvider = (Children: any) => (props: PublicProps) => {
  return (
    <Provider
      value={{
        state: {
          html: props.html,
          highlights: props.highlights || {},
          fontScale: 1,
          theme: {
            backgroundColor: 'transparent',
            type: 'default',
          },
          scrollTo: undefined,
        },
      }}>
      <Children {...props} />
    </Provider>
  );
};
