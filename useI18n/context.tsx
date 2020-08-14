import React from "react";

export const context = React.createContext({
  state: {
    lang: "",
    strings: {},
  },
  subscribers: {},
});

const Provider = context.Provider;

interface II18n {
  children: any;
  lang: string;
  strings: object;
}

export const I18nProvider = ({ children, lang, strings }: II18n) => {
  return (
    <Provider value={{ state: { lang, strings }, subscribers: {} }}>
      {children}
    </Provider>
  );
};
