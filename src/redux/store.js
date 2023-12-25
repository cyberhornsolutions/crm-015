import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import symbolSlicer from "./slicer/symbolSlicer";
import orderSlicer from "./slicer/orderSlicer";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    //api

    //slice
    symbols: symbolSlicer,
    orders: orderSlicer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([]),
});

export const persistor = persistStore(store);
