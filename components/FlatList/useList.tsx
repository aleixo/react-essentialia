import { useReducer } from "react";

type TActionTypes = "SET_MODE" | "SET_SELECTED_INDEX";
type TModes = "IDLE" | "LONG_PRESS" | "PRESS" | "DRAGGING";
type TState = {
  mode: TModes;
  selectedIndex: number;
  list: any;
  dropped: boolean;
};
type TDispatch = {
  setSelectedIndex(index: number): void;
  setMode(mode: TModes, index?: number): void;
  setList(data: any): void;
  reorderList(from: number, to: number): void;
};
type TAction = {
  type: TActionTypes;
  mode?: TModes;
  index?: number;
  data?: any;
  from?: number;
  to?: number;
};

const setMode = (state: TState, action: TAction) => ({
  ...state,
  mode: action.mode,
  selectedIndex: action.index || -1,
  dropped: state.mode === "DRAGGING" && action.mode === "IDLE",
});

const setSelectedIndex = (state: TState, action: TAction) => ({
  ...state,
  selectedIndex: action.index,
});

const stopDrag = (state: TState) => ({
  ...state,
  mode: "IDLE",
  selectedIndex: -1,
});

const setList = (state: TState, action: TAction) => ({
  ...state,
  data: action.data,
});

const reorderList = (state: TState, action: TAction) => {
  const { from = -1, to = -1 } = action;
  const { list } = state;
  if (from === -1 || to === -1) {
    return state;
  }
  const newList = list.reduce((prev, current, idx, self) => {
    if (from === to) {
      prev.push(current);
    }
    if (idx === from) {
      return prev;
    }
    if (from < to) {
      prev.push(current);
    }
    if (idx === to) {
      prev.push(self[from]);
    }
    if (from > to) {
      prev.push(current);
    }
    return prev;
  }, []);

  return {
    ...state,
    list: newList,
    selectedIndex: to,
  };
};

const reducer = (state: TState, action: TAction) => {
  const mapper = {
    SET_MODE: setMode,
    SET_SELECTED_INDEX: setSelectedIndex,
    STOP_DRAG: stopDrag,
    SET_DATA: setList,
    REORDER_LIST: reorderList,
  };

  return mapper[action.type](state, action);
};

const actions = {
  SET_MODE: "SET_MODE",
  SET_SELECTED_INDEX: "SET_SELECTED_INDEX",
  SET_DATA: "SET_DATA",
  REORDER_LIST: "REORDER_LIST",
};

const initialState = {
  mode: "IDLE",
  selectedIndex: -1,
  list: [],
};

const useList = (data: any): [TState, TDispatch] => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    list: data,
  });

  const setSelectedIndex = (index: number) =>
    dispatch({ type: actions.SET_SELECTED_INDEX, index });

  const setMode = (mode: TModes, index: number) =>
    dispatch({ type: actions.SET_MODE, mode, index });

  const setList = (data: any) => dispatch({ type: actions.SET_DATA, data });

  const reorderList = (from: number, to: number) =>
    dispatch({ type: actions.REORDER_LIST, from, to });

  return [
    state,
    {
      setSelectedIndex,
      setMode,
      setList,
      reorderList,
    },
  ];
};

export default useList;
