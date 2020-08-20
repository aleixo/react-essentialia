import React from "react";

import * as types from "./types";

const initialState = {
  familyName: "",
  modifiers: () => {},
};

export default React.createContext<types.context>({
  state: initialState,
  subscribers: {},
});
