import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const TransactionSlicer = createSlice({
  name: "deposits",
  initialState,
  reducers: {
    setDepositsState: (state, action) => action.payload,
  },
});

export const { setDepositsState } = TransactionSlicer.actions;
export default TransactionSlicer.reducer;
