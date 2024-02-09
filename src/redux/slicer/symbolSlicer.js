import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const symbolSlicer = createSlice({
  name: "symbols",
  initialState,
  reducers: {
    setSymbolsState: (state, action) => action.payload,
  },
});

export const { setSymbolsState } = symbolSlicer.actions;
export default symbolSlicer.reducer;
