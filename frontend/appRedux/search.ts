import { createSlice } from "@reduxjs/toolkit";

export interface SearchInt {
  searchHistory: { data: string; timeStamp: string }[];
}

/* some dummy data for initial state. */
const INIT_STATE: SearchInt = {
  searchHistory: [
    {
      data: "Martin Marietta Materials Inc.",
      timeStamp: new Date().toLocaleString(),
    },
    {
      data: "Encompass Services Corporation",
      timeStamp: new Date().toLocaleString(),
    },
    {
      data: "Equity Office Properties Trust",
      timeStamp: new Date().toLocaleString(),
    },
    {
      data: "Newell Rubbermaid Inc",
      timeStamp: new Date().toLocaleString(),
    },
    {
      data: "Adelphia Communications Corporation",
      timeStamp: new Date().toLocaleString(),
    },
  ],
};

const searchSlice = createSlice({
  name: "logFiles",
  initialState: INIT_STATE,
  reducers: {
    removeHistory: (state, action) => {
      const { data, timeStamp } = action.payload;
      state.searchHistory = state.searchHistory.filter(
        (item) => `${item.data}${item.timeStamp}` !== `${data}${timeStamp}`
      );
    },

    clearHistory: (state) => {
      state.searchHistory = [];
    },

    addHistory: (state, action) => {
      state.searchHistory.push({
        data: action.payload,
        timeStamp: new Date().toLocaleString(),
      });
    },
  },
});

const { actions, reducer } = searchSlice;
export const { removeHistory, addHistory, clearHistory } = actions;
export default reducer;
