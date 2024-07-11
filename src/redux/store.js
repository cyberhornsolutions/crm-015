import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import symbolSlicer from "./slicer/symbolSlicer";
import orderSlicer from "./slicer/orderSlicer";
import transactionSlicer from "./slicer/transactionSlicer";
import assetGroupsSlicer from "./slicer/assetGroupsSlicer";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(
//   persistConfig,
//   combineReducers({
//     symbols: symbolSlicer,
//     orders: orderSlicer,
//     deposits: transactionSlicer,
//   })
// );

export const store = configureStore({
  // reducer: persistedReducer,
  reducer: {
    symbols: symbolSlicer,
    orders: orderSlicer,
    deposits: transactionSlicer,
    assetGroups: assetGroupsSlicer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([]),
});

// export const persistor = persistStore(store);
