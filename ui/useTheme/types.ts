export interface color {
  primary: string;
  background: string;
  lightPrimary: string;
  secondaryBackground: string;
  text: string;
  border: string;
  neutral: string;
  lightBorder: string;
  darkNeutral: string;
  neutral01: string;
  neutral02: string;
  s07: string;
  m12: string;
  m16: string;
}

export interface state {
  dark: boolean;
  colors: color;
  fontScale: number;
}

export interface context {
  state: state;
  subscribers: {};
}
