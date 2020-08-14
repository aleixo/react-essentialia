export interface colors {
  primary?: string;
  secondary?: string;
  neutral?: string;
  background?: string;
  text?: string;
}

export interface themes {
  primary: Object;
  secondary: Object;
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

export interface state {
  colors: colors;
  themes: themes;
  sizes: sizes;
  familyName: string;
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
    paddingHorizontal?: string;
    paddingVertical?: string;
  };
}

export interface context {
  state: state;
  subscribers: object;
  styles: {
    [key: string]: object;
  };
  styleExtensions?: styleExtensions;
}
