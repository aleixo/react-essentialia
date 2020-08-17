import React from "react";

import * as types from "./types";

const initialState = {
  familyName: "",
  styleExtensions: {},
};

export default React.createContext<types.context>({
  state: initialState,
  subscribers: {},
});
