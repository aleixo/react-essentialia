export interface IColor {
  primary?: string;
  secondary?: string;
  background?: string;
  text?: string;
  border?: string;
  success?: string;
  error?: string;
  warn?: string;
}
export interface colors {
  default: IColor;
  [key: string]: IColor;
}

export interface sizes {
  XL?: number;
  L?: number;
  M?: number;
  S?: number;
  XS?: number;
  XXS?: number;
  paragraph?: number;
  label?: number;
}

type textStyleExtensions = {
  color?: string;
  borderWidth?: string;
};

export interface styleExtensions {
  default?: {
    color?: string;
    borderWidth?: string;
  };
  h1?: textStyleExtensions;
  h2?: textStyleExtensions;
  h3?: textStyleExtensions;
  h4?: textStyleExtensions;
  h5?: textStyleExtensions;
  h6?: textStyleExtensions;
  paragraph?: textStyleExtensions;
  label?: textStyleExtensions;
  button?: {
    color?: string;
    paddingHorizontal?: number;
    paddingVertical?: number;
  };
}

export interface state {
  familyName: string;
  styleExtensions?: styleExtensions;
}

export interface context {
  state: state;
  subscribers: object;
}

// THEME
export interface IThemeState {
  theme: string;
  color: IColor;
  colors: colors;
  fontScale: number;
  sizes: sizes;
  originalSizes: sizes;
}

export interface IThemeContext {
  state: IThemeState;
  subscribers: {};
}

// I18n
export interface II18nState {
  lang: string;
  strings: object;
}

export interface II18nContext {
  state: state;
  subscribers: {};
}
