import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const assetGroupsSlicer = createSlice({
  name: "assetGroups",
  initialState,
  reducers: {
    setAssetGroupsState: (state, action) => action.payload,
  },
});

export const { setAssetGroupsState } = assetGroupsSlicer.actions;
export default assetGroupsSlicer.reducer;
