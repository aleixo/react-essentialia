export interface state {
  lang: string;
  strings: object;
}

export interface context {
  state: state;
  subscribers: {};
}
