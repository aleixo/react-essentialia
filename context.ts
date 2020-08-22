import React from "react";

import * as types from "./types";

const initialState = {
  fontFamily: "",
  modifiers: () => {},
};

export default React.createContext<types.context>({
  state: initialState,
  subscribers: {},
});
