import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  symbols: [],
};

const symbolSlicer = createSlice({
  name: "symbols",
  initialState,
  reducers: {
    setSymbolsState: (state, action) => {
      state.symbols = action.payload;
    },
  },
  // extraReducers: {},
});

export const { setSymbolsState } = symbolSlicer.actions;
export default symbolSlicer.reducer;
