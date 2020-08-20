export interface IColor {
  primary?: string;
  secondary?: string;
  backgroundColor?: string;
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

export type TAllowedModifiers = {
  color?: string;
};

export type TModifiers = (
  currentColor: IColor
) => {
  [key: string]: TAllowedModifiers;
};

export interface state {
  familyName?: string;
  modifiers?: TModifiers;
}

export interface context {
  state: state;
  subscribers: object;
}

// -------------------- HOOKS
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
