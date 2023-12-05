import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  symbols: [],
};

const symbolSlicer = createSlice({
  name: "symbols",
  initialState,
  reducers: {
    setSymbols: (state, action) => {
      state.symbols = action.payload;
    },
  },
  extraReducers: {},
});

export const { setSymbols } = symbolSlicer.actions;
export default symbolSlicer.reducer;
