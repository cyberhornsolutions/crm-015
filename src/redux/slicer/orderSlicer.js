import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const orderSlicer = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrdersState: (state, action) => action.payload,
  },
});

export const { setOrdersState } = orderSlicer.actions;
export default orderSlicer.reducer;
