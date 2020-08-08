export interface highlight {
  start: number;
  end: number;
  elementId: number;
  id: number;
  payload?: Object | {};
  eventType: string | "";
}

export interface highlights {
  [key: number]: highlight;
}

export interface PublicProps {
  scrollable: boolean | false;
  fontScale: number | 1;
  html: string;
  newNoteText: string;
  updateNoteText: string;
  deleteNoteText: string;
  highlightColor?: string | "red";
  highlights?: highlights | {};
  onPress?: Function;
  onHighlight?: Function;
  highlightConfirmationDialog?: Function;
  theme: {
    backgroundColor: string;
    type: "light" | "normal" | "dark" | "default";
  };
}

export interface state {
  html: String;
  highlights?: highlights | {};
  confirmationHighlight?: highlight;
  fontScale: Number | 1;
  scrollTo: any;
}

export interface Context {
  state: state;
  dispatch: Function;
}
